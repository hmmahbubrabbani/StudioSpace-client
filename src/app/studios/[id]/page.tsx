"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ArrowLeft, 
  X,
  Loader2,
  Edit
} from "lucide-react";
import { toast } from "sonner"; 
import { Studio } from "@/types";
import { authClient } from "@/lib/auth-client"; 

function StudioDetailsContent(){
  const params = useParams();
  const router = useRouter();
  
  const studioId = params?.id as string;

 
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [fetching, setFetching] = useState(true);

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [hours, setHours] = useState(3);
  const [loading, setLoading] = useState(false);

  
  useEffect(() =>{
    if (!studioId) return;

    const fetchStudio = async () => {
      try {
        setFetching(true);
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${baseUrl}/studios/${studioId}`);
        if (!res.ok) throw new Error("Failed to fetch studio details");
        const data = await res.json();
        setStudio(data);
      } catch (error) {
        console.error("Error loading studio:", error);
        toast.error("Error", {
          description: "Could not load studio details from server.",
        });
      } finally {
        setFetching(false);
      }
    };

    fetchStudio();
  }, [studioId]);

  if (fetching){
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-neutral-400">Loading studio workspace...</p>
      </div>
    );
  }

  if (!studio){
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white">Studio Not Found</h2>
        <p className="text-neutral-400">The studio you are looking for does not exist or has been removed.</p>
        <Link href="/studios" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Back to Studios
        </Link>
      </div>
    );
  }

  const securityDeposit = studio.securityDeposit || 150;
  const totalCost = (studio.hourlyRate * Number(hours)) + securityDeposit;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   
    if (!user) {
      toast.error("Sign In Required", {
        description: "Please sign in to your account to book a studio session.",
      });
      router.push("/signin");
      return;
    }

    setLoading(true);

    try {
      
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      const bookingPayload = {
        studioId: studio._id,
        studioTitle: studio.title,
        hostEmail: studio.host?.email || "host@studiospace.com",
        creatorEmail: user.email, 
        bookingDate,
        startTime,
        hours: Number(hours),
        totalCost,
        status: "Confirmed",
        createdAt: new Date(),
      };

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
     
      const res = await fetch(`${baseUrl}/bookings`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to create booking");
      }

      toast.success("Booking Confirmed! ", {
        description: `Successfully reserved ${studio.title} for ${hours} hours.`,
      });

      setIsModalOpen(false);
      router.push("/my-bookings");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("Booking Failed",{
        description: error.message || "Could not complete your reservation. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      
    
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
              {studio.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {studio.rating} ({studio.reviewsCount ?? 0} reviews)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {studio.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button 
            onClick={() => router.push("/studios")}
            className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold rounded-xl text-sm hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
          >
              ← Back 
          </button>

          {/* Edit Button - Redirects to /studios/edit/[id] Private Page */}
          <button 
            onClick={() => router.push(`/studios/edit/${studio._id}`)}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>

      {/* Dynamic Studio Image */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 aspect-[16/9] max-h-[400px] w-full bg-neutral-900">
        <img 
          src={studio.image} 
          alt={studio.title} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Main Grid Content & Booking Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
          
          <div className="grid grid-cols-3 gap-4 p-6 bg-[#141414] border border-neutral-800 rounded-2xl shadow-sm text-center">
            <div className="space-y-1">
              <span className="text-xs text-neutral-400 uppercase font-medium">Hourly Rate</span>
              <p className="text-2xl font-extrabold text-white">${studio.hourlyRate}</p>
            </div>
            <div className="space-y-1 border-x border-neutral-800">
              <span className="text-xs text-neutral-400 uppercase font-medium">Max Capacity</span>
              <p className="text-2xl font-extrabold text-white flex items-center justify-center gap-1">
                <Users className="w-5 h-5 text-primary" /> {studio.maxCapacity}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-neutral-400 uppercase font-medium">Security Deposit</span>
              <p className="text-2xl font-extrabold text-white">${securityDeposit}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Detailed Overview</h2>
            <p className="text-neutral-400 leading-relaxed text-base">
              {studio.overview}
            </p>
          </div>

          {studio.amenities && studio.amenities.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Included Equipment & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {studio.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 bg-[#141414] border border-neutral-800 rounded-xl text-sm font-medium text-white">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 bg-[#141414] border border-neutral-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border-2 border-primary/20">
                {studio.host?.name ? studio.host.name.charAt(0) : "H"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Hosted by {studio.host?.name || "Studio Host"}</h3>
                  {studio.host?.verified && <ShieldCheck className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-xs text-neutral-400">Verified professional studio host on StudioSpace</p>
              </div>
            </div>
            <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
              Verified Host
            </span>
          </div>

        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="space-y-6">
          <div className="sticky top-28 bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-baseline justify-between border-b border-neutral-800 pb-6">
              <div>
                <span className="text-3xl font-extrabold text-white">${studio.hourlyRate}</span>
                <span className="text-sm text-neutral-400"> / hour</span>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-semibold">
                Available Today
              </span>
            </div>

            <div className="space-y-4 text-sm text-neutral-400">
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span className="font-semibold text-white">${securityDeposit}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Service Fee</span>
                <span className="font-semibold text-white">Free</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-2xl shadow-lg hover:bg-primary/90 transition-all text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarIcon className="w-5 h-5" />Book Workspace Now
            </button>

            <p className="text-xs text-center text-neutral-400">
              Instant dynamic reservation confirmed upon submission.
            </p>
          </div>
        </div>

      </div>

      {/* Booking Modal with White Picker Icons */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-white">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">Instant Reservation</span>
              <h3 className="text-2xl font-bold text-white">Book {studio.title}</h3>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Select Shoot Date *</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ colorScheme: "dark" }}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Duration (Hours) *</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:invert [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:invert"
                  />
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>{hours} hours × ${studio.hourlyRate}/hr</span>
                  <span className="font-semibold text-white">${studio.hourlyRate * Number(hours)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Security Deposit (Refundable)</span>
                  <span className="font-semibold text-white">${securityDeposit}</span>
                </div>
                <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold text-base text-white">
                  <span>Total Estimated Cost</span>
                  <span className="text-primary">${totalCost}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Booking...
                  </>
                ) : (
                  "Confirm & Book Space"
                )}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default function StudioDetailsPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-neutral-400">Loading studio details...</div>}>
      <StudioDetailsContent />
    </Suspense>
  );
}