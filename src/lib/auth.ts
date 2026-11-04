import { betterAuth } from "better-auth";
import { MongoClient, Db } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add your MONGODB_URI to environment variables.");
}

let db: Db;

if (process.env.NODE_ENV === "development") {
 
  const globalWithMongo = global as typeof globalThis & {
    _mongoDb?: Db;
  };

  if (!globalWithMongo._mongoDb) {
    const client = new MongoClient(uri);
    globalWithMongo._mongoDb = client.db("StudioSpaceDB");
  }
  db = globalWithMongo._mongoDb;
} else {
  
  const client = new MongoClient(uri);
  db = client.db("StudioSpaceDB");
}

export const auth = betterAuth({
  database: mongodbAdapter(db),
  
  emailAndPassword: { 
    enabled: true, 
    autoSignIn: true,
  }, 

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
  baseURL: process.env.BETTER_AUTH_URL,
});