"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookmarkCheck, 
  Search, 
  Loader2
} from "lucide-react";
import { toast } from "sonner"; 
import { Booking } from "@/types";
import BookingCard from "@/components/studio/BookingCard";
import { authClient } from "@/lib/auth-client";

export default function MyBookingsPage(){
  
  
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () =>{
      try {
        setLoading(true);

        const { data: tokenData } = await authClient.token();
        const token = tokenData?.token;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings?creatorEmail=${user.email}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || `Server responded with status ${res.status}`);
        }

        const data = await res.json();
        setBookings(data);
      } catch (error: any) {
        console.error("Detailed Fetch Error:", error.message);
        toast.error("Error", {
          description: error.message || "Could not load your bookings from server.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.email]);

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
          <BookmarkCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Sign In Required</h3>
          <p className="text-sm text-neutral-400">
            Please sign in to your account to view and manage your studio reservations.
          </p>
        </div>
        <Link
          href="/signin"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all text-sm"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-white">
      
     
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
            <BookmarkCheck className="w-3.5 h-3.5" /> Creator Dashboard ({user.name})
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            My Studio Bookings
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your upcoming studio sessions, check confirmation status, and manage reservations.
          </p>
        </div>

        <Link
          href="/studios"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-2xl shadow-md hover:bg-primary/90 transition-all text-sm"
        >
          <Search className="w-4 h-4" /> Browse More Studios
        </Link>
      </div>

      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your bookings...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <BookingCard 
              key={booking._id} 
              booking={booking} 
              onCancelSuccess={(id) =>{
                setBookings((prev) => prev.filter((b) => b._id !== id));
              }}
            />
          ))}
        </div>
      ) : (
       
        <div className="bg-card border border-border rounded-3xl p-16 text-center space-y-6 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <BookmarkCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">No Bookings Found</h3>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t reserved any creative workspaces yet. Explore our directory and book your next shoot today!
            </p>
          </div>
          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all text-sm"
          >
            <Search className="w-4 h-4" /> Explore Studios Directory
          </Link>
        </div>
      )}

    </div>
  );
}