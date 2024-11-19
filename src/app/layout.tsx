import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes"; // Import ThemeProvider
import "./globals.css";
import SidebarWrapper from "@/components/sideBarWarp";

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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class"> {/* Wrap with ThemeProvider */}
          {children}
          <SidebarWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
