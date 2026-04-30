import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Student Management System",
  description: "Advanced Student CRM & Portal",
};

import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorFallback } from "@/components/ui/GlobalErrorFallback";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
          <AuthProvider>
            <QueryProvider>
              {children}
              <Toaster position="top-right" richColors />
            </QueryProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
