import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/session-provider";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Home Loan Toolkit - Save ₹8-25 Lakhs on Your Home Loan",
  description: "Interactive calculators and proven strategies to optimize your home loan. Beautiful visualizations, tax optimization, and expert guidance.",
  keywords: ["home loan", "EMI calculator", "prepayment", "tax saving", "India"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${comfortaa.variable} font-sans antialiased`} suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
