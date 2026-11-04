"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner"; // 🔥 sonner থেকে toast ইম্পোর্ট করা হলো
import { authClient } from "@/lib/auth-client";
import { Studio } from "@/types";

const CATEGORIES: Studio["category"][] = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

// আসল ফর্ম কম্পোনেন্ট যেখানে useParams ব্যবহার করা হয়েছে
function EditStudioForm() {
  const params = useParams();
  const router = useRouter();
  const studioId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ফর্ম ডাটা স্টেট
  const [formData, setFormData] = useState({
    title: "",
    category: "Photo Studio" as Studio["category"],
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    image: "",
    overview: "",
    hostName: "",
    hostEmail: "",
  });

  useEffect(() => {
    if (!studioId) return;

    const fetchStudio = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/studios/${studioId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch studio details");
        }

        const data: Studio = await res.json();

        setFormData({
          title: data.title || "",
          category: data.category || "Photo Studio",
          hourlyRate: data.hourlyRate ? String(data.hourlyRate) : "",
          securityDeposit: data.securityDeposit ? String(data.securityDeposit) : "",
          maxCapacity: data.maxCapacity ? String(data.maxCapacity) : "",
          location: data.location || "",
          image: data.image || "",
          overview: data.overview || "",
          hostName: data.host?.name || "",
          hostEmail: data.host?.email || "",
        });
      } catch (error: any) {
        console.error("Error fetching studio:", error);
        toast.error("Error", {
          description: "Could not load studio data for editing.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudio();
  }, [studioId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      if (!token) {
        toast.error("Unauthorized", {
          description: "Please login again to update the studio.",
        });
        router.push("/signin");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const payload = {
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
        securityDeposit: Number(formData.securityDeposit),
        maxCapacity: Number(formData.maxCapacity),
      };

      const res = await fetch(`${baseUrl}/studios/${studioId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update studio");
      }

      toast.success("Success!", {
        description: "Studio listing updated successfully.",
      });

      router.push("/my-listings");
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error("Update Failed", {
        description: error.message || "Something went wrong while updating.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Listings
        </Link>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Edit Studio Listing
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update your studio specifications and details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Studio Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="e.g. Apex Cinematic Soundstage"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Hourly Rate ($)</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                placeholder="e.g. 150"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Security Deposit ($)</label>
              <input
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                placeholder="e.g. 300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Max Capacity (Persons)</label>
              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                placeholder="e.g. 25"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="e.g. Downtown, Los Angeles"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Overview</label>
            <textarea
              name="overview"
              rows={4}
              value={formData.overview}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
              placeholder="Provide a comprehensive overview of your studio space..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Host Name (Read-only)</label>
              <input
                type="text"
                value={formData.hostName}
                disabled
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Host Email (Read-only)</label>
              <input
                type="email"
                value={formData.hostEmail}
                disabled
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Updating Studio...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// মূল পেজ এক্সপোর্ট যা Suspense দিয়ে মোড়ানো
export default function EditStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      }
    >
      <EditStudioForm />
    </Suspense>
  );
}