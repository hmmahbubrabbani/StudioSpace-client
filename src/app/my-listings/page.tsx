"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  PlusCircle, 
  ListOrdered, 
  Building2,
  Loader2 
} from "lucide-react";
import { toast } from "sonner"; 
import { Studio } from "@/types";
import StudioListingCard from "@/components/studio/StudioListingCard";
import { authClient } from "@/lib/auth-client"; 

export default function MyListingsPage(){

  
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [listings, setListings] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    if (!user?.email){
      setLoading(false);
      return;
    }

    const fetchMyListings = async () =>{
      try {
        setLoading(true);
       
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/studios?hostEmail=${user.email}`);
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data);
      } catch (error: any) {
        console.error("Error fetching my listings:", error);
        toast.error("Connection Error", {
          description: error.message || "Could not retrieve your listings from the server.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
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
          <Building2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Sign In Required</h3>
          <p className="text-sm text-neutral-400">
            Please sign in to your host account to manage or add studio listings.
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
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
            <ListOrdered className="w-3.5 h-3.5" /> Host Management ({user.name})
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            My Studio Listings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your published creative workspaces, update rates, or list new properties.
          </p>
        </div>

        <Link
          href="/add-studio"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-2xl shadow-md hover:bg-primary/90 transition-all text-sm"
        >
          <PlusCircle className="w-4 h-4" /> Add New Studio
        </Link>
      </div>

     
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your studio listings...</p>
        </div>
      ) : listings.length > 0 ? (
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((studio) =>(
            <StudioListingCard 
              key={studio._id} 
              studio={studio} 
              onDeleteSuccess={(id) =>{
                setListings((prev) => prev.filter((item) => item._id !== id));
              }}
              onUpdateSuccess={(updatedStudio) => {
              
                setListings((prev) => 
                  prev.map((item) => item._id === updatedStudio._id ? updatedStudio : item)
                );
              }}
            />
          ))}
        </div>
      ) : (
       
        <div className="bg-card border border-border rounded-3xl p-16 text-center space-y-6 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">No Studio Listings Yet</h3>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t listed any creative spaces yet. Start earning by sharing your sound stage or photo studio with creators.
            </p>
          </div>
          <Link
            href="/add-studio"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all text-sm"
          >
            <PlusCircle className="w-4 h-4" /> Create Your First Listing
          </Link>
        </div>
      )}

    </div>
  );
}