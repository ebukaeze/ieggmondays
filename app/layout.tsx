import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/cursor/CustomCursor";
import Preloader from "@/components/layout/Preloader";
import PageTransition from "@/components/animations/PageTransition";
import { geistSans, geistMono } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "ieggmondays",
  description: "Creative studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <CustomCursor />
          <Preloader />
          <PageTransition />
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
