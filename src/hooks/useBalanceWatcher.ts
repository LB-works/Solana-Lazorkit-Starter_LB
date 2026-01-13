"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useRef } from "react";
import { useActivityLog } from "./useActivityLog";

export function useBalanceWatcher(onReceive?: (amount: number, asset: "SOL" | "USDC") => void) {
    const { isConnected, smartWalletPubkey } = useWallet();
    const { addLog } = useActivityLog();
    const prevSolBalanceRef = useRef<number | null>(null);
    const prevUsdcBalanceRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isConnected || !smartWalletPubkey) return;

        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        const checkBalances = async () => {
            try {
                // 1. Check SOL
                const bal = await connection.getBalance(smartWalletPubkey);
                const solBal = bal / LAMPORTS_PER_SOL;

                if (prevSolBalanceRef.current !== null) {
                    const diff = solBal - prevSolBalanceRef.current;
                    if (diff > 0.001) { // Higher threshold to avoid rent noise
                        addLog("INFO", `Received ${diff.toFixed(4)} SOL`);
                        onReceive?.(diff, "SOL");
                    }
                }
                prevSolBalanceRef.current = solBal;

                // 2. Check USDC (SPL Tokens)
                // We fetch all parsed token accounts to find USDC-like ones
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(smartWalletPubkey, {
                    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                });

                let totalUsdc = 0;
                // Sum up common USDC devnet mints or just all "USDC" named tokens if we could parse metadata
                // For this pattern, we'll check for the known USDC devnet mint used in Lazorkit demos
                // Mint: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU (Circle Devnet USDC)
                // OR just any token with decimals=6 for a generic "USD-like" check if mint unknown

                for (const { account } of tokenAccounts.value) {
                    const info = account.data.parsed.info;
                    const mint = info.mint;
                    // Check for standard Devnet USDC mint
                    // Also check for the mock mint likely used in TokenSwap: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
                    if (mint === "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU" || mint === "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr") {
                        totalUsdc += info.tokenAmount.uiAmount || 0;
                    }
                }

                if (prevUsdcBalanceRef.current !== null) {
                    const diff = totalUsdc - prevUsdcBalanceRef.current;
                    if (diff > 0.01) {
                        addLog("INFO", `Received ${diff.toFixed(2)} USDC`);
                        onReceive?.(diff, "USDC");
                    }
                }
                prevUsdcBalanceRef.current = totalUsdc;

            } catch (e) {
                console.error("Balance watcher error:", e);
            }
        };

        // Check immediately
        checkBalances();

        // Poll every 5 seconds
        const id = setInterval(checkBalances, 5000);
        return () => clearInterval(id);
    }, [isConnected, smartWalletPubkey, addLog]);
}
