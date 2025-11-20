import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/toastContext";
import { CartProvider } from "@/lib/cartContext";
import ToastContainer from "@/components/ToastContainer";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Elghaly Coffe",
  description: "Premium Coffee Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cairo.variable} antialiased`}>
        <CartProvider>
          <ToastProvider>
            <NextSSRPlugin
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            {children}
            <ToastContainer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
