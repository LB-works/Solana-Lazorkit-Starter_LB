"use client";

import { useState, useEffect } from "react";
import { PayWithSolana } from "./PayWithSolana";
import { TokenSwap } from "./TokenSwap";
import { TransactionHistory, TransactionRecord } from "./TransactionHistory";
import { ShieldCheck, Zap, History } from "lucide-react";
import { useWallet } from "@lazorkit/wallet";

export function TransactionWidget() {
    const [activeTab, setActiveTab] = useState<"swap" | "pay" | "history">("swap");
    const { isConnected } = useWallet();
    const [history, setHistory] = useState<TransactionRecord[]>([]);

    // Load history from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("lazorkit_history");
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const addToHistory = (record: Omit<TransactionRecord, "id" | "timestamp">) => {
        const newRecord: TransactionRecord = {
            ...record,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
        };
        const updated = [newRecord, ...history];
        setHistory(updated);
        localStorage.setItem("lazorkit_history", JSON.stringify(updated));
    };

    return (
        <div className="w-full max-w-[420px] mx-auto flex flex-col gap-6">
            {/* Gasless Mode Indicator */}
            <div className="flex items-center justify-center gap-2">
                <div className="bg-[#7857ff]/5 text-[#7857ff] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-[#7857ff]/10 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-[#7857ff] rounded-full animate-pulse" />
                    <span>Gasless Mode Active</span>
                </div>
            </div>

            {/* Main Widget Container */}
            <div className="bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative">

                {/* Tabs */}
                <div className="flex items-center justify-center p-2 mt-4">
                    <div className="bg-gray-100/80 p-1.5 rounded-full flex gap-1 relative w-full max-w-[320px]">
                        <button
                            onClick={() => setActiveTab("swap")}
                            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === "swap"
                                ? "bg-white text-black shadow-md"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Swap
                        </button>
                        <button
                            onClick={() => setActiveTab("pay")}
                            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === "pay"
                                ? "bg-white text-black shadow-md"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Pay
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${activeTab === "history"
                                ? "bg-white text-black shadow-md"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <History size={14} /> History
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 min-h-[400px]">
                    {activeTab === "swap" ? (
                        <TokenSwap onComplete={(details) => addToHistory({ ...details, type: "Swap" })} />
                    ) : activeTab === "pay" ? (
                        <PayWithSolana onComplete={(details) => addToHistory({ ...details, type: "Pay" })} />
                    ) : (
                        <TransactionHistory transactions={history} />
                    )}
                </div>
                {/* Footer */}
                <div className="bg-gray-50/50 border-t border-gray-100 p-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <div className="p-1 bg-[#7857ff]/10 rounded-md">
                            <ShieldCheck size={16} className="text-[#7857ff]" />
                        </div>
                        <span className="text-gray-900 font-bold text-sm tracking-tight">
                            Gasless <span className="text-gray-300 mx-0.5">•</span> Passkey secured
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
