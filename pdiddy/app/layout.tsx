import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { ToastContainer } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pdiddy - Sua plataforma de compras de comida online",
  description: "Qualidade e sabor na palma da sua mão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a href="#main-content" className="skip-to-main">
          Pular para o conteúdo principal
        </a>
        <ErrorBoundary>
          <QueryProvider>
            <ToastProvider>
              <AuthProvider>
                <CartProvider>
                  {children}
                  <ToastContainer />
                </CartProvider>
              </AuthProvider>
            </ToastProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
