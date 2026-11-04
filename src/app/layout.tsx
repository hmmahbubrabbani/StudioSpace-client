import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider"; 
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-rubik",
});

export const metadata: Metadata ={
  title: "StudioSpace | Peer-to-Peer Studio Marketplace",
  description: "Book professional production studios, sound stages, and recording suites instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}){
  return (
   
    <html lang="en" className={rubik.variable} suppressHydrationWarning>
      <body
        className="font-sans bg-background text-foreground min-h-screen flex flex-col antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div className="h-20 bg-background border-b border-border"/>}>
            <Navbar />
          </Suspense>

          <main className="flex-grow">
            {children}
          </main>

          <Suspense fallback={null}>
            <Footer />
          </Suspense>

          <Toaster position="top-right" richColors theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}