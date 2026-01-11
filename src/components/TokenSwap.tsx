"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, Connection, LAMPORTS_PER_SOL, PublicKey, Keypair } from "@solana/web3.js";
import { ArrowDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function TokenSwap() {
    const { isConnected, smartWalletPubkey, signAndSendTransaction } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [fromAmount, setFromAmount] = useState("0.0001");
    const [toAmount, setToAmount] = useState("0.0148");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [signature, setSignature] = useState("");
    const [isSolToUsdc, setIsSolToUsdc] = useState(true);
    const [balance, setBalance] = useState<number | null>(null);

    // Fetch Real Balance
    useEffect(() => {
        if (isConnected && smartWalletPubkey) {
            const connection = new Connection("https://api.devnet.solana.com", "confirmed");
            const fetchBal = () => connection.getBalance(smartWalletPubkey).then((bal) => setBalance(bal / LAMPORTS_PER_SOL)).catch(console.error);
            fetchBal();
            const id = setInterval(fetchBal, 5000);
            return () => clearInterval(id);
        }
    }, [isConnected, smartWalletPubkey]);

    const switchTokens = () => {
        setIsSolToUsdc(!isSolToUsdc);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    const handleAmountChange = (val: string) => {
        setFromAmount(val);
        const rate = 148.5;
        if (isSolToUsdc) {
            setToAmount((Number(val) * rate).toFixed(4));
        } else {
            setToAmount((Number(val) / rate).toFixed(6));
        }
    };

    const handleSwap = async () => {
        if (!isConnected || !smartWalletPubkey) return;

        setIsLoading(true);
        setStatus("idle");

        try {
            // Perform a real transfer to a random address (simulating a swap output).
            // Using a distinct address avoids "Account Borrowed" (0x2) errors.
            // Sending 0.01 SOL ensures the new account meets Rent Exemption requirements (min ~0.0009 SOL).
            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: Keypair.generate().publicKey,
                lamports: 0.01 * LAMPORTS_PER_SOL,
            });

            const txSig = await signAndSendTransaction({
                instructions: [instruction],
            });

            setSignature(txSig);
            setStatus("success");
            alert("Swap Confirmed! Transaction processed on Solana Devnet.");
        } catch (error) {
            console.error("Swap failed:", error);
            setStatus("error");
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
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="bg-transparent text-3xl font-bold text-gray-900 outline-none w-full placeholder:text-gray-300 font-sans"
                    />
                    <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-2.5 py-1.5 shadow-sm shrink-0">
                        {isSolToUsdc ? (
                            <>
                                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-[10px] text-white font-bold">◎</div>
                                <span className="text-gray-900 font-bold text-sm">SOL</span>
                            </>
                        ) : (
                            <>
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">$</div>
                                <span className="text-gray-900 font-bold text-sm">USDC</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="px-2 text-xs text-gray-400 font-medium">
                    Balance: {balance !== null ? balance.toFixed(4) : "..."} SOL
                </div>
            </div>

            {/* Arrow Divider */}
            <div className="flex justify-center -my-2 relative z-10">
                <button
                    onClick={switchTokens}
                    className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm text-gray-400 hover:text-[#7857ff] hover:border-[#7857ff]/30 transition-all active:scale-95"
                >
                    <ArrowDown size={14} />
                </button>
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
                    <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-2.5 py-1.5 shadow-sm shrink-0">
                        {!isSolToUsdc ? (
                            <>
                                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-[10px] text-white font-bold">◎</div>
                                <span className="text-gray-900 font-bold text-sm">SOL</span>
                            </>
                        ) : (
                            <>
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">$</div>
                                <span className="text-gray-900 font-bold text-sm">USDC</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="px-2 text-xs text-gray-400 font-medium">Rate: 1 SOL ≈ $148.50</div>
            </div>

            {status === "success" ? (
                <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl animate-in fade-in">
                    <p className="text-green-700 text-sm font-bold mb-1">Swap Successful!</p>
                    <p className="text-xs text-green-600 break-all">
                        Signature: {signature.slice(0, 16)}...
                    </p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="mt-2 text-xs font-bold text-green-700 hover:underline"
                    >
                        Swap Again
                    </button>
                </div>
            ) : status === "error" ? (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl animate-in fade-in">
                    <p className="text-red-700 text-sm font-bold">Swap Failed</p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="mt-1 text-xs font-bold text-red-600 hover:underline"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleSwap}
                    disabled={!isConnected || isLoading}
                    className="w-full mt-2 bg-[#7857ff] hover:bg-[#6344d4] text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(120,87,255,0.3)] hover:shadow-[0_6px_20px_rgba(120,87,255,0.23)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Swap instantly"}
                </button>
            )}
        </div>
    );
}
