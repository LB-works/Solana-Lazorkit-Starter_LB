"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ArrowDown, Loader2, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useActivityLog } from "../hooks/useActivityLog";
import { useUSDC } from "../hooks/useUSDC";

/**
 * ═══════════════════════════════════════════════════════════════
 * PATTERN: Bidirectional Asset Exchange
 * ═══════════════════════════════════════════════════════════════
 * 
 * 📚 What You'll Learn:
 * • How to construct dynamic swap transactions for different directions.
 * • How to use signAndSendTransaction() for bidirectional gasless flows.
 * • How to provide real-time UI calculates for better UX.
 * 
 * 🔧 Key SDK Methods:
 * • signAndSendTransaction() - Signs with passkey, handled by paymaster.
 * 
 * 🎭 MOCK IMPLEMENTATION - For Teaching Purposes
 * In production, you would integrate with a DEX aggregator like Jupiter API.
 * ═══════════════════════════════════════════════════════════════
 */
export function TokenSwap({ onComplete }: { onComplete?: (details: any) => void }) {
    const { isConnected, smartWalletPubkey, signAndSendTransaction } = useWallet();
    const { addLog } = useActivityLog();
    const { balance: usdcBalance, updateBalance } = useUSDC();
    const [isLoading, setIsLoading] = useState(false);
    const [fromAmount, setFromAmount] = useState("0.01");
    const [toAmount, setToAmount] = useState("1.80");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [signature, setSignature] = useState("");
    const [isSolToUsdc, setIsSolToUsdc] = useState(true);
    const [balance, setBalance] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const MOCK_RATES = {
        SOL_TO_USDC: 180.50,
        USDC_TO_SOL: 1 / 180.50
    };

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
        const newFrom = toAmount;
        setFromAmount(newFrom);
        updateOutput(newFrom, !isSolToUsdc);
        addLog("INFO", `Switched swap direction to ${!isSolToUsdc ? 'SOL -> USDC' : 'USDC -> SOL'}`);
    };

    const updateOutput = (val: string, solToUsdc: boolean) => {
        const num = Number(val);
        if (solToUsdc) {
            setToAmount((num * MOCK_RATES.SOL_TO_USDC).toFixed(2));
        } else {
            setToAmount((num * MOCK_RATES.USDC_TO_SOL).toFixed(6));
        }
    };

    const handleAmountChange = (val: string) => {
        setFromAmount(val);
        updateOutput(val, isSolToUsdc);
    };

    const handleSwap = async () => {
        if (!isConnected || !smartWalletPubkey) return;

        setIsLoading(true);
        setStatus("idle");
        setErrorMessage("");
        addLog("SIGNING", `Initiating swap: ${fromAmount} ${isSolToUsdc ? 'SOL' : 'USDC'} for ${toAmount} ${isSolToUsdc ? 'USDC' : 'SOL'}`);

        try {
            // In a real swap, we'd use Jupiter or another DEX.
            // For this pattern, we demonstrate a gasless transfer as the swap "trigger".
            const amountInLamports = Math.floor(Number(fromAmount) * LAMPORTS_PER_SOL);

            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: new PublicKey("8X35rQUK2u9hfn8rMPwwr6ZSEUhbmfDPEapp589XyoM1"), // Mock Pool Address
                lamports: isSolToUsdc ? amountInLamports : 1000,
            });

            const txSig = await signAndSendTransaction({
                instructions: [instruction],
            });

            setSignature(txSig);
            setStatus("success");
            addLog("SUCCESS", `Swapped ${fromAmount} ${isSolToUsdc ? 'SOL' : 'USDC'} (Demo Simulation)`, { signature: txSig });

            window.dispatchEvent(new Event("refresh-balance"));
            // Force refresh of USDC hook
            updateBalance();

            const description = `${fromAmount} ${isSolToUsdc ? 'SOL' : 'USDC'} → ${toAmount} ${isSolToUsdc ? 'USDC' : 'SOL'}`;
            onComplete?.({
                amount: description,
                status: "success",
                signature: txSig
            });
        } catch (error: any) {
            console.error("Swap failed:", error);
            setStatus("error");
            setErrorMessage(error.message || "Swap failed");
            addLog("ERROR", `Swap failed: ${error.message || 'User cancelled'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* You Pay Section */}
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">You pay</label>
                    <span className="text-gray-400 text-[10px] font-bold">
                        Balance: {isSolToUsdc
                            ? (balance !== null ? `${balance.toFixed(3)} SOL` : '...')
                            : `${usdcBalance.toFixed(2)} USDC`}
                    </span>
                </div>
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
            </div>

            {/* Arrow Divider */}
            <div className="flex justify-center -my-3 relative z-10 pointer-events-none">
                <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm text-gray-400">
                    <ArrowDown size={14} />
                </div>
            </div>

            {/* Invert Button (Hidden Overlay) */}
            <div className="absolute inset-x-0 top-[38%] bottom-[42%] flex items-center justify-center z-20 pointer-events-none">
                <button
                    onClick={switchTokens}
                    className="w-12 h-12 rounded-full pointer-events-auto cursor-pointer bg-transparent active:bg-gray-100/10 transition-colors"
                    aria-label="Switch direction"
                />
            </div>

            {/* You Receive Section */}
            <div className="space-y-2">
                <label className="text-gray-500 text-[10px] font-bold ml-1 uppercase tracking-wider">You receive</label>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-gray-200 transition-colors h-[80px]">
                    <div className="text-3xl font-bold text-gray-900 opacity-60">
                        {toAmount}
                    </div>
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
                <div className="px-1 text-[10px] text-gray-400 font-bold flex justify-between">
                    <span>Rate: 1 {isSolToUsdc ? 'SOL' : 'USDC'} ≈ {isSolToUsdc ? `$${MOCK_RATES.SOL_TO_USDC.toFixed(2)}` : `${MOCK_RATES.USDC_TO_SOL.toFixed(4)} SOL`}</span>
                    <span className="text-[#7857ff]">Gasless Active</span>
                </div>
            </div>

            {status === "success" ? (
                <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck size={16} className="text-green-600" />
                        <p className="text-green-700 text-sm font-bold">Swap Successful!</p>
                    </div>
                    <p className="text-[10px] text-green-600 font-mono break-all opacity-80">
                        {signature}
                    </p>
                    <div className="mt-2 text-[10px] text-gray-400 bg-white/50 p-2 rounded border border-green-100">
                        * Note: This is a Devnet simulation. Real DEX integration requires Jupiter API. Your balances won't change on-chain.
                    </div>
                    <button
                        onClick={() => {
                            if (!isSolToUsdc) {
                                updateBalance();
                            } else {
                                updateBalance();
                            }
                            setStatus("idle");
                            setErrorMessage("");
                        }}
                        className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                    >
                        New Swap
                    </button>
                </div>
            ) : status === "error" ? (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center">!</div>
                        <p className="text-red-700 text-sm font-bold">Transaction Failed</p>
                    </div>
                    <p className="text-[10px] text-red-600 opacity-80 break-words mb-3">
                        {errorMessage}
                    </p>
                    <button
                        onClick={() => {
                            setStatus("idle");
                            setErrorMessage("");
                        }}
                        className="w-full py-2 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleSwap}
                    disabled={!isConnected || isLoading}
                    className="w-full bg-[#7857ff] hover:bg-[#6344d4] text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(120,87,255,0.3)] hover:shadow-[0_6px_20px_rgba(120,87,255,0.23)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Confirming...</span>
                        </>
                    ) : (
                        `Swap ${fromAmount} ${isSolToUsdc ? 'SOL' : 'USDC'}`
                    )}
                </button>
            )}
        </div>
    );
}
