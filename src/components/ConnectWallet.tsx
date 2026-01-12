"use client";

import { useWallet } from "@lazorkit/wallet";
import { Loader2, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { WalletModal } from "./WalletModal";

/**
 * ConnectWallet Component
 */
export function ConnectWallet() {
    const { connect, isConnected, smartWalletPubkey, isLoading } = useWallet();
    const [isConnecting, setIsConnecting] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    /**
     * Effect to handle automatic session recovery and balance polling.
     */
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

            const interval = setInterval(fetchBalance, 5000);
            window.addEventListener("refresh-balance", fetchBalance);

            return () => {
                clearInterval(interval);
                window.removeEventListener("refresh-balance", fetchBalance);
            };
        }
    }, [isConnected, smartWalletPubkey]);

    if (isConnected && smartWalletPubkey) {
        return (
            <>
                <div
                    className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full px-1.5 py-1.5 shadow-sm hover:border-[#7857ff]/30 transition-all cursor-pointer group pr-4"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7857ff] to-[#4F46E5] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                        <Wallet size={14} />
                    </div>

                    <div className="flex flex-col -gap-0.5">
                        <span className="text-gray-900 text-[10px] font-bold leading-tight uppercase tracking-widest opacity-50">Active Wallet</span>
                        <span className="text-gray-900 font-mono text-xs font-black">
                            {smartWalletPubkey.toBase58().slice(0, 4)}...{smartWalletPubkey.toBase58().slice(-4)}
                        </span>
                    </div>

                    {balance !== null && (
                        <div className="hidden md:flex items-center gap-1.5 px-3 border-l border-gray-200 ml-2">
                            <span className="text-gray-900 text-sm font-black tracking-tight">{balance.toFixed(2)}</span>
                            <span className="text-gray-400 text-[10px] font-bold">SOL</span>
                        </div>
                    )}
                </div>

                <WalletModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    address={smartWalletPubkey.toBase58()}
                    balance={balance}
                />
            </>
        );
    }

    return (
        <button
            onClick={handleConnect}
            disabled={isConnecting || isLoading}
            className="group relative flex items-center justify-center gap-2 bg-[#7857ff] hover:bg-[#6344d4] text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-[#7857ff]/10 disabled:opacity-70 disabled:cursor-not-allowed text-sm active:scale-95"
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
