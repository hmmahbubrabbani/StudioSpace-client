"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PlusCircle, 
  Camera, 
  DollarSign, 
  MapPin, 
  Users, 
  Image as ImageIcon, 
  FileText,
  Loader2 
} from "lucide-react";
import { toast } from "sonner"; // 🔥 sonner থেকে toast ইম্পোর্ট করা হলো
import { Studio } from "@/types";
import { authClient } from "@/lib/auth-client"; // Better Auth client ইম্পোর্ট

export default function AddStudioPage() {
  const router = useRouter();

  // Better Auth থেকে রিয়েল-টাইম সেশন ফেচ করা
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);

  // State typed to align with the Studio creation payload structure
  const [formData, setFormData] = useState({
    title: "",
    category: "Photo Studio" as Studio["category"],
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    image: "",
    amenities: [] as string[],
    overview: "",
  });

  const availableAmenities = [
    "Lighting Grid",
    "Cyclorama Wall",
    "Soundproofed",
    "4K Cinema Cameras",
    "Neve / SSL Mixing Console",
    "Green Screen",
    "Makeup & Dressing Room",
    "High-Speed Wi-Fi",
    "Free Parking",
    "Lounge & Refreshments",
  ];

  const handleCheckboxChange = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      if (exists) {
        return { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      toast.error("Authentication Required", {
        description: "Please sign in to list a studio.",
      });
      router.push("/signin");
      return;
    }

    try {
      // ১. authClient থেকে সিক্রেট টোকেন ফেচ করা
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      if (!token) {
        toast.error("Unauthorized", {
          description: "Authentication token missing. Please sign in again.",
        });
        router.push("/signin");
        return;
      }

      // Payload structured and typed using Studio interface definitions
      const payload: Omit<Studio, "_id"> = {
        title: formData.title,
        category: formData.category,
        hourlyRate: Number(formData.hourlyRate),
        securityDeposit: Number(formData.securityDeposit),
        maxCapacity: Number(formData.maxCapacity),
        location: formData.location,
        image: formData.image,
        amenities: formData.amenities,
        overview: formData.overview,
        rating: 5.0, // Default rating for new listings
        reviewsCount: 0,
        host: {
          name: user.name || "Studio Host",
          email: user.email,
          verified: true,
          memberSince: new Date().getFullYear().toString(),
        },
        createdAt: new Date(),
      };

      // ২. ব্যাকএন্ডে টোকেনসহ রিকোয়েস্ট পাঠানো
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/studios`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // টোকেন পাস করা হলো
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create listing on server");
      }

      toast.success("Studio Listed Successfully! 🎉", {
        description: "Your creative space has been published to StudioSpace database.",
      });

      router.push("/my-listings");
    } catch (error: any) {
      console.error(error);
      toast.error("Error Creating Listing", {
        description: error.message || "Could not connect to server. Please ensure your backend is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4 text-white">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-neutral-400">Authenticating session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-card border border-border rounded-3xl p-16 text-center space-y-6 max-w-lg mx-auto my-20 shadow-sm text-white">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Camera className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Sign In Required</h3>
          <p className="text-sm text-neutral-400">
            Please sign in to your host account to publish new studio spaces.
          </p>
        </div>
        <Link
          href="/signin"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/95 transition-all text-sm"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      
      {/* Header */}
      <div className="mb-8 space-y-2 border-b border-border pb-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
          <PlusCircle className="w-3.5 h-3.5" /> Host Dashboard ({user.name})
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          List a New Studio
        </h1>
        <p className="text-sm text-muted-foreground">
          Share your cyc wall, sound stage, or recording studio with thousands of active creators.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" /> Basic Studio Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground">Studio Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Infinity Cyc & Lighting Grid Studio"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Studio["category"] })}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Photo Studio">Photo Studio</option>
                <option value="Film Stage">Film Stage</option>
                <option value="Podcast Lounge">Podcast Lounge</option>
                <option value="Music Suite">Music Suite</option>
                <option value="Workshop">Art Workshop</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location / Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Brooklyn, NY or Los Angeles, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Capacity */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" /> Rates & Capacity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Hourly Rate ($USD) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="85"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Security Deposit ($USD)</label>
              <input
                type="number"
                min="0"
                placeholder="200"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Max Capacity (Persons) *</label>
              <div className="relative">
                <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="15"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Media & Imagery */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" /> Studio Image URL
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Image Direct Link (ImgBB / Unsplash / Postimage) *</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">Provide a high-resolution photo showcasing your studio setup.</p>
          </div>
        </div>

        {/* Section 4: Amenities List */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-lg font-bold text-foreground">Included Amenities</h2>
          <p className="text-xs text-muted-foreground">Select all equipment and features available at your studio.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {availableAmenities.map((amenity) => (
              <label
                key={amenity}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.amenities.includes(amenity)
                    ? "border-primary bg-primary/5 text-foreground font-medium"
                    : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleCheckboxChange(amenity)}
                  className="rounded border-input text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 5: Detailed Overview */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Detailed Overview & Rules
          </h2>
          <textarea
            required
            rows={5}
            placeholder="Describe lighting gear, ceiling height, power outlets, load-in access, and studio rules..."
            value={formData.overview}
            onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
            className="w-full bg-background border border-input rounded-xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Section 6: Dynamic Host Information (Connected to Better Auth) */}
        <div className="p-4 bg-muted/50 rounded-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Host Information (Logged In)</span>
            <p className="text-sm font-bold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
            Verified Account
          </span>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-2xl shadow-lg hover:bg-primary/95 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Publishing Studio...
              </>
            ) : (
              "Publish Studio Listing"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}