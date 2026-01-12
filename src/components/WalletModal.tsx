"use client";

import { X, Copy, ExternalLink, Shield, Zap, TrendingUp, History, CreditCard } from "lucide-react";
import { useState } from "react";

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    address: string;
    balance: number | null;
    usdcBalance?: string;
}

export function WalletModal({ isOpen, onClose, address, balance, usdcBalance = "1,240.50" }: WalletModalProps) {
    if (!isOpen) return null;

    const copyAddress = () => {
        navigator.clipboard.writeText(address);
        alert("Copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-100">
                {/* Header */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#7857ff] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#7857ff]/20">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight">Smart Wallet</h3>
                            <p className="text-[#7857ff] text-[10px] font-bold uppercase tracking-widest">Secured by Passkey</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Main Stats */}
                <div className="px-8 py-6 space-y-6">
                    <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={48} className="text-[#7857ff]" />
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Balance</p>
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                            {balance !== null ? balance.toFixed(3) : "0.000"} <span className="text-gray-400 text-lg">SOL</span>
                        </h2>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#7857ff] bg-white w-fit px-3 py-1 rounded-full border border-[#7857ff]/10 shadow-sm">
                            <Zap size={10} fill="currentColor" />
                            <span>≈ ${balance !== null ? (balance * 128).toFixed(2) : "0.00"} USD</span>
                        </div>
                    </div>

                    {/* Address & QR */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-[28px] p-6 border border-gray-100 flex flex-col items-center justify-center text-center gap-3">
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Receive Funds</p>
                            <div className="w-24 h-24 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`}
                                    alt="Address QR"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="bg-gray-50 rounded-[24px] p-5 border border-gray-100 flex-1 flex flex-col justify-center gap-2">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Wallet Address</p>
                                <div className="flex items-center justify-between text-gray-900 font-mono text-xs font-bold">
                                    <span>{address.slice(0, 4)}...{address.slice(-4)}</span>
                                    <button
                                        onClick={copyAddress}
                                        className="text-[#7857ff] hover:text-[#6344d4]"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-[24px] p-5 border border-gray-100 flex-1 flex flex-col justify-center gap-2">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Asset Class</p>
                                <div className="flex items-center justify-between text-gray-900 text-xs font-bold">
                                    <span>Mock USDC</span>
                                    <span className="text-gray-400 tracking-tight">${usdcBalance}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 pt-2 grid grid-cols-2 gap-3">
                    <a
                        href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-[24px] font-bold text-sm hover:bg-black transition-colors shadow-xl shadow-black/10"
                    >
                        Explorer <ExternalLink size={14} />
                    </a>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-900 rounded-[24px] font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                        Back to App
                    </button>
                </div>
            </div>
        </div>
    );
}
