"use client";

import { useState, useEffect } from "react";

export function useMockUSDC() {
    const [balance, setBalance] = useState<number>(250.00);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize
    useEffect(() => {
        const stored = localStorage.getItem("lazorkit_mock_usdc");
        if (stored) {
            setBalance(parseFloat(stored));
        }
        setIsInitialized(true);
    }, []);

    // Persist
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("lazorkit_mock_usdc", balance.toString());
        }
    }, [balance, isInitialized]);

    const updateBalance = (amount: number, type: 'credit' | 'debit') => {
        setBalance(prev => {
            const newBal = type === 'credit' ? prev + amount : Math.max(0, prev - amount);
            return Number(newBal.toFixed(2));
        });
    };

    return { balance, updateBalance };
}
