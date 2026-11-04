import Link from "next/link";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function HostGuarantee() {
  return (
    <section id="about-us" className="py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
              <ShieldCheck className="w-4 h-4" /> Trusted Platform Assurance
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Host Guarantee & Creator Support
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are booking a multi-thousand-dollar cinema sound stage or listing your home photography studio, StudioSpace provides rigorous protection and dedicated round-the-clock support.
            </p>
            <div className="space-y-4 pt-2">
              {[
                "Comprehensive liability protection for hosts and equipment",
                "Verified creator and host profiles with secure ID checks",
                "24/7 dedicated customer and technical support team",
                "Transparent cancellation policies and instant refunds",
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-border bg-card p-8 space-y-6">
            <h3 className="text-xl font-bold text-foreground">Ready to Share Your Space?</h3>
            <p className="text-sm text-muted-foreground">
              Turn your unused production studio, music room, or cyc wall into a steady revenue stream. List with StudioSpace today.
            </p>
            <Link
              href="/add-studio"
              className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              List Your Studio Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}