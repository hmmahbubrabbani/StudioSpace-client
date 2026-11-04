import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-30 bg-muted/40 border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mx-auto">
          <Sparkles className="w-4 h-4" /> Join 10,000+ Creators Today
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Ready to Bring Your Next Project to Life?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
          Explore top-tier production environments across major cities or list your own creative space in under 5 minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/studios"
            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            Explore Studios <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 border border-border bg-card text-foreground font-semibold rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-2"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </section>
  );
}