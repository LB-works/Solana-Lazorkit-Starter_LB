"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram } from "@solana/web3.js";
import { ArrowDown, Loader2 } from "lucide-react";
import { useState } from "react";

export function TokenSwap() {
    const { isConnected, smartWalletPubkey, signAndSendTransaction } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [fromAmount, setFromAmount] = useState("1.00");
    const [toAmount, setToAmount] = useState("148.50");

    const handleSwap = async () => {
        if (!isConnected || !smartWalletPubkey) return;

        setIsLoading(true);

        try {
            // Mock transaction for demo
            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: smartWalletPubkey,
                lamports: 0,
            });

            await signAndSendTransaction({
                instructions: [instruction],
            });

            await new Promise(r => setTimeout(r, 1000));

            alert("Swap successful! (This was a simulation)");

        } catch (error) {
            console.error("Swap failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* You Pay Section */}
            <div className="space-y-2">
                <label className="text-gray-500 text-xs font-bold ml-1 uppercase tracking-wider">You pay</label>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-gray-200 transition-colors focus-within:border-[#7857ff]/50 focus-within:ring-4 focus-within:ring-[#7857ff]/5 h-[80px]">
                    <input
                        type="number"
                        value={fromAmount}
                        onChange={(e) => {
                            setFromAmount(e.target.value);
                            setToAmount((Number(e.target.value) * 148.5).toFixed(2));
                        }}
                        className="bg-transparent text-3xl font-bold text-gray-900 outline-none w-full placeholder:text-gray-300 font-sans"
                    />
                    <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-2.5 py-1.5 shadow-sm cursor-pointer hover:bg-gray-50 shrink-0">
                        <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-[10px] text-white font-bold">◎</div>
                        <span className="text-gray-900 font-bold text-sm">SOL</span>
                        <ArrowDown size={12} className="text-gray-400" />
                    </div>
                </div>
                <div className="px-2 text-xs text-gray-400 font-medium">Balance: 24.05 SOL</div>
            </div>

            {/* Arrow Divider */}
            <div className="flex justify-center -my-2 relative z-10">
                <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm text-gray-400">
                    <ArrowDown size={14} />
                </div>
            </div>

            {/* You Receive Section */}
            <div className="space-y-2">
                <label className="text-gray-500 text-xs font-bold ml-1 uppercase tracking-wider">You receive</label>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-gray-200 transition-colors h-[80px]">
                    <input
                        type="number"
                        value={toAmount}
                        readOnly
                        className="bg-transparent text-3xl font-bold text-gray-900 outline-none w-full placeholder:text-gray-300 font-sans"
                    />
                    <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-2.5 py-1.5 shadow-sm cursor-pointer hover:bg-gray-50 shrink-0">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">$</div>
                        <span className="text-gray-900 font-bold text-sm">USDC</span>
                        <ArrowDown size={12} className="text-gray-400" />
                    </div>
                </div>
                <div className="px-2 text-xs text-gray-400 font-medium">Rate: 1 SOL ≈ $148.50</div>
            </div>

            {/* Action Button */}
            <button
                onClick={handleSwap}
                disabled={!isConnected || isLoading}
                className="w-full mt-2 bg-[#7857ff] hover:bg-[#6344d4] text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(120,87,255,0.3)] hover:shadow-[0_6px_20px_rgba(120,87,255,0.23)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Swap instantly"}
            </button>
        </div>
    );
}
