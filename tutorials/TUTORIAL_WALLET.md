# Tutorial: Passkey-Based Wallet Integration

Learn how to replace traditional wallet connections with biometric authentication using Lazorkit. No browser extensions, no seed phrases—just FaceID, TouchID, or Windows Hello.

## Table of Contents

1. [Why Passkeys?](#why-passkeys)
2. [Architecture Overview](#architecture-overview)
3. [Implementation Steps](#implementation-steps)
4. [Advanced Patterns](#advanced-patterns)
5. [Troubleshooting](#troubleshooting)

---

## Why Passkeys?

### Traditional Wallet Flow (Bad UX)

```
User clicks "Connect"
→ Select wallet extension (15+ options)
→ Extension popup opens
→ Approve connection
→ Approve network switch
→ finally connected (30-60 seconds)
```

### Passkey Flow (10x Better)

```
User clicks "Connect with Passkey"
→ FaceID/TouchID prompt
→ Connected (2 seconds)
```

### Security Benefits

| Feature            | Traditional Wallets    | Passkey Wallets             |
| ------------------ | ---------------------- | --------------------------- |
| **Seed Phrase**    | Required (12-24 words) | Not needed                  |
| **Attack Surface** | Phishing, clipboard    | Hardware-bound              |
| **Device Loss**    | Manual recovery        | Cloud sync (iCloud, Google) |
| **Multi-device**   | Manual import          | Automatic sync              |

---

## Architecture Overview

### How Passkeys Create Wallets

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │ 1. Click "Connect"
       ▼
┌─────────────────────┐
│  Lazorkit SDK       │
│  @lazorkit/wallet   │
└──────┬──────────────┘
       │ 2. Request WebAuthn
       ▼
┌─────────────────────┐
│  System Biometric   │
│  (FaceID/TouchID)   │
└──────┬──────────────┘
       │ 3. Generate keypair
       ▼
┌─────────────────────┐
│  Smart Wallet (PDA) │
│  Account Abstraction│
└─────────────────────┘
```

**Key Concept:** The passkey controls a **Smart Wallet (PDA)**, not a regular Solana keypair. This enables gasless transactions and account recovery.

---

## Implementation Steps

### Step 1: Install Dependencies

```bash
npm install @lazorkit/wallet @solana/web3.js
```

### Step 2: Create the Provider Wrapper

Create `src/components/LazorkitProviderWrapper.tsx`:

```typescript
"use client";

import { LazorkitProvider } from "@lazorkit/wallet";
import { ReactNode } from "react";

export function LazorkitProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <LazorkitProvider
      rpcUrl="https://api.devnet.solana.com"
      portalUrl="https://portal.lazor.sh"
      paymasterConfig={{
        paymasterUrl: "https://kora.devnet.lazorkit.com",
      }}
    >
      {children}
    </LazorkitProvider>
  );
}
```

**What each URL does:**

- `rpcUrl`: Solana network endpoint (Devnet for testing)
- `portalUrl`: Lazorkit's WebAuthn authentication service
- `paymasterUrl`: Service that sponsors gas fees

### Step 3: Wrap Your App

In `src/app/layout.tsx`:

```typescript
import { LazorkitProviderWrapper } from "@/components/LazorkitProviderWrapper";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LazorkitProviderWrapper>{children}</LazorkitProviderWrapper>
      </body>
    </html>
  );
}
```

### Step 4: Build the Connect Component

Create `src/components/ConnectWallet.tsx`:

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";

export function ConnectWallet() {
  const { connect, disconnect, isConnected, smartWalletPubkey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connect();
    } catch (error) {
      console.error("Connection failed:", error);
      // User likely cancelled the passkey prompt
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected && smartWalletPubkey) {
    return (
      <div className="flex items-center gap-4">
        <span className="font-mono text-sm">
          {smartWalletPubkey.toBase58().slice(0, 4)}...
          {smartWalletPubkey.toBase58().slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="px-6 py-3 bg-purple-600 text-white rounded-lg"
    >
      {isLoading ? "Connecting..." : "Connect with Passkey"}
    </button>
  );
}
```

### Step 5: Use in Your App

```typescript
import { ConnectWallet } from "@/components/ConnectWallet";

export default function Home() {
  return (
    <div>
      <h1>My Solana App</h1>
      <ConnectWallet />
    </div>
  );
}
```

---

## Advanced Patterns

### Pattern 1: Balance Display

```typescript
import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export function WalletBalance() {
  const { smartWalletPubkey, isConnected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!isConnected || !smartWalletPubkey) return;

    const connection = new Connection("https://api.devnet.solana.com");

    const fetchBalance = async () => {
      const bal = await connection.getBalance(smartWalletPubkey);
      setBalance(bal / LAMPORTS_PER_SOL);
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);

    return () => clearInterval(interval);
  }, [smartWalletPubkey, isConnected]);

  if (!isConnected) return null;

  return (
    <div>
      Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
    </div>
  );
}
```

### Pattern 2: Conditional Rendering

```typescript
export function App() {
  const { isConnected } = useWallet();

  return <div>{!isConnected ? <Landing /> : <Dashboard />}</div>;
}
```

### Pattern 3: Protected Routes

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ProtectedPage() {
  const { isConnected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  if (!isConnected) return null;

  return <div>Protected Content</div>;
}
```

---

## Troubleshooting

### Issue: Passkey prompt doesn't appear

**Cause:** Browser doesn't support WebAuthn or running on HTTP  
**Fix:**

- Use Chrome, Safari, or Edge (not Firefox on Linux)
- Ensure you're on `localhost` or `HTTPS`
- Check browser console for errors

### Issue: "User cancelled" error

**Cause:** User dismissed the biometric prompt  
**Fix:** This is expected behavior. Show a friendly message encouraging retry.

### Issue: Connection works on desktop but not mobile

**Cause:** Mobile browser doesn't support WebAuthn  
**Fix:** Use Safari on iOS or Chrome on Android (latest versions)

### Issue: Lost passkey access

**Cause:** Device reset without cloud sync enabled  
**Fix:**

- Enable iCloud Keychain (iOS/Mac)
- Enable Google Password Manager (Android/Chrome)
- Passkeys sync automatically across devices

---

## Next Steps

Now that you have wallet connection working:

1. **Send a transaction** → Read [TUTORIAL_GASLESS.md](./TUTORIAL_GASLESS.md)
2. **Maintain sessions** → Read [TUTORIAL_PERSISTENCE.md](./TUTORIAL_PERSISTENCE.md)

---

## Key Takeaways

- Passkeys replace seed phrases with biometric authentication
- The `useWallet()` hook provides connection status and wallet address
- Smart Wallets (PDAs) enable gasless transactions and account recovery
- Always wrap your app with `LazorkitProvider` at the root
- Handle connection errors gracefully for better UX
