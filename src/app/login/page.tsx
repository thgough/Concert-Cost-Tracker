import AuthForm from "@/components/AuthForm";
import ThemeSelector from "@/components/ThemeSelector";
import FadeIn from "@/components/motion/FadeIn";

export default function LoginPage() {
  return (
    <div className="min-h-screen login-hero flex flex-col">
      <div className="flex justify-end p-4">
        <ThemeSelector />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <FadeIn className="text-center max-w-xl mb-8">
          <p className="text-sm uppercase tracking-widest opacity-70 mb-2">
            Your shows, your stats
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
            Concert Cost Tracker
          </h1>
          <p className="mt-4 text-lg opacity-80">
            Log every concert you attend, track what you spent, rate how much fun
            you had, and see which shows gave you the best bang for your buck.
          </p>
        </FadeIn>
        <AuthForm />
      </div>
    </div>
  );
}
