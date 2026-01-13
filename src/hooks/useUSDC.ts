"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, PublicKey } from "@solana/web3.js";
import { useState, useEffect, useCallback } from "react";

// Standard Circle Devnet USDC Mint
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

export function useUSDC() {
    const { isConnected, smartWalletPubkey } = useWallet();
    const [balance, setBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBalance = useCallback(async () => {
        if (!isConnected || !smartWalletPubkey) return;

        try {
            // Use same connection settings as other hooks
            const connection = new Connection("https://api.devnet.solana.com", "confirmed");

            // Fetch parsed token accounts
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(smartWalletPubkey, {
                mint: USDC_MINT,
            });

            // Sum up balances if multiple accounts exist (rare for ATA, but safe)
            let total = 0;
            for (const { account } of tokenAccounts.value) {
                total += account.data.parsed.info.tokenAmount.uiAmount || 0;
            }

            setBalance(total);
            if (smartWalletPubkey) {
                localStorage.setItem(`lazorkit_usdc_balance_${smartWalletPubkey.toBase58()}`, total.toString());
            }
        } catch (error) {
            console.error("Failed to fetch USDC balance:", error);
            // Do NOT reset balance to 0 on error - keep previous valid state
        } finally {
            setIsLoading(false);
        }
    }, [isConnected, smartWalletPubkey]);

    // Initial fetch & Hydrate
    useEffect(() => {
        if (!smartWalletPubkey) return;
        
        // Hydrate from storage specific to this wallet
        const storageKey = `lazorkit_usdc_balance_${smartWalletPubkey.toBase58()}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            setBalance(parseFloat(stored));
        }
        fetchBalance();
    }, [fetchBalance, smartWalletPubkey]);

    // Poll for updates (e.g., after standard transfers)
    useEffect(() => {
        if (!isConnected) return;
        const id = setInterval(fetchBalance, 10000); // Poll every 10s

        // Listen for internal refresh events (from SendFund/TokenSwap)
        const listener = () => fetchBalance();
        window.addEventListener("refresh-balance", listener);

        return () => {
            clearInterval(id);
            window.removeEventListener("refresh-balance", listener);
        };
    }, [isConnected, fetchBalance]);

    // Mock generic "update" function to maintain interface compatibility with components
    // In reality, this just triggers a fetch, but components might pass args we ignore
    const updateBalance = async () => {
        setIsLoading(true);
        await fetchBalance();
    };

    return { balance, updateBalance, isLoading };
}
