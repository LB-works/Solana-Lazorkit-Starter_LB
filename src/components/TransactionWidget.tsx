"use client";

import { useState, useEffect } from "react";
import { PayWithSolana } from "./PayWithSolana";
import { TokenSwap } from "./TokenSwap";
import { SubscriptionService } from "./SubscriptionService";
import { SendFund } from "./SendFund";
import { ReceiveFund } from "./ReceiveFund";
import { ActivityLogUI } from "./ActivityLogUI";
import { TransactionHistory, TransactionRecord } from "./TransactionHistory";
import { ShieldCheck, History, Send, Download, RefreshCw, Smartphone, ClipboardList } from "lucide-react";
import { useWallet } from "@lazorkit/wallet";

export function TransactionWidget() {
    const [activeTab, setActiveTab] = useState<"swap" | "send" | "receive" | "pay" | "log" | "history">("swap");
    const { isConnected } = useWallet();
    const [history, setHistory] = useState<TransactionRecord[]>([]);

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
        <div className="w-full max-w-[540px] mx-auto flex flex-col gap-6">
            {/* Gasless Mode Indicator */}
            <div className="flex items-center justify-center gap-2">
                <div className="bg-[#7857ff]/5 text-[#7857ff] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-[#7857ff]/10 shadow-sm transition-all hover:scale-105">
                    <div className="w-1.5 h-1.5 bg-[#7857ff] rounded-full animate-pulse" />
                    <span>Gasless Patterns Active</span>
                </div>
            </div>

            {/* Main Widget Container */}
            <div className="bg-white rounded-[40px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden relative transition-all duration-500">

                {/* Scrollable Tabs */}
                <div className="px-5 pt-8 overflow-x-auto no-scrollbar scrollbar-hide bg-white">
                    <div className="bg-gray-100/60 p-1 rounded-2xl flex gap-1 relative min-w-max">
                        <button
                            onClick={() => setActiveTab("swap")}
                            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "swap" ? "bg-white text-[#7857ff] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <div className="flex items-center gap-1.5 justify-center">
                                <RefreshCw size={12} /> Swap
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("send")}
                            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "send" ? "bg-white text-[#7857ff] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <div className="flex items-center gap-1.5 justify-center">
                                <Send size={12} /> Send
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("receive")}
                            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "receive" ? "bg-white text-[#7857ff] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <div className="flex items-center gap-1.5 justify-center">
                                <Download size={12} /> Receive
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("pay")}
                            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "pay" ? "bg-white text-[#7857ff] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <div className="flex items-center gap-1.5 justify-center">
                                <Smartphone size={12} /> Pay/Sub
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("log")}
                            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "log" ? "bg-white text-[#7857ff] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <div className="flex items-center gap-1.5 justify-center">
                                <ClipboardList size={12} /> Log
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "history" ? "bg-white text-[#7857ff] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <History size={12} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="px-8 pt-8 pb-4 min-h-[460px]">
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {activeTab === "swap" ? (
                            <TokenSwap onComplete={(details) => addToHistory({ ...details, type: "Swap" })} />
                        ) : activeTab === "send" ? (
                            <SendFund />
                        ) : activeTab === "receive" ? (
                            <ReceiveFund />
                        ) : activeTab === "pay" ? (
                            <div className="space-y-6">
                                <PayWithSolana onComplete={(details) => addToHistory({ ...details, type: "Pay" })} />
                                <div className="border-t border-gray-100 pt-6">
                                    <SubscriptionService onComplete={(details) => addToHistory({ ...details, type: "Sub" })} />
                                </div>
                            </div>
                        ) : activeTab === "log" ? (
                            <ActivityLogUI />
                        ) : (
                            <TransactionHistory transactions={history} />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50/50 border-t border-gray-100 p-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <div className="p-1 bg-[#7857ff]/10 rounded-md">
                            <ShieldCheck size={16} className="text-[#7857ff]" />
                        </div>
                        <span className="text-gray-900 font-bold text-xs tracking-tight uppercase tracking-widest opacity-80">
                            Pattern-First SDK Architecture
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
