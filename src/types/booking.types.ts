export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  hostEmail: string;
  creatorEmail: string;
  bookingDate: string;
  startTime: string;
  hours: number;
  totalCost: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string | Date;
}