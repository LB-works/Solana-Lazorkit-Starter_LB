"use client";
import { ConnectWallet } from "@/components/ConnectWallet";
import { TransactionWidget } from "@/components/TransactionWidget";
import { Airdrop } from "@/components/Airdrop";
import { Zap, ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <main className="min-h-screen relative bg-white text-gray-900 selection:bg-[#7857ff]/10 selection:text-[#7857ff] font-['Inter',sans-serif]">

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Trigger */}
                        <button
                            className="md:hidden p-2 -ml-2 text-gray-500"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                                <Image
                                    src="/logo.png"
                                    alt="Lazorkit Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-bold text-lg tracking-tight">Lazorkit</span>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="https://docs.lazorkit.com" target="_blank" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                                Docs
                            </a>
                            <a href="https://github.com/lazor-kit/lazor-kit" target="_blank" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                                GitHub
                            </a>
                            <div className="h-4 w-px bg-gray-200 mx-1" />
                            <Airdrop variant="compact" />
                        </nav>
                        <ConnectWallet />
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-6 animate-in slide-in-from-top-2 duration-200">
                        <nav className="flex flex-col gap-4">
                            <a href="https://docs.lazorkit.com" target="_blank" className="text-base font-bold text-gray-900">
                                Documentation
                            </a>
                            <a href="https://github.com/lazor-kit/lazor-kit" target="_blank" className="text-base font-bold text-gray-900">
                                GitHub Repository
                            </a>
                            <div className="pt-4 border-t border-gray-100">
                                <Airdrop variant="full" />
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center relative z-10">

                {/* Hero Content */}
                <div className="text-center max-w-3xl mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7857ff]/5 text-[#7857ff] text-sm font-semibold border border-[#7857ff]/20 mb-2 relative z-10">
                        <span className="bg-[#7857ff]/20 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide">New</span>
                        Passkey smart-wallet SDK for Solana
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        Smart Wallets. <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7857ff] to-[#4F46E5]">
                            Powered by Passkeys
                        </span>
                    </h1>

                    <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
                        The user experience layer for Solana. Enable gasless transactions, biometric authentication, and instant swaps with just a few lines of code.
                    </p>
                </div>

                {/* Main Widget Section */}
                <div className="w-full flex flex-col items-center mb-24 animate-in fade-in zoom-in duration-700 delay-150 relative z-20">

                    {/* Gasless Heads-up */}
                    <div className="mb-8 flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm font-bold shadow-sm">
                        <div className="p-1 bg-[#7857ff]/10 rounded-md">
                            <ShieldCheck size={14} className="text-[#7857ff]" />
                        </div>
                        <span>Connect your wallet to perform gasless transactions</span>
                    </div>

                    <TransactionWidget />
                </div>

                {/* Footer / CTA Section */}
                <div className="text-center space-y-12 max-w-2xl mx-auto w-full">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">Ready to Build?</h3>
                        <p className="text-gray-500 leading-relaxed max-w-md mx-auto">
                            Check the <span className="text-gray-900 font-semibold tracking-tight">tutorials</span> folder to learn how these components work under the hood.
                        </p>

                        <div className="flex flex-col items-center gap-6">
                            <a href="https://docs.lazorkit.com" target="_blank" className="bg-[#7857ff] hover:bg-[#6344d4] text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl shadow-[#7857ff]/10 hover:shadow-[#7857ff]/20 active:scale-[0.98]">
                                Read Documentation
                            </a>
                        </div>
                    </div>

                    <div className="w-full pt-12 border-t border-gray-100" />
                </div>

            </div>
        </main>
    );
}
