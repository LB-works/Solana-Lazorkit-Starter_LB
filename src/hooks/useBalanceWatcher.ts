"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useRef } from "react";
import { useActivityLog } from "./useActivityLog";

export function useBalanceWatcher(onReceive?: (amount: number) => void) {
    const { isConnected, smartWalletPubkey } = useWallet();
    const { addLog } = useActivityLog();
    const prevBalanceRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isConnected || !smartWalletPubkey) return;

        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        const checkBalance = async () => {
            try {
                const bal = await connection.getBalance(smartWalletPubkey);
                const solBal = bal / LAMPORTS_PER_SOL;

                if (prevBalanceRef.current !== null) {
                    const diff = solBal - prevBalanceRef.current;
                    // If balance increased by more than 0.000001 (dust filter)
                    if (diff > 0.000001) {
                        addLog("INFO", `Received ${diff.toFixed(4)} SOL`);
                        onReceive?.(diff);
                    }
                }
                prevBalanceRef.current = solBal;
            } catch (e) {
                console.error("Balance watcher error:", e);
            }
        };

        // Check immediately
        checkBalance();

        // Poll every 5 seconds
        const id = setInterval(checkBalance, 5000);
        return () => clearInterval(id);
    }, [isConnected, smartWalletPubkey, addLog]);
}
