"use client";

import React from "react";
import { Booking } from "@/types";
import { Printer, Download, CheckCircle2 } from "lucide-react";

interface InvoiceProps {
  booking: Booking;
  studioDetails?: {
    location: string;
    hourlyRate: number;
    securityDeposit: number;
  };
}

export default function InvoiceDocument({ booking, studioDetails }: InvoiceProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 text-foreground print:shadow-none print:border-none print:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <span>Studio</span><span className="text-foreground">Space</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">P2P Creative Workspaces Marketplace</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-extrabold tracking-tight">INVOICE</h2>
          <p className="text-xs font-mono text-muted-foreground">ID: {booking._id}</p>
        </div>
      </div>

      {/* Status & Dates */}
      <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-6 rounded-2xl border border-border">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground uppercase font-medium">Billed To (Creator)</span>
          <p className="font-semibold">{booking.creatorEmail}</p>
        </div>
        <div className="space-y-1 sm:text-right">
          <span className="text-xs text-muted-foreground uppercase font-medium">Reservation Date</span>
          <p className="font-semibold">{booking.bookingDate} ({booking.startTime})</p>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Reservation Summary</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase">
              <th className="py-3 font-semibold">Description</th>
              <th className="py-3 font-semibold text-center">Duration / Qty</th>
              <th className="py-3 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            <tr>
              <td className="py-4 font-medium">{booking.studioTitle}</td>
              <td className="py-4 text-center">{booking.hours} Hours</td>
              <td className="py-4 text-right">${(booking.totalCost || 0) - 150}</td>
            </tr>
            <tr>
              <td className="py-4 font-medium">Security Deposit (Refundable)</td>
              <td className="py-4 text-center">1 Unit</td>
              <td className="py-4 text-right">$150</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border font-bold text-base">
              <td className="py-4 pt-6">Total Paid</td>
              <td></td>
              <td className="py-4 pt-6 text-right text-primary">${booking.totalCost}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Note & Print Action */}
      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <p className="text-xs text-muted-foreground">
          Thank you for choosing StudioSpace. For support contact host or admin.
        </p>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all text-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Download / Print Invoice (PDF)
        </button>
      </div>

    </div>
  );
}