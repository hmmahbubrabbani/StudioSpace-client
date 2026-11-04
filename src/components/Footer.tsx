"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Mail, Send, ShieldCheck } from "lucide-react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#141414] border-t border-neutral-800 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Studio<span className="text-primary">Space</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed pr-4 text-neutral-400">
              StudioSpace is a high-performance peer-to-peer marketplace empowering filmmakers, photographers, podcasters, and musicians to discover and book world-class production spaces instantly.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Host Guarantee Protected
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/studios" className="hover:text-primary transition-colors">Explore Studios</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/#about-us" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/signin" className="hover:text-primary transition-colors">Creator Login</Link></li>
            </ul>
          </div>

          {/* Popular Studio Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Studio Categories</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/studios?category=Photo+Studio" className="hover:text-primary transition-colors">Photo Cyc Walls</Link></li>
              <li><Link href="/studios?category=Film+Stage" className="hover:text-primary transition-colors">Cinema Sound Stages</Link></li>
              <li><Link href="/studios?category=Podcast+Lounge" className="hover:text-primary transition-colors">Podcast Lounges</Link></li>
              <li><Link href="/studios?category=Music+Suite" className="hover:text-primary transition-colors">Music Recording Suites</Link></li>
              <li><Link href="/studios?category=Workshop" className="hover:text-primary transition-colors">Art Workshops</Link></li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Stay Updated</h3>
            <p className="text-xs text-neutral-400">Subscribe for new studio drops, creator tips, and exclusive discount codes.</p>
            
              
             
            <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-12">
              
            Subscribe
          </Link>
            
          </div>

        </div>

        {/* Bottom Bar: Copyright & New X Logo */}
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} StudioSpace Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <div className="flex items-center gap-4">
              {/* New X Logo (Replacing Twitter Bird) */}
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="X (Twitter)"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}