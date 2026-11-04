"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  DollarSign, 
  Bookmark, 
  ArrowRight,
  Loader2,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Booking } from "@/types";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  
  // Better Auth থেকে রিয়েল-টাইম সেশন ফেচ করা
  const { data: session, isPending: sessionLoading, refetch } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [updating, setUpdating] = useState(false);

  // সেশনের ডাটা লোড হলে লোকাল স্টেটে সেট করা
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
    }
  }, [user]);

  // Fetch user's bookings from backend with Authorization Token
  useEffect(() => {
    if (!user?.email) return;

    const fetchUserBookings = async () => {
      try {
        setLoading(true);

        const { data: tokenData } = await authClient.token();
        const token = tokenData?.token;

        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        
        const res = await fetch(`${baseUrl}/bookings?creatorEmail=${user.email}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        
        setBookings(data);
      } catch (error: any) {
        console.error("Error loading dashboard data:", error);
        toast.error("Error", {
          description: "Could not load your dashboard bookings.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user?.email]);

  // Profile Update Handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { data, error } = await authClient.updateUser({
        name: name,
        image: image,
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile");
      }

      toast.success("Profile Updated! 🎉", {
        description: "Your account details have been successfully updated.",
      });

      setIsEditModalOpen(false);
      refetch();
      router.refresh();
    } catch (err: any) {
      console.error("Update profile error:", err);
      toast.error("Update Failed", {
        description: err.message || "Could not update your profile.",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out", {
            description: "You have been securely signed out.",
          });
          router.push("/signin");
          router.refresh();
        },
      },
    });
  };

  if (sessionLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-neutral-900 bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-neutral-500">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6 text-neutral-900 bg-background">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-neutral-500">Please sign in to view your dashboard.</p>
        <Link href="/signin" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md">
          Sign In
        </Link>
      </div>
    );
  }

  const totalSpent = bookings.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-neutral-900 bg-background min-h-screen">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <span className="text-sm uppercase tracking-widest text-primary font-bold">My Dashboard</span>
          <h1 className="text-3xl font-extrabold text-neutral-900 mt-1">Welcome back, {user.name || "Creator"}!</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your active creative spaces, bookings, and personal profile details.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/studios" 
            className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            Explore Studios <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-neutral-200 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 bg-primary/10 text-primary rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 uppercase font-semibold">Total Bookings</span>
            <h3 className="text-2xl font-bold text-neutral-900">{bookings.length}</h3>
          </div>
        </div>

        <div className="p-6 bg-white border border-neutral-200 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 uppercase font-semibold">Total Invested</span>
            <h3 className="text-2xl font-bold text-neutral-900">${totalSpent}</h3>
          </div>
        </div>

        <div className="p-6 bg-white border border-neutral-200 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 bg-amber-500/10 text-amber-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 uppercase font-semibold">Account Status</span>
            <h3 className="text-2xl font-bold text-neutral-900">Verified Creator</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile Info & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm h-fit">
          <div className="flex flex-col items-center text-center space-y-4">
            <img 
              src={user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"} 
              alt={user.name || "User"} 
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-md" 
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900">{user.name}</h2>
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-semibold inline-block">
                Creator / Producer
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6 space-y-4 text-sm">
            <div className="flex items-center gap-3 text-neutral-600">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-600">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span>StudioSpace Member</span>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6 space-y-3">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="w-full py-3 bg-neutral-100 border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-200 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Settings className="w-4 h-4" /> Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer border border-rose-100"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Right Column: Recent Bookings List */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary" /> My Recent Reservations
            </h2>
            <span className="text-xs text-neutral-500 font-medium">{bookings.length} Total Bookings</span>
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-neutral-500">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-neutral-500 text-sm">You haven&apos;t booked any studios yet.</p>
              <Link 
                href="/studios" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm shadow-sm"
              >
                Browse & Book Studios
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div 
                  key={booking._id} 
                  className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/40 hover:bg-white transition-all shadow-sm"
                >
                  <div className="space-y-1">
                    <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                      {booking.status}
                    </span>
                    <h3 className="text-base font-bold text-neutral-900">{booking.studioTitle}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-primary" /> {booking.bookingDate}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-primary" /> {booking.startTime} ({booking.hours} hrs)
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:text-left flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-0 border-neutral-200 pt-3 sm:pt-0">
                    <span className="text-xs text-neutral-500 font-medium">Total Paid</span>
                    <span className="text-lg font-extrabold text-neutral-900">${booking.totalCost}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-neutral-900">
            
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-primary font-bold">Account Settings</span>
              <h3 className="text-2xl font-extrabold text-neutral-900">Edit Profile</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Profile Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                />
                <p className="text-xs text-neutral-400">Provide a direct link to your avatar image.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Email Address (Read-Only)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-400 cursor-not-allowed"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full py-3 bg-neutral-100 border border-neutral-200 text-neutral-700 font-semibold rounded-xl text-sm hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}