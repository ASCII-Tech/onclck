import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import NavbarWrapper from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASCII Payment",
  description: "ASCII Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Providers>
          <NavbarWrapper />
          {children}
        </Providers>
      </body>
    </html>
  );
}
