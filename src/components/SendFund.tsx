"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Loader2, Send, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { useActivityLog } from "../hooks/useActivityLog";

/**
 * PATTERN: Gasless Asset Transfer
 * 
 * 📚 What You'll Learn:
 * • How to construct transfer instructions for SOL and SPL tokens.
 * • How paymasters sponsor transaction fees (0 SOL required).
 * • How to implement form validation for blockchain addresses.
 */
export function SendFund() {
    const { isConnected, smartWalletPubkey, signAndSendTransaction } = useWallet();
    const { addLog } = useActivityLog();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [token, setToken] = useState<"SOL" | "USDC">("SOL");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSend = async () => {
        if (!isConnected || !smartWalletPubkey || !recipient || !amount) return;

        setIsLoading(true);
        setStatus("idle");
        addLog("SIGNING", `Sending ${amount} ${token} to ${recipient.slice(0, 8)}...`);

        try {
            /** 
             * 📚 PATTERN: Gasless Multi-Asset Support
             * In production, sending SPL tokens (like USDC) requires:
             * 1. Finding or creating an Associated Token Account (ATA).
             * 2. Constructing the transfer instruction.
             * 
             * Lazorkit's Paymaster handles both the transaction fees AND 
             * the Rent (SOL) required to create the recipient's ATA.
             */
            let instruction;
            if (token === "SOL") {
                instruction = SystemProgram.transfer({
                    fromPubkey: smartWalletPubkey,
                    toPubkey: new PublicKey(recipient),
                    lamports: Math.floor(Number(amount) * LAMPORTS_PER_SOL),
                });
            } else {
                // MOCK SPL TRANSFER: 
                // Demonstrates the flow. In production, use @solana/spl-token
                instruction = SystemProgram.transfer({
                    fromPubkey: smartWalletPubkey,
                    toPubkey: new PublicKey(recipient),
                    lamports: 1000, // Minimal lamp to trigger signature request
                });
            }

            const signature = await signAndSendTransaction({
                instructions: [instruction],
            });

            setStatus("success");
            addLog("SUCCESS", `Sent ${amount} ${token} gaslessly!`, { signature });
            window.dispatchEvent(new Event("refresh-balance"));
        } catch (error: any) {
            console.error("Transfer failed:", error);
            setStatus("error");
            addLog("ERROR", `Transfer failed: ${error.message || 'Cancelled'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider ml-1">Recipient Address</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Solana Address"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#7857ff] transition-colors text-sm font-mono"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider ml-1">Amount</label>
                <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 outline-none focus:border-[#7857ff] transition-colors text-sm font-bold"
                />
            </div>

            <div className="space-y-2">
                <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider ml-1">Select Asset</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setToken("SOL")}
                        className={`flex-1 py-3 px-4 rounded-xl border transition-all font-bold text-sm flex items-center justify-center gap-2 ${token === "SOL"
                            ? "bg-[#7857ff] text-white border-[#7857ff] shadow-sm"
                            : "bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200"
                            }`}
                    >
                        <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center text-[8px] text-white font-bold">◎</div>
                        SOL
                    </button>
                    <button
                        type="button"
                        onClick={() => setToken("USDC")}
                        className={`flex-1 py-3 px-4 rounded-xl border transition-all font-bold text-sm flex items-center justify-center gap-2 ${token === "USDC"
                            ? "bg-[#7857ff] text-white border-[#7857ff] shadow-sm"
                            : "bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200"
                            }`}
                    >
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">$</div>
                        USDC
                    </button>
                </div>
                {token === "USDC" && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 mt-2">
                        <p className="text-blue-700 text-[10px] font-bold leading-relaxed">
                            💡 <span className="font-black">USDC (Mock)</span> is a simulated SPL token for demo purposes. It showcases gasless transfers and SDK flows. Not real USDC.
                        </p>
                    </div>
                )}
            </div>

            {status === "success" ? (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 animate-in zoom-in-95">
                    <ShieldCheck size={20} className="text-green-600" />
                    <div className="flex-1">
                        <p className="text-green-800 text-xs font-bold leading-tight">Transfer Sent!</p>
                        <p className="text-green-600 text-[10px] opacity-70">Gas sponsored by Paymaster</p>
                    </div>
                    <button onClick={() => setStatus("idle")} className="text-xs font-bold text-green-700 hover:underline">Reset</button>
                </div>
            ) : (
                <button
                    onClick={handleSend}
                    disabled={isLoading || !recipient || !amount}
                    className="w-full bg-[#7857ff] hover:bg-[#6344d4] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    <span>{isLoading ? "Signing..." : `Send ${token}`}</span>
                </button>
            )}
        </div>
    );
}
