export interface User {
  _id: string;
  name: string;
  email: string;
  role: "creator" | "host" | "admin";
  avatar?: string;
  createdAt?: string | Date;
}