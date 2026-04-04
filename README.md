# Pethiyan — Hyperlocal Multi-Vendor E-Commerce Platform

Pethiyan is a full-stack, production-grade hyperlocal multi-vendor e-commerce platform. It is designed for the Indian market, offering a complete ecosystem for platform administrators, sellers, customers, and delivery personnel. The system includes a Laravel 12 REST API backend, a multi-panel admin/seller dashboard, and a Next.js 16 customer-facing storefront.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Directory Structure](#directory-structure)
5. [Core Modules](#core-modules)
6. [API Overview](#api-overview)
7. [Authentication & Authorization](#authentication--authorization)
8. [Payment Integrations](#payment-integrations)
9. [Notifications](#notifications)
10. [India-Specific Features](#india-specific-features)
11. [Getting Started](#getting-started)
12. [Environment Variables](#environment-variables)
13. [Database & Migrations](#database--migrations)
14. [Running Tests](#running-tests)
15. [Project Status](#project-status)

---

## Project Overview

Pethiyan enables multiple independent sellers to list and sell products on a single platform under a unified customer experience. Key traits:

- **Multi-vendor**: Each seller manages their own store, products, orders, and earnings independently.
- **Hyperlocal**: Delivery zones, pin-code service areas, and per-state shipping rates confine operations to served geographies.
- **Role-based**: Four distinct user roles — Admin, Seller, Customer, Delivery Boy — each with their own authentication guard, dashboard, and API surface.
- **India-ready**: GST-compliant tax engine, Razorpay payment gateway, pin-code service areas, state-level shipping rates, and OTP-based login via mobile.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│   Next.js 16 Storefront  │  Admin Panel  │  Seller Panel    │
└──────────────┬──────────────────┬─────────────┬────────────┘
               │   REST API       │  Web (Blade) │
┌──────────────▼──────────────────▼─────────────▼────────────┐
│                  LARAVEL 12 APPLICATION                      │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Customer   │  │  Admin Panel │  │  Seller Panel    │   │
│  │  REST API   │  │  (Blade/AJAX)│  │  (Blade/AJAX)    │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          Delivery Boy REST API                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Core Services: Sanctum Auth │ Spatie Permissions │ FCM     │
│  Payments: Razorpay │ Stripe │ Paystack │ Flutterwave       │
│  Media: Spatie MediaLibrary │ PDF: DomPDF                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                    ┌──────────▼─────────┐
                    │  MySQL Database     │
                    │  (140+ migrations)  │
                    └────────────────────┘
```

---

## Tech Stack

### Backend (`admin/`)

| Layer | Technology | Version |
|---|---|---|
| Framework | Laravel | 12.x |
| Language | PHP | ^8.2 |
| Authentication | Laravel Sanctum | 4.0 |
| Authorization | Spatie Laravel Permission | 6.18 |
| Database | MySQL | 5.7+ |
| Media Storage | Spatie Media Library | 11.12 |
| PDF Generation | barryvdh/laravel-dompdf | 3.x |
| Firebase | kreait/firebase-php | 7.22 |
| API Docs | dedoc/scramble | 0.12.x |
| Payment SDKs | Razorpay, Stripe, Paystack, Flutterwave, Easepay | Latest |
| Testing | Pest | 3.x |
| Build Tooling | Vite 6 + Tailwind CSS 4 | Latest |

### Frontend (`frontend/`)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.1.6 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4.0 |
| UI Primitives | Radix UI | Latest |
| Icons | lucide-react | 0.577 |
| Carousel | embla-carousel-react | 8.x |
| State | React Context API | Native |
| Notifications | react-hot-toast | 2.6.0 |
| Firebase | firebase | 12.x |

---

## Directory Structure

```
lcommerce/
│
├── admin/                          # Laravel 12 backend
│   ├── app/
│   │   ├── Console/                # Artisan commands
│   │   ├── Enums/                  # PHP enums (permissions, statuses)
│   │   ├── Events/                 # Laravel events
│   │   ├── Http/
│   │   │   ├── Controllers/        # Route controllers (API + web panels)
│   │   │   └── Middleware/         # Custom middleware (guards, rate-limiting)
│   │   ├── Models/                 # Eloquent models (66+ models)
│   │   ├── Providers/              # Service providers
│   │   └── Services/               # Business logic services
│   │
│   ├── config/                     # App configuration files
│   │   ├── auth.php                # Guards (admin, seller, delivery-boy, web)
│   │   └── menu.php                # Admin sidebar menu structure
│   │
│   ├── database/
│   │   ├── migrations/             # 140+ version-controlled migrations
│   │   └── seeders/                # Data seeders
│   │
│   ├── resources/
│   │   ├── views/                  # Blade templates (admin & seller panels)
│   │   └── lang/                   # Localisation strings
│   │
│   ├── routes/
│   │   ├── api.php                 # Customer-facing REST API
│   │   ├── web.php                 # Web entry points
│   │   ├── admin-route.php         # Admin panel routes
│   │   ├── seller-route.php        # Seller panel routes
│   │   ├── seller-api.php          # Seller REST API
│   │   └── delivery-boy-api.php    # Delivery boy REST API
│   │
│   └── tests/                      # Pest test suite
│
├── frontend/                       # Next.js 16 storefront
│   ├── app/                        # App Router pages & layouts
│   │   ├── (shop)/                 # Public shop pages
│   │   ├── account/                # Authenticated user dashboard
│   │   └── checkout/               # Multi-step checkout flow
│   │
│   ├── components/                 # React component library
│   │   ├── home/                   # Hero, banners, featured sections
│   │   ├── layout/                 # Header, footer, navigation
│   │   ├── product/                # Product cards, detail, reviews
│   │   ├── cart/                   # Cart drawer and page
│   │   └── ui/                     # Base UI primitives (buttons, dialogs)
│   │
│   ├── context/                    # React Context providers
│   │   ├── AuthContext.tsx         # Authentication state
│   │   └── CartContext.tsx         # Cart state
│   │
│   └── lib/                        # Utilities
│       ├── api.ts                  # Centralized API fetch wrapper
│       └── firebase.ts             # Firebase configuration
│
├── APPLICATION_DETAILS.md          # Backend feature inventory
├── FRONTEND_PLAN.md                # Frontend implementation roadmap
├── GAP_ANALYSIS.md                 # Requirements vs. implementation status
├── IMPLEMENTATION_PLAN.md          # Phased feature rollout plan
└── Pethiyan_API.postman_collection.json  # Postman API collection
```

---

## Core Modules

### 1. Admin Panel

Full-featured platform governance dashboard built with Laravel Blade and AJAX. Accessible at `/admin`.

**Capabilities:**
- **Dashboard**: Revenue charts, order summaries, seller activity, delivery statistics
- **Seller Management**: Onboarding, verification, commission configuration, withdrawal approvals, earnings statements
- **Store Management**: Approve/reject stores, monitor store-level activity
- **Order Operations**: View all orders across sellers, update statuses, generate invoices
- **Catalog Moderation**: Approve products, manage categories, brands, banners, featured sections
- **Delivery Operations**: Manage delivery boys, track cash collections, process payouts, manage zones and time slots
- **Customer Management**: View and export customer data
- **Tax Configuration**: Tax classes and rates (India GST support)
- **Promotions**: Promo codes and gift cards
- **Notifications**: Send push notifications (FCM) to customers or delivery boys
- **System Settings**: Manage app-wide settings across 10+ configuration groups (app, web, payment, mail, storage, delivery, homepage, etc.)
- **RBAC**: Role-based permissions for admin sub-users via Spatie Laravel Permission
- **TOTP 2FA**: Admin accounts support Time-based One-Time Password two-factor authentication

### 2. Seller Panel

Independent merchant dashboard. Each seller manages their own store in isolation. Accessible at `/seller`.

**Capabilities:**
- **Dashboard**: Sales analytics, revenue trends, order summaries
- **Store Management**: Create and update store profile and settings
- **Product Catalog**: Full CRUD for products, variants, images, attributes, SEO fields
- **Order Fulfillment**: View and process seller-specific orders; manage returns
- **Wallet & Withdrawals**: Track earnings, request withdrawals, view transaction history
- **Notifications**: In-app notification center
- **Seller Feedback**: View and manage customer feedback on their store

### 3. Customer REST API

The primary API consumed by the Next.js storefront. All endpoints are prefixed with `/api`.

**Capabilities:**
- **Auth**: OTP via mobile, Google OAuth, Apple OAuth, email/password
- **Catalog**: Browse products, categories, brands; full-text search; featured sections; banners; hero
- **Cart**: Add/remove/update items, sync cart, save-for-later
- **Wishlist**: Multiple named wishlists; move items between wishlists
- **Checkout & Orders**: Place orders, cancel items, initiate returns, download invoices, track status
- **Wallet**: View balance, recharge, view transaction history
- **Promo Codes & Gift Cards**: Validate and apply discount codes
- **Reviews & Feedback**: Rate products and sellers
- **Support Tickets**: Create and reply to tickets

### 4. Delivery Boy API

Mobile-first API for delivery personnel. All endpoints are prefixed with `/api/delivery`.

**Capabilities:**
- Registration and OTP authentication
- Profile and earnings dashboard
- Real-time GPS location updates
- View assigned orders; mark as delivered or failed
- Manage return pickups
- Cash collection tracking
- Withdrawal requests

---

## API Overview

### Public Endpoints (no auth required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/hero` | Homepage hero slides and trust badges |
| GET | `/api/banners` | Marketing banners |
| GET | `/api/categories` | Category tree |
| GET | `/api/products` | Product listing (filterable/paginated) |
| GET | `/api/products/{slug}` | Product detail |
| GET | `/api/brands` | Brand list |
| GET | `/api/stores` | Store listing |
| GET | `/api/featured-sections` | Homepage featured product sections |
| GET | `/api/menus` | Navigation menu structure |
| POST | `/api/check-delivery` | Delivery zone/pin-code availability check |
| POST | `/api/auth/login` | Login (returns Sanctum token) |
| POST | `/api/auth/register` | Customer registration |
| POST | `/api/otp/send` | Send OTP to mobile |
| POST | `/api/otp/verify` | Verify OTP and authenticate |

### Authenticated Customer Endpoints (Bearer token required)

All routes are under `/api/user/` with `auth:sanctum` middleware.

| Group | Key Endpoints |
|---|---|
| Profile | `GET/PUT /api/user/profile`, address CRUD |
| Cart | `GET/POST/DELETE /api/user/cart`, sync, save-for-later |
| Wishlist | Full CRUD on named wishlists |
| Orders | Create, list, detail, cancel, return, invoice download |
| Wallet | Balance, recharge, transactions |
| Reviews | Post and view product/seller reviews |
| Support | Create and reply to support tickets |

For the full collection, import `Pethiyan_API.postman_collection.json` into Postman.

---

## Authentication & Authorization

### Customer Auth
- OTP-based login via mobile number (rate-limited)
- Email/password login
- Google OAuth and Apple OAuth via social login callback
- Tokens issued by **Laravel Sanctum**, stored client-side and sent as `Authorization: Bearer <token>`

### Admin Auth
- Separate `admin` guard (`AdminUser` model, separate from `User`)
- Supports **TOTP two-factor authentication**
- Role and permission management via Spatie Laravel Permission
- Permission keys follow the pattern `entity.action` (e.g., `seller.view`, `admin.create_order`)

### Seller Auth
- Separate `seller` guard and panel
- Seller staff accounts (`SellerUser`) scoped to a specific seller

### Delivery Boy Auth
- Dedicated `delivery-boy` guard
- Middleware: `verified.delivery.boy`, `active.delivery.boy`

---

## Payment Integrations

| Gateway | Features |
|---|---|
| **Razorpay** | Order creation, webhook, COD support — primary gateway for India |
| **Stripe** | Order creation, webhook, refund support |
| **Paystack** | Order creation, webhook, redirect callback, refund |
| **Flutterwave** | Webhook handling |
| **Easepay** | Order creation, verification, refund (partial) |
| **Wallet** | In-app wallet with recharge and balance deduction at checkout |
| **COD** | Cash on delivery supported via order status flow |

Payment gateway credentials are configured via environment variables. Webhook endpoints are exposed for each gateway and validate signatures before processing.

---

## Notifications

| Channel | Status | Details |
|---|---|---|
| **FCM Push (Mobile)** | Active | Customer and delivery boy devices via Firebase Cloud Messaging |
| **In-App** | Active | Notification center in admin, seller, and customer panels |
| **Email** | Planned | SMTP configured but notification classes not yet implemented |
| **SMS** | Planned | Not yet implemented |

Firebase is integrated via `kreait/laravel-firebase`. FCM tokens are stored in the `user_fcm_tokens` table.

---

## India-Specific Features

| Feature | Status |
|---|---|
| GST calculation (CGST + SGST / IGST) | Partially implemented — fields added, calculation logic in progress |
| Razorpay payment gateway | Active |
| OTP-based mobile login | Active |
| Pin-code service area verification | Active |
| Per-state shipping rates | Schema ready, rate population pending |
| HSN codes on products | Schema ready |
| State-level tax rates | Schema ready |

---

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer 2.x
- Node.js 20+ and npm
- MySQL 5.7+
- A Firebase project (for push notifications)

### Backend Setup

```bash
cd admin

# Install PHP dependencies
composer install

# Copy and configure environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Link storage
php artisan storage:link

# Install Node dependencies (for Vite/Tailwind asset compilation)
npm install
```

### Running the Backend

```bash
# Development (starts Laravel server, queue listener, log viewer, and Vite)
composer dev

# Or individually
php artisan serve          # Laravel dev server
php artisan queue:listen   # Queue worker
npm run dev                # Vite asset watcher
```

The admin panel is available at `http://localhost:8000/admin`.
The API is available at `http://localhost:8000/api`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file and set the API URL
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

The storefront is available at `http://localhost:3000`.

### Production Build

```bash
# Backend
cd admin && npm run build

# Frontend
cd frontend && npm run build && npm run start
```

---

## Environment Variables

### Backend (`admin/.env`)

```env
APP_NAME=Pethiyan
APP_ENV=local
APP_KEY=                        # Generated by php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hyperlocal
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=

FILESYSTEM_DISK=local           # or 's3' for AWS

RAZORPAY_KEY=
RAZORPAY_SECRET=

STRIPE_KEY=
STRIPE_SECRET=

PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=

FIREBASE_CREDENTIALS=           # Path to Firebase service account JSON

FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Database & Migrations

The database has 140+ migrations tracking the full evolution of the schema. Key table groups:

| Group | Tables |
|---|---|
| Users & Auth | `users`, `admin_users`, `seller_users`, `delivery_boys`, `otp_verifications`, `personal_access_tokens` |
| Products | `products`, `product_variants`, `product_variant_attributes`, `categories`, `brands`, `product_taxes` |
| Orders | `orders`, `order_items`, `order_item_returns`, `order_payment_transactions`, `order_promo_lines` |
| Sellers | `sellers`, `stores`, `seller_orders`, `seller_order_items` |
| Delivery | `delivery_boys`, `delivery_boy_assignments`, `delivery_zones`, `delivery_time_slots`, `store_zones` |
| Customer Ops | `carts`, `cart_items`, `wishlists`, `wishlist_items`, `addresses`, `wallets`, `wallet_transactions` |
| Promotions | `promos`, `gift_cards`, `payment_refunds`, `payment_disputes` |
| Tax & Geo | `tax_classes`, `tax_rates`, `states`, `state_shipping_rates`, `pin_service_areas` |
| Content | `banners`, `featured_sections`, `hero_slides`, `menus`, `menu_items`, `settings` |

Run all migrations:

```bash
php artisan migrate
```

---

## Running Tests

The backend uses **Pest** (PHP):

```bash
cd admin
php artisan test
# or
./vendor/bin/pest
```

---

## Project Status

| Module | Completeness | Notes |
|---|---|---|
| Admin Panel | ~85% | Delivery & seller menu items currently hidden |
| Seller Panel | ~85% | Core workflows complete |
| Customer REST API | ~80% | GST line-items and email notifications pending |
| Delivery Boy API | ~90% | Fully functional |
| Payment Processing | ~90% | Easepay partial; all others production-ready |
| GST Tax Engine | ~30% | Schema in place; calculation logic in progress |
| Next.js Storefront | ~45% | Component library built; API integration pending |
| Notifications (Push) | ~75% | FCM works; email/SMS not yet implemented |

See [GAP_ANALYSIS.md](GAP_ANALYSIS.md) for a detailed requirements vs. implementation matrix.
