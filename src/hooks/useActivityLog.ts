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
    const [isInitialized, setIsInitialized] = useState(false);

    const loadLogs = () => {
        const storedLogs = localStorage.getItem("lazorkit_activity_logs");
        if (storedLogs) {
            try {
                setLogs(JSON.parse(storedLogs));
            } catch (e) {
                console.error("Failed to parse logs", e);
            }
        }
    };

    // Initialize & Listen for Updates
    useEffect(() => {
        loadLogs();
        setIsInitialized(true);

        const handleStorageChange = () => loadLogs();
        window.addEventListener("activity-log-updated", handleStorageChange);
        window.addEventListener("storage", handleStorageChange); // Cross-tab support

        return () => {
            window.removeEventListener("activity-log-updated", handleStorageChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const addLog = (type: LogEntry["type"], message: string, data?: any) => {
        // Read fresh logs directly from storage to avoid closure staleness
        const currentLogs: LogEntry[] = JSON.parse(localStorage.getItem("lazorkit_activity_logs") || "[]");

        const newLog: LogEntry = {
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            type,
            message,
            data
        };

        const updatedLogs = [newLog, ...currentLogs].slice(0, 50);
        localStorage.setItem("lazorkit_activity_logs", JSON.stringify(updatedLogs));

        // Update local state and notify others
        setLogs(updatedLogs);
        window.dispatchEvent(new Event("activity-log-updated"));
    };

    const clearLogs = () => {
        setLogs([]);
        localStorage.removeItem("lazorkit_activity_logs");
        window.dispatchEvent(new Event("activity-log-updated"));
    };

    return { logs, addLog, clearLogs };
}
