"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Coins, Loader2 } from "lucide-react";
import { useState } from "react";

export function Airdrop() {
    const { isConnected, smartWalletPubkey } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleAirdrop = async () => {
        if (!isConnected || !smartWalletPubkey) return;

        setIsLoading(true);
        setStatus("idle");

        try {
            const connection = new Connection("https://api.devnet.solana.com", "confirmed");
            const signature = await connection.requestAirdrop(
                smartWalletPubkey,
                1 * LAMPORTS_PER_SOL
            );
            await connection.confirmTransaction(signature);
            setStatus("success");
        } catch (error) {
            console.error("Airdrop failed:", error);
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isConnected) return null;

    return (
        <div className="inline-flex items-center gap-4 p-1.5 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 pl-3 pr-2">
                <div className="p-1.5 bg-yellow-400/10 rounded-lg">
                    <Coins className="text-yellow-600" size={16} />
                </div>
                <div className="text-left">
                    <p className="text-gray-900 font-bold text-xs">Airdrop</p>
                    <p className="text-gray-500 text-[10px] font-medium">1 Devnet SOL</p>
                </div>
            </div>

            <button
                onClick={handleAirdrop}
                disabled={isLoading}
                className="bg-white hover:bg-gray-100 text-gray-900 font-black px-4 py-2.5 rounded-xl text-xs border border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm active:scale-95"
            >
                {isLoading ? <Loader2 className="animate-spin" size={12} /> : status === "success" ? "Success!" : "Get SOL"}
            </button>
        </div>
    );
}
