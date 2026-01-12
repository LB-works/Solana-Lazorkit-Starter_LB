"use client";

import { LazorkitProvider } from "@lazorkit/wallet";
import { ReactNode, useEffect, useState } from "react";
import { Buffer } from "buffer";

// Polyfill Buffer for Solana libraries
if (typeof window !== "undefined" && !window.Buffer) {
    window.Buffer = Buffer;
}

const config = {
    rpcUrl: "https://api.devnet.solana.com",
    portalUrl: "https://portal.lazor.sh",
    paymasterConfig: {
        paymasterUrl: "https://kora.devnet.lazorkit.com",
    },
};

/**
 * LazorkitProviderWrapper
 * 
 * The root configuration for the Lazorkit SDK.
 * Critical Setup:
 * 1. Paymaster API: Enables gasless transactions for all child components.
 * 2. Network Selection: Pre-configured for Solana Devnet.
 * 3. RPC Endpoints: Uses a high-performance Devnet RPC for reliable UX.
 */
export function LazorkitProviderWrapper({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const originalError = console.error;
        console.error = (...args) => {
            // Check all arguments for suppressed keywords
            const shouldSuppress = args.some(arg => {
                const str = typeof arg === "string" ? arg : arg?.message || JSON.stringify(arg);
                return (
                    str.includes("timed out") ||
                    str.includes("not allowed") ||
                    str.includes("Signing failed") ||
                    str.includes("webauthn") ||
                    str.includes("NotAllowedError") ||
                    str.includes("User cancelled") ||
                    str.includes("429") ||
                    str.includes("airdrop limit")
                );
            });

            if (shouldSuppress) return;

            originalError.apply(console, args);
        };

        return () => {
            console.error = originalError;
        };
    }, []);

    if (!mounted) return null;

    return (
        <LazorkitProvider
            rpcUrl={config.rpcUrl}
            portalUrl={config.portalUrl}
            paymasterConfig={config.paymasterConfig}
        >
            {children}
        </LazorkitProvider>
    );
}
