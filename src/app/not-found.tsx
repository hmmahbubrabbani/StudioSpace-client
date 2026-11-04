import Link from "next/link";
import { Camera, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-[#141414] border border-neutral-800 rounded-3xl w-full max-w-lg p-8 md:p-12 shadow-2xl text-center space-y-6 text-white">
        
       
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center rounded-3xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
          <Camera className="w-12 h-12 animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-neutral-900 border border-neutral-700 text-xs font-bold px-2.5 py-1 rounded-full text-neutral-400">
            404
          </div>
        </div>

       
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto">
            Looks like this studio frame is empty or the scene has been moved. Let&apos;s get you back on track.
          </p>
        </div>

        
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:bg-primary/90 transition-all text-sm cursor-pointer"
          >
            <Home className="w-4 h-4"/>
            Return to Home
          </Link>
        </div>

      </div>
    </div>
  );
}