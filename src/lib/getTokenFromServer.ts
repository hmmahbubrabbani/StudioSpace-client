import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // আপনার প্রজেক্টের পাথ অনুযায়ী

export const getTokenFromServer = async () => {
  const jwtToken = await auth.api.getToken({
    headers: await headers(),
  });
  const token = jwtToken?.token;

  return token;
};