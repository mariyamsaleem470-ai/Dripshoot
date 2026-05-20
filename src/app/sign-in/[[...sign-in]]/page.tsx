import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-violet-700/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-fuchsia-700/8 blur-[80px]" />
      </div>
      <div className="relative z-10">
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#7c3aed",
              colorBackground: "#0f0f0f",
              colorInputBackground: "#1a1a1a",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "#9ca3af",
              borderRadius: "0.75rem",
              fontFamily: "inherit",
            },
            elements: {
              card: "bg-[#0f0f0f] border border-white/[0.07] shadow-2xl",
              headerTitle: "text-white font-semibold",
              headerSubtitle: "text-white/40",
              socialButtonsBlockButton:
                "bg-white/[0.04] border border-white/10 text-white hover:bg-white/[0.08] transition-colors",
              dividerLine: "bg-white/10",
              dividerText: "text-white/25",
              formFieldLabel: "text-white/60 text-sm",
              formFieldInput:
                "bg-[#1a1a1a] border border-white/10 text-white placeholder-white/25 focus:border-violet-500/60 rounded-lg",
              formButtonPrimary:
                "bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors",
              footerActionLink: "text-violet-400 hover:text-violet-300",
              identityPreviewText: "text-white/60",
              identityPreviewEditButton: "text-violet-400",
              formResendCodeLink: "text-violet-400",
              alertText: "text-white/60",
            },
          }}
        />
      </div>
    </main>
  );
}
