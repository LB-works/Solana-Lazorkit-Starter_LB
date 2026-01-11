"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ArrowRight, Loader2, Send } from "lucide-react";
import { useState } from "react";

export function GaslessTransfer() {
    const { isConnected, smartWalletPubkey, signAndSendTransaction } = useWallet();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [signature, setSignature] = useState("");

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected || !smartWalletPubkey) return;

        setIsLoading(true);
        setStatus("idle");
        setSignature("");

        try {
            const recipientPubkey = new PublicKey(recipient);

            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: recipientPubkey,
                lamports: Number(amount) * LAMPORTS_PER_SOL,
            });

            const txSignature = await signAndSendTransaction({
                instructions: [instruction],
                transactionOptions: {
                    feeToken: "USDC",
                },
            });

            setSignature(txSignature);
            setStatus("success");
        } catch (error) {
            console.error("Transfer failed:", error);
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-sm">Connect your wallet to perform gasless transfers.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-gray-100 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#7857ff]/10 rounded-xl">
                    <Send className="text-[#7857ff]" size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Gasless Transfer</h3>
                    <p className="text-gray-500 text-sm font-medium">Send SOL, pay gas in USDC</p>
                </div>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                        Recipient Address
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Solana Address..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7857ff]/50 focus:ring-4 focus:ring-[#7857ff]/5 transition-all"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                        Amount (SOL)
                    </label>
                    <input
                        type="number"
                        required
                        step="0.000001"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7857ff]/50 focus:ring-4 focus:ring-[#7857ff]/5 transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#7857ff] hover:bg-[#6344d4] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#7857ff]/10 hover:shadow-[#7857ff]/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2 active:scale-[0.98]"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            Send Free <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            {status === "success" && (
                <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl">
                    <p className="text-green-700 text-sm font-bold mb-1">Transfer Successful!</p>
                    <a
                        href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-green-600 hover:text-green-800 hover:underline break-all"
                    >
                        View on Explorer
                    </a>
                </div>
            )}

            {status === "error" && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-red-700 text-sm font-bold">Transfer Failed</p>
                    <p className="text-xs text-red-600 mt-1 font-medium">Please try again.</p>
                </div>
            )}
        </div>
    );
}
