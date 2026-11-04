import { authClient } from "@/lib/auth-client"; // আপনার প্রজেক্টের পাথ অনুযায়ী

export const getTokenFromClient = async () => {
  const { data } = await authClient.token();

  const token = data?.token;
  return token;
};