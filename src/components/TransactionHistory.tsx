import { ExternalLink, XCircle, CheckCircle } from "lucide-react";

export type TransactionRecord = {
    id: string;
    type: "Swap" | "Pay" | "Send" | "Receive" | "Sub";
    amount: string; // e.g., "0.01 SOL" or "0.0001 USDC"
    status: "success" | "error";
    signature?: string;
    timestamp: number;
    description?: string; // Optional detailed description
};

export function TransactionHistory({ transactions }: { transactions: TransactionRecord[] }) {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <ExternalLink size={20} className="text-gray-300" />
                </div>
                <h4 className="text-gray-900 font-bold mb-1">No transactions yet</h4>
                <p className="text-gray-400 text-xs">Your successful swaps and payments will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 animate-in fade-in max-h-[380px] overflow-y-auto pr-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            {transactions.map((tx) => (
                <div key={tx.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                            {tx.status === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-gray-900 font-bold text-sm leading-tight">{tx.type}</h4>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${tx.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {tx.status === 'success' ? 'Success' : 'Failed'}
                                </span>
                            </div>
                            <p className="text-gray-500 text-xs font-medium mt-0.5">{tx.amount}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <span className="text-gray-400 text-[10px] font-medium">
                            {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {tx.status === 'success' && tx.signature ? (
                            <a
                                href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-xs font-bold text-[#7857ff] hover:underline"
                            >
                                Explorer <ExternalLink size={10} />
                            </a>
                        ) : (
                            <span className="text-gray-400 text-[10px] italic">No signature</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
