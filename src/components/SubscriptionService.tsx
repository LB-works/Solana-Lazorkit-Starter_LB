"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Loader2, CreditCard, Check, ShieldCheck } from "lucide-react";

export function SubscriptionService({ onComplete }: { onComplete?: (details: { amount: string; status: "success" | "error"; signature?: string }) => void }) {
    const { isConnected, smartWalletPubkey, signAndSendTransaction } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [isAutoBilling, setIsAutoBilling] = useState(true);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const subscription = {
        name: "Pro Subscription",
        price: 0.05,
        period: "month"
    };

    const handleSubscribe = async () => {
        if (!isConnected || !smartWalletPubkey) return;

        setIsLoading(true);
        setStatus("idle");

        try {
            // Using the same stable merchant address from PayWithSolana
            const merchantPubkey = new PublicKey("8X35rQUK2u9hfn8rMPwwr6ZSEUhbmfDPEapp589XyoM1");

            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: merchantPubkey,
                lamports: subscription.price * LAMPORTS_PER_SOL,
            });

            const sig = await signAndSendTransaction({
                instructions: [instruction],
            });

            setStatus("success");
            // Trigger balance refresh
            window.dispatchEvent(new Event("refresh-balance"));

            onComplete?.({
                amount: `${subscription.price} SOL`,
                status: "success",
                signature: sig
            });
            alert(`Subscription Activated!\nSignature: ${sig.slice(0, 8)}...`);

        } catch (error: any) {
            console.error("Subscription failed:", error);
            setStatus("error");
            onComplete?.({
                amount: `${subscription.price} SOL`,
                status: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Plan Header */}
            <div className="bg-[#7857ff]/5 border border-[#7857ff]/10 rounded-3xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                        <ShieldCheck size={24} className="text-[#7857ff] fill-[#7857ff]/10" />
                    </div>
                    <span className="bg-[#7857ff] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Best Value</span>
                </div>
                <h3 className="text-gray-900 font-extrabold text-2xl tracking-tight mb-1">{subscription.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-[#7857ff] font-black text-3xl">{subscription.price} SOL</span>
                    <span className="text-gray-400 font-bold text-sm">/ {subscription.period}</span>
                </div>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6 px-2">
                {["Unlimited Gasless Tx", "Priority Support", "Advanced Analytics"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                            <Check size={12} className="text-green-600" />
                        </div>
                        <span className="text-gray-600 text-sm font-bold">{feature}</span>
                    </div>
                ))}
            </div>

            {/* Auto-billing Toggle */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <CreditCard size={16} className="text-gray-400" />
                    </div>
                    <div>
                        <div className="text-gray-900 font-bold text-sm">Auto-Billing</div>
                        <div className="text-gray-400 text-[10px] font-medium">Renew automatically</div>
                    </div>
                </div>
                <button
                    onClick={() => setIsAutoBilling(!isAutoBilling)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${isAutoBilling ? 'bg-[#7857ff]' : 'bg-gray-200'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoBilling ? 'left-6' : 'left-1'}`} />
                </button>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubscribe}
                disabled={!isConnected || isLoading}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-[0_12px_24px_-8px_rgba(120,87,255,0.3)] flex items-center justify-center gap-2 ${!isConnected || isLoading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#7857ff] text-white hover:bg-[#6646ff] hover:scale-[1.02] active:scale-[0.98]"
                    }`}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Confirming...
                    </>
                ) : (
                    "Subscribe Now"
                )}
            </button>

            {!isConnected && (
                <p className="text-center text-gray-400 text-[10px] mt-3 font-bold uppercase tracking-widest italic leading-none">
                    Connect wallet to subscribe
                </p>
            )}
        </div>
    );
}
