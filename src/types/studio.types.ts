export interface Studio {
  _id: string;
  title: string;
  category: "Photo Studio" | "Film Stage" | "Podcast Lounge" | "Music Suite" | "Workshop";
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  rating: number;
  reviewsCount?: number;
  image: string;
  overview: string;
  amenities: string[];
  host: {
    name: string;
    email: string;
    image?: string;
    memberSince?: string;
    verified: boolean;
  };
  createdAt?: string | Date;
}