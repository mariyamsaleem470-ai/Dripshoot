import { SignUp } from "@clerk/nextjs";

const CARDS = [
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
    alt: "Fashion model in studio",
    cls: "animate-float-a",
    style: { transform: "rotate(-6deg)", top: "10px", left: "0px", zIndex: 1 },
    tag: "Studio Shot ✨",
  },
  {
    src: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=300",
    alt: "Fashion model outdoor",
    cls: "animate-float-b",
    style: { transform: "rotate(2deg)", top: "0px", left: "120px", zIndex: 20 },
    tag: "AI Generated ✨",
  },
  {
    src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300",
    alt: "Fashion editorial",
    cls: "animate-float-c",
    style: { transform: "rotate(8deg)", top: "20px", left: "240px", zIndex: 1 },
    tag: "Editorial ✨",
  },
];

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white flex overflow-hidden">

      {/* ── Left hero panel (60%) ── */}
      <div className="hidden lg:flex lg:w-[60%] relative flex-col overflow-hidden">

        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[10%] w-[600px] h-[600px] rounded-full bg-violet-700/20 blur-[130px]" />
          <div className="absolute bottom-[5%] right-[-10%] w-[400px] h-[400px] rounded-full bg-fuchsia-700/15 blur-[110px]" />
          <div className="absolute top-[55%] left-[-8%] w-[300px] h-[300px] rounded-full bg-violet-900/20 blur-[90px]" />
        </div>

        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full px-12 py-10">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L5 7L8 10L10 5L13 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[18px] font-semibold tracking-tight">
              Drip<span className="text-violet-400">Shoots</span>
            </span>
          </a>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs bg-violet-500/10 text-violet-300 px-3 py-1.5 rounded-full mb-7 border border-violet-500/20 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              AI-Powered Fashion Photography
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight mb-5">
              Join thousands of<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                fashion brands
              </span>
            </h1>

            <p className="text-white/50 text-lg mb-14 leading-relaxed">
              Start creating professional AI model photos today
            </p>

            {/* Floating cards */}
            <div className="relative h-64 mb-14 select-none">
              {CARDS.map((card) => (
                <div
                  key={card.src}
                  className={`absolute w-36 h-52 rounded-2xl overflow-hidden border border-violet-500/30 shadow-2xl shadow-violet-900/40 ${card.cls}`}
                  style={card.style as React.CSSProperties}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    alt={card.alt}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {/* Violet glow ring */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-violet-400/20" />
                  {/* Tag */}
                  <div className="absolute bottom-2.5 left-2 right-2">
                    <span className="text-[10px] bg-black/60 backdrop-blur-sm text-violet-300 px-2 py-1 rounded-full border border-violet-500/20">
                      {card.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/30">
            {["10,000+ photos generated", "500+ brands", "50+ countries"].map((stat, i) => (
              <span key={stat} className="flex items-center gap-3">
                {i > 0 && <span className="text-white/15">·</span>}
                {stat}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* ── Right auth panel (40%) ── */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 relative bg-[#080808] lg:bg-transparent">

        {/* Mobile-only ambient */}
        <div className="absolute inset-0 pointer-events-none lg:hidden">
          <div className="absolute top-[-20%] left-[30%] w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-[120px]" />
        </div>

        {/* Right-side subtle separator line */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-white/[0.05]" />

        <div className="relative z-10 w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L5 7L8 10L10 5L13 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-tight">
              Drip<span className="text-violet-400">Shoots</span>
            </span>
          </div>

          {/* Card wrapper */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/[0.07] p-8 shadow-2xl">

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-1">Create your account</h2>
              <p className="text-zinc-400 text-sm">Get started with DripShoots for free</p>
            </div>

            <SignUp
              appearance={{
                variables: {
                  colorPrimary: "#7c3aed",
                  colorBackground: "#0f0f1a",
                  colorInputBackground: "#1a1a2e",
                  colorInputText: "#ffffff",
                  colorText: "#ffffff",
                  colorTextSecondary: "#a1a1aa",
                  colorShimmer: "#1a1a2e",
                  colorAlphaShimmer: "#1a1a2e",
                  borderRadius: "12px",
                  fontFamily: "inherit",
                },
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-none p-0 w-full",
                  headerTitle: "text-white text-2xl font-bold",
                  headerSubtitle: "text-zinc-400 text-sm",
                  socialButtonsBlockButton: "!bg-white !text-gray-800 !border-0 hover:!bg-gray-100 !transition-colors !rounded-xl !font-medium",
                  socialButtonsBlockButtonText: "!text-gray-800 !font-medium",
                  socialButtonsBlockButtonArrow: "!text-gray-800",
                  dividerLine: "!bg-white/20",
                  dividerText: "!text-zinc-400 !text-xs",
                  formFieldLabel: "!text-zinc-200 !text-sm !font-medium",
                  formFieldInput: "!bg-white/10 !border !border-white/20 !text-white placeholder:!text-zinc-500 !rounded-xl",
                  formButtonPrimary: "!bg-violet-600 hover:!bg-violet-700 !text-white !font-semibold !rounded-xl",
                  footerActionLink: "!text-violet-400 hover:!text-violet-300 !font-medium",
                  footerActionText: "!text-zinc-400",
                  formFieldErrorText: "!text-red-400 !text-xs",
                  alertText: "!text-red-400",
                  identityPreviewText: "!text-white",
                  identityPreviewEditButton: "!text-violet-400",
                  otpCodeFieldInput: "!bg-white/10 !border !border-white/20 !text-white !rounded-xl !text-center !text-2xl !font-bold",
                  otpCodeField: "gap-2",
                  otpCodeFieldInputs: "gap-2",
                  verificationLinkStatusText: "!text-white",
                  verificationLinkStatusIcon: "!text-violet-400",
                  formResendCodeLink: "!text-violet-400 hover:!text-violet-300",
                  backLink: "!text-violet-400 hover:!text-violet-300",
                  backLinkArrow: "!text-violet-400",
                  spinner: "!text-violet-400",
                  loadingPage: "!bg-[#0f0f1a]",
                  verificationPage: "!bg-[#0f0f1a]",
                  alternativeMethodsBlockButton: "!bg-white/5 !border !border-white/10 !text-white hover:!bg-white/10 !rounded-xl",
                  alternativeMethodsBlockButtonText: "!text-white",
                  headerBackIcon: "!text-white",
                  headerBackLink: "!text-white/60 hover:!text-white",
                  otpCodeFieldInputFocusRing: "!ring-violet-500",
                  formFieldHintText: "!text-zinc-400 !text-xs",
                  formFieldSuccessText: "!text-green-400 !text-xs",
                  avatarBox: "!rounded-xl",
                  userPreviewMainIdentifier: "!text-white !font-medium",
                  userPreviewSecondaryIdentifier: "!text-zinc-400 !text-sm",
                  userButtonPopoverCard: "!bg-[#13131a] !border !border-white/10",
                  userButtonPopoverActionButton: "!text-white hover:!bg-white/5",
                  userButtonPopoverActionButtonText: "!text-white",
                  userButtonPopoverFooter: "!border-t !border-white/10",
                  pageScrollBox: "!bg-transparent",
                  main: "!bg-transparent",
                },
              }}
            />
          </div>
        </div>
      </div>

    </main>
  );
}
