# Pethiyan — Frontend

E-commerce storefront for [Pethiyan](https://pethiyan.com), built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Auth & DB**: Firebase
- **UI Primitives**: Radix UI (Dialog, Dropdown)
- **Carousel**: Embla Carousel
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Project Structure

```
app/               # Next.js App Router pages
  products/        # Product listing & detail pages
  shop/            # Shop page
  cart/            # Cart page
  checkout/        # Checkout flow
  wishlist/        # Wishlist page
  account/         # User account
  search/          # Search results
  order-confirmed/ # Post-order confirmation
  track-order/     # Order tracking
  category/        # Category browsing
  login/           # Authentication
  about/           # About page
  contact/         # Contact page
  faq/             # FAQ page
  privacy-policy/  # Legal pages
  returns-policy/
  shipping-policy/
  terms-and-conditions/
components/        # Reusable UI components
  auth/            # Auth-related components
  common/          # Shared components
  headers/         # Top bar, nav, announcement bar
  hero/            # Hero/banner sections
  layout/          # Footer, page layout
  navigation/      # Navigation menus
  popups/          # Modal popups (e.g. coupon)
  product/         # Product card, gallery, etc.
  sections/        # Page sections
  shop/            # Shop-specific components
  ui/              # Generic UI (cart drawer, bottom nav, etc.)
context/           # React context providers
  AuthContext.tsx  # Firebase authentication state
  CartContext.tsx  # Shopping cart state
  WishlistContext.tsx # Wishlist state
lib/               # Utilities & helpers
  api.ts           # Backend API calls
  firebase.ts      # Firebase config & init
  structured-data.ts # JSON-LD schema markup
  utils.ts         # General utilities
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in this directory:

```env
NEXT_PUBLIC_SITE_URL=https://pethiyan.com
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_API_BASE_URL=
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
