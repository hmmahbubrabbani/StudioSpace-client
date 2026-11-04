# StudioSpace - P2P Creative Studio Marketplace

**StudioSpace** is a modern Peer-to-Peer (P2P) marketplace web application designed for creators, photographers, videographers, and producers to discover, book, and manage professional creative studio workspaces seamlessly.

* **Live site URL: 

---

## 🌟 Key Features

* **Advanced Studio Discovery & Filtering:** Browse a wide range of creative studios with real-time category filtering, location search, and detailed pricing views.
* **Interactive Wishlist/Favorites System:** Authenticated users can easily save or remove studios from their personal wishlist using instant toggle actions with heart animations.
* **Double-Booking Prevention & Booking Management:** Robust reservation system that prevents overlapping bookings, allows cancellations, and tracks status (`Confirmed`, `Pending`, `Cancelled`).
* **Dynamic Professional Invoice Generator:** Users can instantly generate, preview, and print/download professional-grade booking invoices directly from their reservation history.
* **Secure Authentication (Better Auth):** Implements modern EdDSA-based JWT token verification with email/password login, account registration, profile management, and Google Social sign-in.

---

## 🛠️ Tech Stack

* **Frontend Framework:** Next.js 16+ (App Router, Turbopack, React Server & Client Components)
* **UI Library & Components:** Shadcn UI / Base UI variant, Tailwind CSS v4, Lucide React Icons
* **Notifications & Feedback:** Sonner (Toast notifications), Custom AlertDialog modals
* **Backend Integration:** Node.js, Express.js, Native MongoDB Node Driver
* **Authentication Provider:** Better Auth (`@better-auth`)

---

## 🚀 Local Setup & Installation

Follow these steps to run the client-side application locally on your machine:

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/your-username/StudioSpace-client.git](https://github.com/your-username/StudioSpace-client.git)
   cd StudioSpace-client
