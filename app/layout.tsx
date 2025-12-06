import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "./components/ToastProvider";
import { IntegrityAI } from "./components/IntegrityAI";

const geist = localFont({
  src: "./fonts/Geist.ttf",
  variable: "--font-geist",
  weight: "400",
});

const jost = localFont({
  src: "./fonts/Jost.ttf",
  variable: "--font-jost",
  weight: "400",
});

export const metadata: Metadata = {
  title: "IntegrityOS",
  description: "IntegrityOS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${jost.variable} antialiased`}
      >
        <ToastProvider>
          {children}
          <IntegrityAI />
        </ToastProvider>
      </body>
    </html>
  );
}
