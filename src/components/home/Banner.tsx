"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useState, useEffect } from "react";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Banner() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const slides = [
    {
      id: 1,
      tag: "Featured Stage",
      title: "Infinity Cyc & Lighting Grid",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80",
      location: "Brooklyn, NY • $85 / hr",
    },
    {
      id: 2,
      tag: "Dolby Atmos Sound",
      title: "World-Class Acoustic & Recording Suite",
      image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&auto=format&fit=crop&q=80",
      location: "Los Angeles, CA • $150 / hr",
    },
    {
      id: 3,
      tag: "Podcast & Lounge",
      title: "Professional Podcast & Interview Space",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&auto=format&fit=crop&q=80",
      location: "Austin, TX • $50 / hr",
    },
  ];

  if (!isMounted) {
    return (
      <section className="relative bg-gradient-to-b from-primary/10 via-background to-background py-16 lg:py-24 overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-[400px] flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading banner...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-b from-primary/10 via-background to-background py-16 lg:py-24 overflow-hidden border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content (Static - Does not slide) */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" /> Next-Gen P2P Creative Marketplace
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Book Professional Studios for Your Next <span className="text-primary">Masterpiece</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Discover cyc walls, cinema sound stages, podcast lounges, and recording suites instantly. Transparent pricing, dynamic booking, and verified hosts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/studios"
                className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                Explore Studios <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/add-studio"
                className="w-full sm:w-auto px-8 py-3.5 border border-border bg-card text-foreground font-semibold rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-2"
              >
                Host Your Space
              </Link>
            </div>
          </div>

          {/* Right Image Slider (Only images & tags slide) */}
          <div className="relative">
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              effect={"fade"}
              fadeEffect={{ crossFade: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="w-full pb-10"
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border aspect-[4/3] group">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                      <span className="text-xs uppercase tracking-widest bg-primary text-primary-foreground px-3 py-1 rounded-full w-max mb-2 font-medium">
                        {slide.tag}
                      </span>
                      <h3 className="text-xl font-bold">{slide.title}</h3>
                      <p className="text-sm text-gray-300">{slide.location}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </div>
      </div>
    </section>
  );
}