import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZKEntropy - Provably Fair Token Launch",
  description: "The first ERC-20 fair launch verified by Groth16 ZK proofs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-mesh bg-grid antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
