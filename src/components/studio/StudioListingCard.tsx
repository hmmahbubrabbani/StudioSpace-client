"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Star,
  Trash2,
  Eye,
  Edit,
  Loader2,
  Heart,
} from "lucide-react";

import { toast } from "sonner";
import { Studio } from "@/types";
import { authClient } from "@/lib/auth-client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface StudioListingCardProps {
  studio: Studio;
  onDeleteSuccess: (id: string) => void;
  initialIsFavorite?: boolean;
}

export default function StudioListingCard({
  studio,
  onDeleteSuccess,
  initialIsFavorite = false,
}: StudioListingCardProps) {

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const [currentStudio, setCurrentStudio] = useState<Studio>(studio);

  useEffect(() => {
    setCurrentStudio(studio);
  }, [studio]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Sign In Required", {
        description: "Please sign in to save studios to your wishlist.",
      });
      return;
    }

    try {
      setWishlistLoading(true);
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      
      const res = await fetch(`${baseUrl}/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userEmail: user.email,
          studioId: currentStudio._id,
        }),
      });

      if (!res.ok) throw new Error("Failed to update wishlist");

      const data = await res.json();

      if (data.action === "added") {
        setIsFavorite(true);
        toast.success("Added to Wishlist ❤️", {
          description: `${currentStudio.title} has been saved to your favorites.`,
        });
      } else {
        setIsFavorite(false);
        toast.info("Removed from Wishlist", {
          description: `${currentStudio.title} has been removed from your favorites.`,
        });
      }
    } catch (error: any) {
      console.error("Wishlist error:", error);
      toast.error("Error", {
        description: "Could not update wishlist. Please try again.",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentStudio._id) return;

    try {
      setDeleting(true);

      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      
      const res = await fetch(`${baseUrl}/studios/${currentStudio._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to delete studio");
      }

      onDeleteSuccess(currentStudio._id);

      toast.success("Listing Deleted", {
        description: `Successfully removed ${currentStudio.title} from your listings.`,
      });

      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting studio:", error);

      toast.error("Delete Failed", {
        description: error.message || "Could not delete studio listing. Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">

      {/* Studio Image & Wishlist Button */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={currentStudio.image}
          alt={currentStudio.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {currentStudio.category}
        </span>

        <button
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-all shadow-md text-foreground cursor-pointer disabled:opacity-50 z-10"
          title={isFavorite ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-foreground hover:text-rose-500"
            }`}
          />
        </button>
      </div>

      {/* Studio Information */}
      <div className="p-6 flex flex-col flex-grow space-y-4">

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {currentStudio.location}
          </span>

          <span className="flex items-center gap-1 font-semibold text-foreground bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            {currentStudio.rating ?? "New"}
          </span>
        </div>

        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {currentStudio.title}
        </h3>

        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <div>
            <span className="text-2xl font-extrabold text-foreground">
              ${currentStudio.hourlyRate}
            </span>
            <span className="text-xs text-muted-foreground"> / hr</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/studios/${currentStudio._id}`}
              className="p-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-colors"
              title="View Public Page"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <Link
              href={`/studios/edit/${currentStudio._id}`}
              className="p-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors cursor-pointer flex items-center justify-center"
              title="Edit Studio"
            >
              <Edit className="w-4 h-4" />
            </Link>

            {/* 🔥 AlertDialogTrigger নিজেই বাটন হিসেবে কাজ করবে, কোনো ভেতরের অতিরিক্ত বাটন নেই */}
            <AlertDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            >
              <AlertDialogTrigger 
                className="p-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-[#141414] border border-neutral-800 text-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md">
                <AlertDialogHeader className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20">
                    <Trash2 className="w-6 h-6" />
                  </div>

                  <AlertDialogTitle className="text-xl font-bold text-white">
                    Delete &ldquo;{currentStudio.title}&rdquo;?
                  </AlertDialogTitle>

                  <AlertDialogDescription className="text-sm text-neutral-400 leading-relaxed">
                    This action cannot be undone. This will permanently
                    remove your studio workspace and all associated
                    reservation records from the server.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 flex items-center gap-3">
                  <AlertDialogCancel
                    disabled={deleting}
                    className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold rounded-xl text-xs hover:bg-neutral-800 hover:text-white transition-colors mt-0 cursor-pointer"
                  >
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                    disabled={deleting}
                    className="w-full sm:w-auto px-6 py-2.5 bg-destructive text-destructive-foreground font-semibold rounded-xl text-xs shadow-lg hover:bg-destructive/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {deleting && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    {deleting ? "Deleting..." : "Yes, Delete Studio"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </div>
        </div>
      </div>
    </div>
  );
}
