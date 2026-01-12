"use client";

import { useActivityLog, LogEntry } from "../hooks/useActivityLog";
import { Clock, CheckCircle2, AlertCircle, Cpu, Zap, Trash2 } from "lucide-react";

/**
 * PATTERN: SDK Interaction Timeline (Observability)
 * 
 * 📚 What You'll Learn:
 * • How to visualize the background "magic" of Account Abstraction.
 * • How to provide transparent event feedback to users.
 */
export function ActivityLogUI() {
    const { logs, clearLogs } = useActivityLog();

    const getIcon = (type: LogEntry["type"]) => {
        switch (type) {
            case "SUCCESS": return <CheckCircle2 size={14} className="text-green-500" />;
            case "ERROR": return <AlertCircle size={14} className="text-red-500" />;
            case "SIGNING": return <Cpu size={14} className="text-blue-500" />;
            case "CONFIRMING": return <Zap size={14} className="text-yellow-500" />;
            default: return <Clock size={14} className="text-gray-400" />;
        }
    };

    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-gray-900 font-bold text-sm">Timeline Empty</p>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Start a transaction to see logs</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Live SDK Events</span>
                <button
                    onClick={clearLogs}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                >
                    <Trash2 size={12} />
                </button>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-hide">
                {logs.map((log) => (
                    <div
                        key={log.id}
                        className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex gap-3 items-start animate-in slide-in-from-right-4 duration-300"
                    >
                        <div className="mt-0.5 shrink-0">
                            {getIcon(log.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                                <span className={`text-[10px] font-black tracking-tight ${log.type === 'SUCCESS' ? 'text-green-700' :
                                    log.type === 'ERROR' ? 'text-red-700' : 'text-gray-600'
                                    }`}>
                                    {log.type}
                                </span>
                                <span className="text-[9px] text-gray-400 font-bold">
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-gray-900 text-xs font-bold leading-relaxed">{log.message}</p>
                            {log.data?.signature && (
                                <p className="text-[10px] text-gray-400 font-mono truncate opacity-60">
                                    tx: {log.data.signature}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
