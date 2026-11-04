"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  Star, 
  MapPin, 
  SlidersHorizontal,
  RotateCcw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  X
} from "lucide-react";
import { Studio } from "@/types";

function StudiosContent(){
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Per page limit 6

  
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [categoryParam]);

  
  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/studios");
        if (!res.ok) throw new Error("Failed to fetch studios");
        const data = await res.json();
        setStudios(data);
      } catch (error) {
        console.error("Error fetching studios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  const categories = ["All", "Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];

  
  const filteredStudios = studios.filter((studio) =>{
    const matchesSearch = 
      studio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || studio.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  
  const sortedStudios = [...filteredStudios].sort((a, b) => {
    if (priceSort === "asc") return a.hourlyRate - b.hourlyRate;
    if (priceSort === "desc") return b.hourlyRate - a.hourlyRate;
    return 0;
  });

  
  useEffect(() =>{
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceSort]);

  
  const totalPages = Math.ceil(sortedStudios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStudios = sortedStudios.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceSort(null);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner - Left Aligned */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-1 rounded-full text-xs font-semibold">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Marketplace Directory
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Explore Creative Workspaces
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Browse <span className="font-semibold text-foreground">{sortedStudios.length}</span> studios available for booking.
        </p>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="relative lg:col-span-5">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-input rounded-2xl pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-background border border-input rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Up / Down & Clear Buttons */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <div className="flex items-center bg-background border border-input rounded-2xl p-1 w-full justify-between">
              <button
                onClick={() => setPriceSort("asc")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all w-1/2 justify-center ${
                  priceSort === "asc"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Price: Low to High"
              >
                <span>Price</span> <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPriceSort("desc")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all w-1/2 justify-center ${
                  priceSort === "desc"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Price: High to Low"
              >
                <span>Price</span> <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Clear Button */}
            {priceSort && (
              <button
                onClick={() => setPriceSort(null)}
                className="p-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-2xl transition-colors shrink-0"
                title="Clear Price Sort"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Reset All Filter Button */}
            {(searchTerm || selectedCategory !== "All" || priceSort) && (
              <button
                onClick={resetFilters}
                className="p-3 bg-muted hover:bg-muted/80 text-foreground rounded-2xl transition-colors shrink-0"
                title="Reset All Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading studios from server...</p>
        </div>
      ) : currentStudios.length > 0 ? (
        <>
          {/* Studios Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentStudios.map((studio) => (
              <div
                key={studio._id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={studio.image}
                    alt={studio.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {studio.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" /> {studio.location}</span>
                    <span className="flex items-center gap-1 font-semibold text-foreground bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {studio.rating}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {studio.title}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div>
                      <span className="text-2xl font-extrabold text-foreground">${studio.hourlyRate}</span>
                      <span className="text-xs text-muted-foreground"> / hr</span>
                    </div>
                    <Link
                      href={`/studios/${studio._id}`}
                      className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold rounded-xl text-sm transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Friendly Empty State */
        <div className="bg-card border border-border rounded-3xl p-16 text-center space-y-6 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">No Studios Found</h3>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t find any creative spaces matching your search or filter criteria. Try adjusting your search keywords or category.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all text-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-muted-foreground">Loading studios directory...</div>}>
      <StudiosContent />
    </Suspense>
  );
}