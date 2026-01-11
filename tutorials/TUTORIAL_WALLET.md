# Tutorial: Building a Passkey Request (Connect Wallet)

In this tutorial, we'll learn how to integrate **Passkey Authentication** content into your Solana dApp using Lazorkit. This replaces the traditional "Connect Wallet" -> "Select Phantom" -> "Approve" flow with a simple FaceID/TouchID prompt.

## Prerequisites
- A Next.js app set up (like this starter).
- `@lazorkit/wallet` installed.

## Step 1: Configure the Environment

Lazorkit requires a few configuration values to connect to the right capabilities (like the Paymaster).
Create a `.env.local` file (or use the provided `.env.example`):

```bash
NEXT_PUBLIC_LAZORKIT_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

## Step 2: Initialize the Provider

We need to wrap our application with the `LazorkitProvider`. This handles the global state for the passkey session.

**File:** `src/components/LazorkitProviderWrapper.tsx`

```typescript
"use client";
import { LazorkitProvider } from "@lazorkit/wallet";
import { ReactNode } from "react";

// Configuration for Devnet
const config = {
  rpcUrl: process.env.NEXT_PUBLIC_LAZORKIT_RPC_ENDPOINT!,
  portalUrl: "https://portal.lazor.sh", // The centralized UI that handles the secure passkey enclave
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com", // The service that pays the gas fees
  },
};

export function LazorkitProviderWrapper({ children }: { children: ReactNode }) {
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
```

## Step 2: Use the Hook

The `useWallet()` hook gives you everything you need: connection status, public key, and methods to sign.

**File:** `components/ConnectWallet.tsx`

```typescript
import { useWallet } from "@lazorkit/wallet";

export function ConnectWallet() {
  const { connect, disconnect, isConnected, smartWalletPubkey } = useWallet();

  if (isConnected) {
    return (
      <button onClick={disconnect}>
        Disconnect {smartWalletPubkey.toBase58()}
      </button>
    );
  }

  return (
    <button onClick={() => connect()}>
      Connect with Passkey 🔑
    </button>
  );
}
```

## How it Works
1. When `connect()` is called, the Lazorkit SDK opens a popup/iframe pointing to `portalUrl`.
2. The user is prompted by their device (iOS/Android/Windows Hello) to authenticate.
3. A secure keypair is generated (or retrieved) related to that passkey.
4. The SDK returns the `publicKey` to your app. Since it's a Smart Wallet (Account Abstraction), this key can be controlled by the passkey.

That's it! You now have a wallet connection without a seed phrase.
