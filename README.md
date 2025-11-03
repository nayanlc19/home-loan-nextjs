# Home Loan Toolkit - Next.js

A beautiful, modern home loan calculator and strategy toolkit built with Next.js, TypeScript, shadcn/ui, and featuring stunning visualizations with **Comfortaa font**.

## 🎨 Features

- **12 Proven Strategies** - Interactive calculators for home loan optimization
- **Beautiful Visualizations** - Powered by Recharts, D3.js, and Chart.js
- **Google OAuth** - Mandatory secure login
- **Cashfree Payment Gateway** - One-time ₹99 payment for lifetime access
- **Supabase Database** - User management and payment tracking
- **Comfortaa Font** - Modern, friendly typography
- **Responsive Design** - Works on all devices

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts, D3.js, Chart.js
- **Authentication**: NextAuth.js (Google OAuth)
- **Payment**: Cashfree
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Render.com

## 📦 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local` and fill in your credentials (see below for setup guides).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) (or the port shown in terminal).

## 🔐 Environment Variables

Create `.env.local` with:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))">

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cashfree
NEXT_PUBLIC_CASHFREE_APP_ID=your-cashfree-app-id
CASHFREE_SECRET_KEY=your-cashfree-secret-key
CASHFREE_MODE=production
PAYMENT_AMOUNT=99

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

## 📊 Database Schema

Tables created via Supabase migrations:
- `users` - User profiles
- `payments` - Payment history
- `user_subscriptions` - Access control

## 🎯 Pages

- `/` - Homepage with charts
- `/auth/signin` - Google sign-in
- `/strategies` - FREE Strategy #1 (Bi-Weekly Payment Hack)
- `/checkout` - Payment page (₹99)
- `/payment/callback` - Payment result

## 🚀 Deployment on Render

1. Push to GitHub
2. Create new Web Service on Render
3. Add environment variables
4. Update Google OAuth redirect URIs
5. Deploy!

## 📝 License

All rights reserved © 2025

## 🤝 Support

Email: dmcpexam2020@gmail.com
