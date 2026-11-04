"use client";

import React, { useState } from "react";
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
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner"; // 🔥 sonner থেকে toast ইম্পোর্ট করা হলো
import { authClient } from "@/lib/auth-client"; // 🔥 Better Auth টোকেনের জন্য ইম্পোর্ট

interface DeleteStudioDialogProps {
  studioId: string;
  studioTitle: string;
  onDeleteSuccess: (deletedId: string) => void;
}

export default function DeleteStudioDialog({ 
  studioId, 
  studioTitle, 
  onDeleteSuccess 
}: DeleteStudioDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      // 🔥 Better Auth থেকে টোকেন সংগ্রহ করা
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      // 🔥 ব্যাকএন্ডে DELETE রিকোয়েস্ট পাঠানোর সময় Authorization হেডার যুক্ত করা
      const res = await fetch(`${baseUrl}/studios/${studioId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to delete studio");
      }

      toast.success("Studio Deleted", {
        description: `"${studioTitle}" has been successfully removed.`,
      });

      onDeleteSuccess(studioId);
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error deleting studio:", error);
      toast.error("Deletion Failed", {
        description: error.message || "Could not delete the studio. Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {/* শ্যাডসিয়ান অ্যালার্ট ডায়ালগ ওয়ার্নিং এড়াতে asChild ব্যবহার করা হলো */}
      <AlertDialogTrigger>
        <button className="px-3 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-semibold rounded-xl hover:bg-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#141414] border border-neutral-800 text-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md">
        <AlertDialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
            <Trash2 className="w-6 h-6" />
          </div>
          
          <AlertDialogTitle className="text-xl font-bold text-white">
            Delete &ldquo;{studioTitle}&rdquo;?
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-sm text-neutral-400 leading-relaxed">
            This action cannot be undone. This will permanently remove your studio workspace and all associated reservation records from the server.
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
            className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 text-white font-semibold rounded-xl text-xs shadow-lg hover:bg-rose-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {deleting ? "Deleting..." : "Yes, Delete Studio"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}