import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Removed to keep it simple, or use local font
import "./globals.css";
import { LazorkitProviderWrapper } from "@/components/LazorkitProviderWrapper";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Lazorkit Solana Starter",
    description: "Next.js starter for Lazorkit Passkey & Gasless integration",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-white text-gray-900 antialiased">
                <LazorkitProviderWrapper>
                    {children}
                </LazorkitProviderWrapper>
            </body>
        </html>
    );
}
