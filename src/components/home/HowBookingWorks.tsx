import { MapPin, Clock, CheckCircle2, Headphones } from "lucide-react";

export default function HowBookingWorks() {
  const steps = [
    { step: "01", title: "Discover Spaces", desc: "Filter by category, location, and hourly rate to find your ideal studio.", icon: MapPin },
    { step: "02", title: "Select Shoot Hours", desc: "Inspect dynamic calendar availability and choose your required time slots.", icon: Clock },
    { step: "03", title: "Book Instantly", desc: "Secure your reservation safely with instant confirmation and transparent pricing.", icon: CheckCircle2 },
    { step: "04", title: "Create & Produce", desc: "Arrive at the verified studio and bring your creative vision to life.", icon: Headphones },
  ];

  return (
    <section id="how-it-works" className="w-full bg-muted/40 py-20 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">How Booking Works</h2>
          <p className="text-muted-foreground">Reserve your professional creative workspace in 4 simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-card border border-border p-8 rounded-2xl relative space-y-4 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 group"
              >
                <span className="text-4xl font-extrabold text-primary/20 absolute top-6 right-6 transition-colors duration-300 group-hover:text-primary/40">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}