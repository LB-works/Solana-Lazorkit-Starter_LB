"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Coins, Loader2 } from "lucide-react";
import { useState } from "react";

export function Airdrop({ variant = "full" }: { variant?: "full" | "compact" }) {
    const { isConnected, smartWalletPubkey } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    if (variant === "compact") {
        return (
            <a
                href="https://faucet.solana.com/"
                target="_blank"
                rel="noreferrer"
                className="bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold px-4 py-2 rounded-xl text-xs border border-gray-200 transition-all flex items-center gap-2 shadow-sm active:scale-95 no-underline whitespace-nowrap"
            >
                Get SOL ↗
            </a>
        );
    }

    return (
        <div className="inline-flex items-center gap-4 p-1.5 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 pl-3 pr-2">
                <div className="p-1.5 bg-yellow-400/10 rounded-lg">
                    <Coins className="text-yellow-600" size={16} />
                </div>
                <div className="text-left">
                    <p className="text-gray-900 font-bold text-xs whitespace-nowrap">Airdrop</p>
                    <p className="text-gray-500 text-[10px] font-medium whitespace-nowrap">Devnet SOL</p>
                </div>
            </div>

            <a
                href="https://faucet.solana.com/"
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-gray-100 text-gray-900 font-black px-4 py-2.5 rounded-xl text-xs border border-gray-200 transition-all flex items-center gap-2 shadow-sm active:scale-95 no-underline whitespace-nowrap"
            >
                Get SOL ↗
            </a>
        </div>
    );
}
