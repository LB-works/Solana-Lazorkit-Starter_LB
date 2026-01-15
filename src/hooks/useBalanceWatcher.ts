"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useRef } from "react";
import { useActivityLog } from "./useActivityLog";

// Standard Circle Devnet USDC Mint
const USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

export function useBalanceWatcher(onReceive?: (amount: number, asset: "SOL" | "USDC" | "Token", signature?: string) => void) {
    const { isConnected, smartWalletPubkey } = useWallet();
    const { addLog } = useActivityLog();
    const prevSolBalanceRef = useRef<number | null>(null);
    const prevTokenBalancesRef = useRef<Map<string, number>>(new Map());
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (!isConnected || !smartWalletPubkey) {
            hasInitializedRef.current = false;
            return;
        }

        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        const checkBalances = async () => {
            try {
                // 1. Check SOL
                const bal = await connection.getBalance(smartWalletPubkey);
                const solBal = bal / LAMPORTS_PER_SOL;

                if (hasInitializedRef.current) {
                    const diff = solBal - (prevSolBalanceRef.current || 0);
                    // Filter out tiny dust fluctuations, but ensure 0.001 (standard test amt) is caught
                    if (diff > 0.0001) {
                        // Fetch signature
                        const signatures = await connection.getSignaturesForAddress(smartWalletPubkey, { limit: 1 });
                        const recentSig = signatures[0]?.signature;
                        
                        addLog("INFO", `Received ${diff.toFixed(4)} SOL`);
                        onReceive?.(diff, "SOL", recentSig);
                    }
                }
                prevSolBalanceRef.current = solBal;

                // 2. Check ALL SPL Tokens
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(smartWalletPubkey, {
                    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                });

                const currentBalances = new Map<string, number>();

                for (const { pubkey, account } of tokenAccounts.value) {
                    const info = account.data.parsed.info;
                    const mint = info.mint;
                    const amount = info.tokenAmount.uiAmount || 0;
                    currentBalances.set(mint, amount);

                    if (hasInitializedRef.current) {
                        // Default to 0 if new token (covers 'First Deposit' case)
                        const prev = prevTokenBalancesRef.current.get(mint) || 0;
                        const diff = amount - prev;

                        if (diff > 0) {
                            const isUSDC = mint === USDC_MINT;
                            const assetName = isUSDC ? "USDC" : "Token";
                            
                            // Fetch signature for the ATA
                            const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 1 });
                            const recentSig = signatures[0]?.signature;

                            const formattedAmount = isUSDC ? diff.toFixed(2) : diff.toFixed(4);
                            addLog("INFO", `Received ${formattedAmount} ${assetName}`);
                            onReceive?.(diff, assetName, recentSig);
                        }
                    }
                }

                prevTokenBalancesRef.current = currentBalances;
                hasInitializedRef.current = true;

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
