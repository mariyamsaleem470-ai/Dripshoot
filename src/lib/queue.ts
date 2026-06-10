import { Queue } from 'bullmq'

const connection = {
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null
}

export { connection }
export const generationQueue = new Queue('image-generation', { connection })
