"use client";

import { useState, useEffect } from "react";

export interface LogEntry {
    id: string;
    timestamp: number;
    type: "INFO" | "SUCCESS" | "ERROR" | "SIGNING" | "CONFIRMING";
    message: string;
    data?: any;
}

/**
 * PATTERN: SDK Interaction Timeline (Observability)
 * 
 * 📚 What You'll Learn:
 * • How to observe and debug the lifecycle of Account Abstraction events.
 * • How to implement persistent logging for better developer/user experience.
 * • How to track background status changes in local state.
 */
export function useActivityLog() {
    const [logs, setLogs] = useState<LogEntry[]>([]);

    // Initialize from localStorage
    useEffect(() => {
        const storedLogs = localStorage.getItem("lazorkit_activity_logs");
        if (storedLogs) {
            try {
                setLogs(JSON.parse(storedLogs));
            } catch (e) {
                console.error("Failed to parse logs", e);
            }
        }
    }, []);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem("lazorkit_activity_logs", JSON.stringify(logs));
    }, [logs]);

    const addLog = (type: LogEntry["type"], message: string, data?: any) => {
        const newLog: LogEntry = {
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            type,
            message,
            data
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
    };

    const clearLogs = () => {
        setLogs([]);
        localStorage.removeItem("lazorkit_activity_logs");
    };

    return { logs, addLog, clearLogs };
}
