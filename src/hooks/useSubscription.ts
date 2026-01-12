"use client";

import { useState, useEffect } from "react";

/**
 * PATTERN: Feature Gating Pattern (Wallet-based)
 * 
 * 📚 What You'll Learn:
 * • How to gate application features based on on-chain or off-chain state.
 * • How to manage "Pro" vs "Free" experiences in a Web3 SaaS environment.
 * 
 * ⚠️ Production Notes:
 * • In production, you would check a specific Program Account or NFT ownership.
 * • This mock shows the UI state management logic.
 */
export function useSubscription() {
    const [isPro, setIsPro] = useState<boolean>(false);

    useEffect(() => {
        const proStatus = localStorage.getItem("lazorkit_pro_status");
        setIsPro(proStatus === "true");
    }, []);

    const togglePro = () => {
        const nextStatus = !isPro;
        setIsPro(nextStatus);
        localStorage.setItem("lazorkit_pro_status", String(nextStatus));
    };

    return { isPro, togglePro };
}
