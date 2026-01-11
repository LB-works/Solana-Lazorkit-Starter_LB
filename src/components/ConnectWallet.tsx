"use client";

import { useWallet } from "@lazorkit/wallet";
import { Loader2, LogOut, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export function ConnectWallet() {
    // CORRECTED: use `isConnected` and `smartWalletPubkey`
    const { connect, disconnect, isConnected, smartWalletPubkey, isLoading } = useWallet();
    const [isConnecting, setIsConnecting] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await connect();
        } catch (error) {
            console.warn("Passkey connection cancelled or failed:", error);
        } finally {
            setIsConnecting(false);
        }
    };

    useEffect(() => {
        if (isConnected && smartWalletPubkey) {
            const fetchBalance = async () => {
                try {
                    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
                    const bal = await connection.getBalance(smartWalletPubkey as PublicKey);
                    setBalance(bal / LAMPORTS_PER_SOL);
                } catch (e) {
                    console.error("Failed to fetch balance", e);
                }
            };
            fetchBalance();
            // Poll for balance every 5 seconds
            const interval = setInterval(fetchBalance, 5000);
            return () => clearInterval(interval);
        }
    }, [isConnected, smartWalletPubkey]);

    if (isConnected && smartWalletPubkey) {
        const copyToClipboard = () => {
            navigator.clipboard.writeText(smartWalletPubkey.toBase58());
            alert("Address copied!");
        };

        return (
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 shadow-sm">
                {balance !== null && (
                    <div className="hidden md:flex items-center gap-2 px-3 border-r border-gray-200 mr-1">
                        <span className="text-gray-600 text-sm font-bold">{balance.toFixed(3)} SOL</span>
                    </div>
                )}

                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors group"
                    title="Click to copy address"
                >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-700 font-mono text-xs font-bold group-hover:text-black">
                        {smartWalletPubkey.toBase58().slice(0, 4)}...{smartWalletPubkey.toBase58().slice(-4)}
                    </span>
                </button>
                <button
                    onClick={disconnect}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                    title="Disconnect"
                >
                    <LogOut size={16} />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleConnect}
            disabled={isConnecting || isLoading}
            className="group relative flex items-center justify-center gap-2 bg-[#7857ff] hover:bg-[#6344d4] text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-[#7857ff]/10 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
        >
            {isConnecting || isLoading ? (
                <Loader2 className="animate-spin" size={16} />
            ) : (
                <Wallet size={16} />
            )}
            <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
        </button>
    );
}
