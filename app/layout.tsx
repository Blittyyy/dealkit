import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DealKit — Close More DTC Brand Deals",
  description:
    "Present your CTR, retention, and ROAS in a structured media kit designed to increase your close rate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base text-primary">{children}</body>
    </html>
  );
}
