"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Star, MapPin, Loader2 } from "lucide-react";
import { Studio } from "@/types";

export default function FeaturedStudios() {
  const [featuredStudios, setFeaturedStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        
        // এনভায়রনমেন্ট ভেরিয়েবল ব্যবহার করা হয়েছে (ফলব্যাক হিসেবে লোকালহোস্ট রাখা হয়েছে)
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/studios`);
        
        if (!res.ok) throw new Error("Failed to fetch studios");
        
        const data = await res.json();
        
        // ডাটা অ্যারে কি না তা নিশ্চিত করে প্রথম ৬টি আইটেম সেট করা হচ্ছে
        if (Array.isArray(data)) {
          setFeaturedStudios(data.slice(0, 6));
        } else {
          setFeaturedStudios([]);
        }
      } catch (error) {
        console.error("Error fetching featured studios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-muted/40 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Featured Studios</h2>
            <p className="text-muted-foreground mt-1">Top-rated production studios ready for instant booking.</p>
          </div>
          <Link
            href="/studios"
            className="text-primary font-semibold hover:underline flex items-center gap-1.5 w-max"
          >
            View All Studios <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : featuredStudios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStudios.map((studio) => (
              <div
                key={studio._id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={studio.image}
                    alt={studio.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {studio.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" /> {studio.location}</span>
                    <span className="flex items-center gap-1 font-semibold text-foreground bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {studio.rating}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {studio.title}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div>
                      <span className="text-2xl font-extrabold text-foreground">${studio.hourlyRate}</span>
                      <span className="text-xs text-muted-foreground"> / hr</span>
                    </div>
                    <Link
                      href={`/studios/${studio._id}`}
                      className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold rounded-xl text-sm transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No featured studios found.
          </div>
        )}
      </div>
    </section>
  );
}