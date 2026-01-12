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
            const response = await fetch("/api/airdrop", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicKey: smartWalletPubkey }),
            });

            if (response.ok) {
                setStatus("success");
                window.dispatchEvent(new CustomEvent("refresh-balance"));
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Airdrop failed:", error);
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

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
