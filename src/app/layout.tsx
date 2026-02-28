import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mantl",
  description: "Prediction market depth visualization — educational research tool",
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
