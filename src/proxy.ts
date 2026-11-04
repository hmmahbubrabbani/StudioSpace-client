import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
   // Better Auth-এর সেশন কুকি চেক করা 
   const sessionCookie = 
      request.cookies.get("better-auth.session_token") || 
      request.cookies.get("__Secure-better-auth.session_token");

   // যদি কুকি না থাকে, অর্থাৎ ইউজার লগইন করা না থাকে
   if (!sessionCookie) {
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(signinUrl);
   }

   // ইউজার লগইন করা থাকলে রিকোয়েস্ট সামনে এগোতে দেওয়া হবে
   return NextResponse.next();
}

// কোন কোন রুটে মিডওয়্যার কাজ করবে (এখানে `/studios/:path*` বাদ দেওয়া হয়েছে)
export const config = {
   matcher: [
      '/studios/add',     // নতুন স্টুডিও অ্যাড করার পেজ (আপনার সঠিক পাথ অনুযায়ী)
      '/studios/edit/:path*', // স্টুডিও এডিট করার পেজ
      '/my-bookings',     // বুকিং পেজ
      '/my-listings',
      '/studios'      // হোস্টের লিস্টিং পেজ
   ],
};