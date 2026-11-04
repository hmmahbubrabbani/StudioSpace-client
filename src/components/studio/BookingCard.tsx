"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  DollarSign,
  Loader2,
  FileText 
} from "lucide-react";
import { toast } from "sonner";
import { Booking } from "@/types";
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

interface BookingCardProps {
  booking: Booking;
  onCancelSuccess: (id: string) => void;
}

export default function BookingCard({ booking, onCancelSuccess }: BookingCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCancelBooking = async () => {
    try {
      setDeleting(true);

      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const res = await fetch(`${baseUrl}/bookings/${booking._id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to cancel booking');
      }

      onCancelSuccess(booking._id);

      toast.success("Booking Cancelled", {
        description: `Your reservation for ${booking.studioTitle} has been successfully cancelled.`,
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error("Error", {
        description: error.message || "Could not cancel booking. Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  // প্রফেশনাল ইনভয়েস জেনারেটর ও প্রিন্ট/ডাউনলোড হ্যান্ডলার
  const handleDownloadInvoice = () => {
    setDownloading(true);
    try {
      const invoiceWindow = window.open("", "_blank");
      if (!invoiceWindow) {
        toast.error("Popup Blocked", { description: "Please allow popups to download your invoice." });
        setDownloading(false);
        return;
      }

      const invoiceHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Invoice - ${booking.studioTitle}</title>
          <style>
            body { font-family: 'Inter', sans-serif; background: #f9fafb; color: #111827; padding: 40px; margin: 0; }
            .invoice-box { max-width: 800px; margin: auto; background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f3f4f6; padding-bottom: 24px; margin-bottom: 24px; }
            .logo h2 { margin: 0; color: #4f46e5; font-size: 24px; }
            .logo p { margin: 4px 0 0; color: #6b7280; font-size: 12px; }
            .invoice-details { text-align: right; }
            .invoice-details h3 { margin: 0; color: #111827; font-size: 20px; }
            .invoice-details p { margin: 4px 0 0; color: #6b7280; font-size: 13px; }
            .section-title { font-size: 14px; font-weight: 600; color: #374151; text-transform: uppercase; margin-bottom: 8px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
            th { background: #f9fafb; color: #374151; font-weight: 600; text-align: left; padding: 12px; font-size: 13px; border-bottom: 1px solid #e5e7eb; }
            td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #4b5563; }
            .total-section { text-align: right; margin-top: 20px; }
            .total-row { font-size: 16px; font-weight: bold; color: #111827; }
            .footer { text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px; color: #9ca3af; font-size: 12px; }
            .badge { display: inline-block; padding: 4px 12px; background: #ecfdf5; color: #059669; border-radius: 9999px; font-size: 12px; font-weight: 600; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="invoice-box">
            <div class="header">
              <div class="logo">
                <h2>StudioSpace</h2>
                <p>P2P Creative Studio Marketplace</p>
              </div>
              <div class="invoice-details">
                <h3>INVOICE</h3>
                <p><strong>Booking ID:</strong> ${booking._id}</p>
                <p><strong>Date Issued:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div class="grid">
              <div>
                <div class="section-title">Billed To</div>
                <p><strong>Creator Email:</strong> ${booking.creatorEmail}</p>
              </div>
              <div>
                <div class="section-title">Host Information</div>
                <p><strong>Host Email:</strong> ${booking.hostEmail}</p>
                <p><strong>Status:</strong> <span class="badge">${booking.status}</span></p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Studio Workspace</th>
                  <th>Shoot Date</th>
                  <th>Time & Duration</th>
                  <th>Rate / Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${booking.studioTitle}</strong></td>
                  <td>${booking.bookingDate}</td>
                  <td>${booking.startTime} (${booking.hours} hrs)</td>
                  <td>$${booking.totalCost}</td>
                </tr>
              </tbody>
            </table>

            <div class="total-section">
              <p class="total-row">Total Paid: <span style="color: #4f46e5; font-size: 20px;">$${booking.totalCost}</span></p>
            </div>

            <div class="footer">
              <p>Thank you for booking with StudioSpace! For support, contact support@studiospace.com</p>
            </div>
          </div>
        </body>
        </html>
      `;

      invoiceWindow.document.write(invoiceHTML);
      invoiceWindow.document.close();
      
      toast.success("Invoice Ready", { description: "Invoice generated successfully for download/print." });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate invoice");
    } finally {
      setDownloading(false);
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-xs font-semibold">
            <Clock3 className="w-3.5 h-3.5" /> Pending Approval
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
      
      {/* Left Info Section */}
      <div className="space-y-3 flex-grow">
        <div className="flex flex-wrap items-center gap-3">
          {getStatusBadge(booking.status)}
          <span className="text-xs text-muted-foreground font-mono">
            ID: {booking._id}
          </span>
        </div>

        <h3 className="text-xl font-bold text-foreground">
          {booking.studioTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground pt-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>Date: <strong className="text-foreground">{booking.bookingDate}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <span>Time: <strong className="text-foreground">{booking.startTime} ({booking.hours} hrs)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary shrink-0" />
            <span>Total Cost: <strong className="text-foreground">${booking.totalCost}</strong></span>
          </div>
        </div>
      </div>

      {/* Right Action Area */}
      <div className="flex flex-wrap items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-border">
        
        {/* Download Invoice Button */}
        <button
          onClick={handleDownloadInvoice}
          disabled={downloading}
          className="px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-xl text-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          Invoice
        </button>

        <Link
          href={`/studios/${booking.studioId}`}
          className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-sm transition-colors text-center"
        >
          View Studio
        </Link>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {/* 🔥 asChild এবং ভেতরের অতিরিক্ত বাটন বাদ দিয়ে সরাসরি AlertDialogTrigger-কেই বাটন বানানো হলো */}
          <AlertDialogTrigger className="px-5 py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
            <Trash2 className="w-4 h-4" /> Cancel
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-[#141414] border border-neutral-800 text-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md">
            <AlertDialogHeader className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-white">
                Cancel &ldquo;{booking.studioTitle}&rdquo;?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-neutral-400 leading-relaxed">
                Are you sure you want to cancel your reservation for this studio? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6 flex items-center gap-3">
              <AlertDialogCancel 
                disabled={deleting}
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold rounded-xl text-xs hover:bg-neutral-800 hover:text-white transition-colors mt-0 cursor-pointer"
              >
                Keep Reservation
              </AlertDialogCancel>
              
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleCancelBooking();
                }}
                disabled={deleting}
                className="w-full sm:w-auto px-6 py-2.5 bg-destructive text-destructive-foreground font-semibold rounded-xl text-xs shadow-lg hover:bg-destructive/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {deleting ? "Cancelling..." : "Yes, Cancel Booking"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

    </div>
  );
}