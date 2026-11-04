"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Camera } from "lucide-react";
import { toast } from "sonner"; // 🔥 sonner থেকে toast ইম্পোর্ট করা হলো
import { authClient } from "@/lib/auth-client";

export default function SignUpPage(){
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "email" ? value.toLowerCase() : value 
    }));

    
    if (name === "password") {
      validatePassword(value);
    }
  };

 
  const validatePassword = (pass: string) =>{
    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    const isValidLength = pass.length >= 6;

    if (!isValidLength) {
      setPasswordError("Password must be at least 6 characters long.");
      return false;
    }
    if (!hasUppercase) {
      setPasswordError("Password must contain at least one Uppercase letter.");
      return false;
    }
    if (!hasLowercase) {
      setPasswordError("Password must contain at least one Lowercase letter.");
      return false;
    }

    setPasswordError(""); 
    return true;
  };

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   
    if (!validatePassword(formData.password)){
      toast.error("Invalid Password", {
        description: passwordError || "Please check your password requirements.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: formData.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
      });

      if (error) {
        throw new Error(error.message || "Failed to register account");
      }

      toast.success("Account Created! 🎉", {
        description: "Registration successful. Please log in with your credentials.",
      });

     
      router.push("/signin");
      router.refresh();
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error("Registration Failed", {
        description: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Social Login 
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", 
      });
    } catch (err) {
      console.error("Google signin error:", err);
      toast.error("Google Login Failed", {
        description: "Could not authenticate with Google.",
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-[#141414] border border-neutral-800 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6 text-white">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
          <p className="text-xs text-neutral-400">Join StudioSpace to publish and book creative workspaces</p>
        </div>

        {/* Social Login Button (Google) */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-3 px-4 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-all text-sm font-semibold rounded-xl flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.31 7.25 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.1 0 9.8 0 12s.43 3.9 1.19 5.42l4.09-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.25 0 3.17 2.69 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 text-neutral-600 text-xs uppercase tracking-wider">
          <div className="h-px bg-neutral-800 flex-1"></div>
          <span>Or register with email</span>
          <div className="h-px bg-neutral-800 flex-1"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Full Name</label>
            <input 
              type="text"
              name="name"
              required
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Photo URL</label>
            <input 
              type="url"
              name="image"
              autoComplete="off"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/... (optional)"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Email Address</label>
            <input 
              type="email"
              name="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Example@gmail.com"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Password</label>
            <input 
              type="password"
              name="password"
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
            />
            
            {passwordError && (
              <p className="text-xs text-rose-500 mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !!passwordError}
            className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        {/* Footer Link for Login */}
        <div className="text-center pt-2 border-t border-neutral-800">
          <p className="text-xs text-neutral-400">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}