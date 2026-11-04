import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const db = client.db("StudioSpaceDB");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  
  // ইমেইল ও পাসওয়ার্ড অথেন্টিকেশন
  emailAndPassword: { 
    enabled: true, 
    autoSignIn: true,
  }, 

  // গুগল সোশ্যাল লগইন যুক্ত করা হয়েছে
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [jwt()],
  
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60 // ৭ দিন
    }
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});