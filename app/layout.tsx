import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Header";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { SearchProvider } from "./components/searchBar";
import type { ReactNode } from "react";
import styles from "./layout.module.css";
import { TEXT } from "./constants";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: TEXT.app.name,
  description: TEXT.app.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${styles.body}`}
      >
        <AvailabilityProvider>
            <CartProvider>
              <FavoritesProvider>
                <SearchProvider>
                  <Header />
                  {children}
                </SearchProvider>
              </FavoritesProvider>
            </CartProvider>
        </AvailabilityProvider>
      </body>
    </html>
  );
}
