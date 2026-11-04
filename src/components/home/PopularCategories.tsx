import Link from "next/link";
import { Camera, Film, Mic, Music, Palette } from "lucide-react";

export default function PopularCategories() {
  const categories = [
    { name: "Photo Studio", icon: Camera, count: "42 Spaces", query: "Photo+Studio" },
    { name: "Film Stage", icon: Film, count: "18 Stages", query: "Film+Stage" },
    { name: "Podcast Lounge", icon: Mic, count: "29 Rooms", query: "Podcast+Lounge" },
    { name: "Music Suite", icon: Music, count: "35 Suites", query: "Music+Suite" },
    { name: "Art Workshop", icon: Palette, count: "15 Lofts", query: "Workshop" },
  ];

  return (
    <section className="py-20 border-b max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Browse by Studio Categories</h2>
        <p className="text-muted-foreground">Find the exact production environment tailored to your creative medium.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={`/studios?category=${cat.query}`}
              className="group flex flex-col items-center p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{cat.count}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}