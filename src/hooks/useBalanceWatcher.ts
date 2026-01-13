"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useRef } from "react";
import { useActivityLog } from "./useActivityLog";

export function useBalanceWatcher(onReceive?: (amount: number, asset: "SOL" | "USDC" | "Token") => void) {
    const { isConnected, smartWalletPubkey } = useWallet();
    const { addLog } = useActivityLog();
    const prevSolBalanceRef = useRef<number | null>(null);
    // Store mint -> balance
    const prevTokenBalancesRef = useRef<Map<string, number>>(new Map());

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
                    if (diff > 0.001) {
                        addLog("INFO", `Received ${diff.toFixed(4)} SOL`);
                        onReceive?.(diff, "SOL");
                    }
                }
                prevSolBalanceRef.current = solBal;

                // 2. Check ALL SPL Tokens
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(smartWalletPubkey, {
                    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                });

                const currentBalances = new Map<string, number>();

                for (const { account } of tokenAccounts.value) {
                    const info = account.data.parsed.info;
                    const mint = info.mint;
                    const amount = info.tokenAmount.uiAmount || 0;
                    currentBalances.set(mint, amount);

                    // If we have history for this mint, check for change
                    if (prevTokenBalancesRef.current.has(mint)) {
                        const prev = prevTokenBalancesRef.current.get(mint) || 0;
                        const diff = amount - prev;

                        // Detect increase (Received)
                        if (diff > 0) {
                            const isUSDC = mint === "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
                            const assetName = isUSDC ? "USDC" : "Token";

                            // Log it
                            addLog("INFO", `Received ${diff.toFixed(isUSDC ? 2 : 4)} ${assetName}`);
                            onReceive?.(diff, assetName);
                        }
                    }
                }

                // Update refs
                prevTokenBalancesRef.current = currentBalances;

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
