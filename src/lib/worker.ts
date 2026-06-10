import { Worker, Job } from 'bullmq'
import { connection } from './queue'
import { prisma } from './prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const FASHN_BASE = "https://api.fashn.ai/v1"
const CREDIT_COST: Record<string, number> = { standard: 1, high: 3, ultra: 5 }

async function uploadToCloudinary(imageUrl: string): Promise<string> {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: 'dripshoots',
    resource_type: 'image',
  })
  return result.secure_url
}

async function generateWithFashn(garmentImageUrl: string, prompt: string, numImages: number, quality: string): Promise<string[]> {
  const qualityMode = quality === "ultra" ? "quality" : quality === "high" ? "balanced" : "performance"
  const runRes = await fetch(`${FASHN_BASE}/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_name: "product-to-model",
      inputs: {
        product_image: garmentImageUrl,
        prompt,
        num_images: numImages,
        output_format: "png",
        generation_mode: qualityMode
      }
    })
  })
  const runData = await runRes.json()
  if (runData.error) throw new Error(`FASHN error: ${JSON.stringify(runData.error)}`)
  const predId = runData.id
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 3000))
    const poll = await fetch(`${FASHN_BASE}/status/${predId}`, {
      headers: { Authorization: `Bearer ${process.env.FASHN_API_KEY}` }
    })
    const result = await poll.json()
    if (result.status === "completed") return result.output
    if (result.status === "failed") throw new Error("Fashn.ai failed")
  }
  throw new Error("Fashn.ai timeout")
}

export const worker = new Worker('image-generation', async (job: Job) => {
  const { clerkId, garmentImageUrl, gender, ethnicity, ageGroup, occasion, background, category, fabricStyle, sides, numImages, quality } = job.data

  const creditCostPerImage = CREDIT_COST[quality] || 1
  const allImages: string[] = []
  let totalImagesGenerated = 0

  await job.updateProgress(5)

  for (let sideIndex = 0; sideIndex < sides.length; sideIndex++) {
    const side = sides[sideIndex]
    const prompt = `${ethnicity} ${gender} model, ${occasion} setting, ${background} background, professional fashion photography`
    let generatedUrls: string[] = []

    try {
      generatedUrls = await generateWithFashn(garmentImageUrl, prompt, numImages, quality)
    } catch (err) {
      console.error(`Generation error side=${side}:`, err)
      continue
    }

    for (const url of generatedUrls) {
      try {
        const cloudUrl = await uploadToCloudinary(url)
        allImages.push(cloudUrl)
      } catch {
        allImages.push(url)
      }
      totalImagesGenerated++
    }

    await job.updateProgress(Math.round(((sideIndex + 1) / sides.length) * 80) + 10)
  }

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (user && allImages.length > 0) {
    await prisma.user.update({
      where: { clerkId },
      data: {
        credits: { decrement: totalImagesGenerated * creditCostPerImage },
        creditsUsed: { increment: totalImagesGenerated * creditCostPerImage }
      }
    })
    const projectName = `${category} · ${occasion} · ${ethnicity} ${gender}`
    await prisma.project.create({
      data: {
        userId: user.id,
        name: projectName,
        status: "completed",
        gender,
        ethnicity,
        occasion,
        uploads: { create: [{ imageUrl: garmentImageUrl }] },
        images: { create: allImages.map(url => ({ imageUrl: url })) }
      }
    })
  }

  await job.updateProgress(100)
  return { images: allImages }

}, { connection, concurrency: 3 })

worker.on('completed', (job) => console.log(`Job ${job.id} completed`))
worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed:`, err))
