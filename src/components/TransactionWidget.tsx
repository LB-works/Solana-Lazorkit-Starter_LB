"use client";

import { useState, useEffect, useRef } from "react";
import { PayWithSolana } from "./PayWithSolana";
import { TokenSwap } from "./TokenSwap";
import { SubscriptionService } from "./SubscriptionService";
import { SendFund } from "./SendFund";
import { ReceiveFund } from "./ReceiveFund";
import { ActivityLogUI } from "./ActivityLogUI";
import { TransactionHistory, TransactionRecord } from "./TransactionHistory";
import { ShieldCheck, History, Send, Download, RefreshCw, Smartphone, ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";
import { useWallet } from "@lazorkit/wallet";

import { useBalanceWatcher } from "../hooks/useBalanceWatcher";

export function TransactionWidget() {
    // Enable observation of balance changes
    useBalanceWatcher((amount) => {
        addToHistory({
            type: "Receive",
            amount: `${amount.toFixed(4)} SOL`,
            status: "success",
            description: "Received from external wallet"
        });
    });

    // State for tabs and arrowsetActiveTab] = useState<"swap" | "send" | "receive" | "pay" | "log" | "history">("swap");
    const [activeTab, setActiveTab] = useState<"swap" | "send" | "receive" | "pay" | "log" | "history">("swap");
    const { isConnected } = useWallet();
    const [history, setHistory] = useState<TransactionRecord[]>([]);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const tabContainerRef = useRef<HTMLDivElement>(null);

    // ... code ...

    {/* Content Area with Dynamic Height */ }
    <div className={`px-8 pt-8 pb-6 ${activeTab === "log" || activeTab === "history" ? "min-h-[460px]" : "min-h-[400px]"}`}>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === "swap" ? (
                <TokenSwap onComplete={(details) => addToHistory({ ...details, type: "Swap" })} />
            ) : activeTab === "send" ? (
                <SendFund onComplete={(details) => addToHistory({ ...details, type: "Send" })} />
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

    {/* Footer */ }
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
            </div >
        </div >
    );
}
