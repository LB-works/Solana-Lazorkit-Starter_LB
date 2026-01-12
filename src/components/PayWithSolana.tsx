"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, LAMPORTS_PER_SOL, PublicKey, Keypair } from "@solana/web3.js";
import { Loader2, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";

export function PayWithSolana({ onComplete }: { onComplete?: (details: { amount: string; status: "success" | "error"; signature?: string }) => void }) {
    const { isConnected, smartWalletPubkey, signAndSendTransaction } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const product = {
        name: "Lazorkit Premium Starter",
        price: 0.05, // Increased amount as requested by user
        image: <ShieldCheck size={24} className="text-[#7857ff] fill-[#7857ff]/10" />
    };

    const handlePayment = async () => {
        if (!isConnected || !smartWalletPubkey) return;

        setIsLoading(true);
        setStatus("idle");
        setErrorMessage("");

        try {
            // Send to a fixed "Demo Merchant" address that already exists on Devnet.
            // Using an existing address avoids Rent Exemption errors for new accounts.
            // Using a distinct address (not self) avoids 0x2 Account Borrowed errors.
            const merchantPubkey = new PublicKey("8X35rQUK2u9hfn8rMPwwr6ZSEUhbmfDPEapp589XyoM1");
            // Using a verified 44-character Devnet address.
            // This is writable, pre-existing, and distinct.

            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: merchantPubkey,
                lamports: product.price * LAMPORTS_PER_SOL,
            });

            const sig = await signAndSendTransaction({
                instructions: [instruction],
                // standard gas (SOL) to ensure success for new wallets
            });

            setStatus("success");
            // Trigger balance refresh
            window.dispatchEvent(new Event("refresh-balance"));

            onComplete?.({
                amount: `${product.price} SOL`,
                status: "success",
                signature: sig
            });
            alert(`Payment Successful!\nSignature: ${sig.slice(0, 8)}...`);

        } catch (error: any) {
            console.warn("Payment process cancelled or failed:", error);
            setStatus("error");
            setErrorMessage(error?.message || "Payment failed. Please try again.");
            onComplete?.({
                amount: `${product.price} SOL`,
                status: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Payment Card */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 mb-8 flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                    {product.image}
                </div>
                <div>
                    <h3 className="text-gray-900 font-bold text-lg leading-tight">{product.name}</h3>
                    <p className="text-gray-500 text-sm font-medium">Digital License</p>
                </div>
            </div>

            <div className="flex flex-col gap-1 mb-8 text-center">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Amount</div>
                <div className="text-gray-900 font-black text-4xl tracking-tight">0.05 <span className="text-[#7857ff] text-2xl">SOL</span></div>
                <div className="text-sm text-gray-500 font-medium">≈ $7.50 USD</div>
            </div>

            {status === "success" ? (
                <div className="bg-green-50 text-center py-6 rounded-2xl border border-green-100 animate-in fade-in zoom-in">
                    <div className="flex justify-center mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <ShieldCheck size={20} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-green-800 font-bold text-base mb-1">Payment Successful!</p>
                    <p className="text-green-600 text-sm">Transaction verified on-chain</p>
                </div>
            ) : status === "error" ? (
                <div className="bg-red-50 text-center py-4 rounded-xl border border-red-100 mb-2">
                    <p className="text-red-600 font-bold text-sm mb-2">{errorMessage || "Payment Failed"}</p>
                    <button onClick={() => setStatus('idle')} className="text-xs font-bold bg-white border border-red-100 text-red-500 px-4 py-2 rounded-full hover:bg-red-50 transition-colors">Try Again</button>
                </div>
            ) : (
                <button
                    onClick={handlePayment}
                    disabled={!isConnected || isLoading}
                    className="w-full bg-[#7857ff] hover:bg-[#6344d4] text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(120,87,255,0.3)] hover:shadow-[0_6px_20px_rgba(120,87,255,0.23)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : `Pay ${product.price} SOL`}
                </button>
            )}

            {!isConnected && status !== "success" && (
                <p className="text-center text-gray-400 text-[10px] mt-4 font-bold uppercase tracking-wider">Connect wallet to proceed</p>
            )}
        </div>
    );
}
