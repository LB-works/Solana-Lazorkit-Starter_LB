# Tutorial: Session Persistence & Wallet Recovery

Learn how Lazorkit maintains user sessions across page refreshes and enables multi-device access without seed phrases.

## Table of Contents

1. [The Problem with Traditional Wallets](#the-problem-with-traditional-wallets)
2. [How Lazorkit Session Persistence Works](#how-lazorkit-session-persistence-works)
3. [Implementation Guide](#implementation-guide)
4. [Multi-Device Sync](#multi-device-sync)
5. [Advanced Patterns](#advanced-patterns)
6. [Troubleshooting](#troubleshooting)

---

## The Problem with Traditional Wallets

### Traditional Wallet Experience

```
User visits your dApp
→ Click "Connect Wallet"
→ Approve connection in extension
→ Use app
→ REFRESH PAGE
→ Disconnected! Must connect again!
→ Approve connection AGAIN
→ User frustrated, leaves
```

**Key Pain Points:**

- Users must reconnect on every page refresh
- Extension popup interrupts workflow
- Poor mobile experience
- No session continuity

---

## How Lazorkit Session Persistence Works

### The Lazorkit Experience

```
User visits your dApp
→ Click "Connect with Passkey"
→ FaceID/TouchID once
→ Use app
→ REFRESH PAGE
→ Still connected!
→ Close browser, come back tomorrow
→ Still connected!
```

### Technical Architecture

```
┌─────────────────────────────────────────┐
│  First Connection                        │
├─────────────────────────────────────────┤
│  1. User authenticates with biometric    │
│  2. Lazorkit SDK generates Smart Wallet  │
│  3. Session token saved to browser       │
│  4. Wallet address stored in localStorage│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Page Refresh                            │
├─────────────────────────────────────────┤
│  1. SDK checks browser storage           │
│  2. Finds valid session token            │
│  3. Restores connection automatically   │
│  4. No user action needed!               │
└─────────────────────────────────────────┘
```

**Security:** The passkey itself is NOT stored—only the session token. Passkey remains hardware-bound.

---

## Implementation Guide

### Step 1: Session Recovery is Automatic

The Lazorkit SDK handles session persistence **automatically**. No extra code required:

```typescript
import { useWallet } from "@lazorkit/wallet";

export function App() {
  const { isConnected, smartWalletPubkey } = useWallet();

  // On page load, isConnected will automatically become true
  // if a valid session exists!

  return (
    <div>
      {isConnected ? (
        <p>Welcome back! {smartWalletPubkey?.toBase58()}</p>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
```

### Step 2: Detect Automatic Reconnection

Use a `useEffect` to detect when the SDK automatically restores a session:

```typescript
import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";

export function Dashboard() {
  const { isConnected, smartWalletPubkey } = useWallet();
  const [isReconnecting, setIsReconnecting] = useState(true);

  useEffect(() => {
    // Give SDK 1 second to check for existing session
    const timer = setTimeout(() => {
      setIsReconnecting(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isConnected && smartWalletPubkey) {
      console.log("Session restored for:", smartWalletPubkey.toBase58());
      // Fetch user data, balances, etc.
    }
  }, [isConnected, smartWalletPubkey]);

  if (isReconnecting) {
    return <div>Checking for existing session...</div>;
  }

  if (!isConnected) {
    return <ConnectButton />;
  }

  return <div>Welcome back!</div>;
}
```

### Step 3: Implement Clean Disconnect

Ensure the disconnect button clears ALL session data:

```typescript
export function DisconnectButton() {
  const { disconnect } = useWallet();

  const handleDisconnect = async () => {
    await disconnect();

    // Optional: Clear any app-specific localStorage data
    localStorage.removeItem("user_preferences");
    localStorage.removeItem("lazorkit_usdc_balance");

    // Optional: Force page reload for clean slate
    window.location.reload();
  };

  return <button onClick={handleDisconnect}>Disconnect Wallet</button>;
}
```

---

## Multi-Device Sync

### How Multi-Device Access Works

Passkeys can sync across devices via cloud services:

| Platform           | Sync Service            | How It Works                         |
| ------------------ | ----------------------- | ------------------------------------ |
| **iOS/macOS**      | iCloud Keychain         | Automatic sync across Apple devices  |
| **Android/Chrome** | Google Password Manager | Automatic sync across Google devices |
| **Windows**        | Windows Hello           | Device-specific (no cloud sync)      |

### Scenario 1: Same Ecosystem

**User creates wallet on MacBook:**

1. Uses FaceID to create passkey
2. Passkey synced to iCloud Keychain
3. Opens dApp on iPhone
4. Clicks "Connect with Passkey"
5. **Same wallet address appears!** (synced via iCloud)

**Key Point:** Same passkey = same wallet address (deterministic)

### Scenario 2: Cross-Ecosystem

**User created wallet on iPhone, now using Windows laptop:**

❌ **Won't work automatically** - iCloud Keychain doesn't sync to Windows

✅ **Solution: Wallet Recovery**

Lazorkit provides recovery options for cross-platform access. See the [official docs](https://docs.lazorkit.com) for recovery patterns.

---

## Advanced Patterns

### Pattern 1: Welcome Back Message

```typescript
export function WelcomeMessage() {
  const { isConnected, smartWalletPubkey } = useWallet();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isConnected && smartWalletPubkey) {
      const lastSeen = localStorage.getItem("last_visit");
      const now = Date.now();

      if (lastSeen && now - parseInt(lastSeen) > 3600000) {
        // User was gone for >1 hour
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 3000);
      }

      localStorage.setItem("last_visit", now.toString());
    }
  }, [isConnected, smartWalletPubkey]);

  if (!showWelcome) return null;

  return (
    <div className="welcome-banner">
      Welcome back! Your session was automatically restored.
    </div>
  );
}
```

### Pattern 2: Balance Persistence

Store balances in localStorage for instant display on reconnect:

```typescript
import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export function useSOLBalance() {
  const { smartWalletPubkey } = useWallet();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!smartWalletPubkey) return;

    const storageKey = `sol_balance_${smartWalletPubkey.toBase58()}`;

    // Instantly show cached balance
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      setBalance(parseFloat(cached));
    }

    // Then fetch fresh balance
    const connection = new Connection("https://api.devnet.solana.com");

    connection.getBalance(smartWalletPubkey).then((lamports) => {
      const sol = lamports / LAMPORTS_PER_SOL;
      setBalance(sol);
      localStorage.setItem(storageKey, sol.toString());
    });
  }, [smartWalletPubkey]);

  return balance;
}
```

**Why this matters:** User sees their balance INSTANTLY on page load, before RPC fetch completes.

### Pattern 3: Activity Log Persistence

Maintain transaction history across sessions:

```typescript
interface Transaction {
  signature: string;
  type: "send" | "receive";
  amount: number;
  timestamp: number;
}

export function useTransactionHistory() {
  const { smartWalletPubkey } = useWallet();
  const [history, setHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!smartWalletPubkey) return;

    const storageKey = `tx_history_${smartWalletPubkey.toBase58()}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, [smartWalletPubkey]);

  const addTransaction = (tx: Transaction) => {
    const updated = [tx, ...history].slice(0, 50); // Keep last 50
    setHistory(updated);

    if (smartWalletPubkey) {
      const storageKey = `tx_history_${smartWalletPubkey.toBase58()}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  return { history, addTransaction };
}
```

---

## Troubleshooting

### Issue: Session doesn't persist after page refresh

**Possible Causes:**

1. Browser is in Private/Incognito mode
2. Browser is clearing cookies/localStorage on exit
3. User manually cleared browser data

**Fix:**

- Check `localStorage` in DevTools → Application tab
- Look for keys like `lazorkit_session`
- Ensure browser allows localStorage

### Issue: Session expires unexpectedly

**Cause:** Session timeout (default: 30 days)  
**Fix:** This is a security feature. User must reconnect after 30 days of inactivity.

### Issue: Different wallet appears on reconnect

**Cause:** User has multiple passkeys registered  
**Fix:**

- Provide a "Switch Account" option
- Let user choose which passkey to use
- Consider implementing account labeling

### Issue: Lost access after device loss

**Cause:** Passkey not synced to cloud  
**Fix:**

- **Prevention:** Encourage cloud sync during onboarding
- **Recovery:** Implement backup recovery methods (see Lazorkit docs)

---

## Security Considerations

### What's Stored in localStorage?

✅ **Safe to store:**

- Wallet address (public key)
- Session token (encrypted)
- User preferences
- Cached balances (for UX)

❌ **NEVER store:**

- Private keys (handled by passkey)
- Seed phrases (not needed!)
- Sensitive user data

### Session Timeout

Sessions automatically expire after **30 days** of inactivity for security.

### Logout on Shared Devices

For public/shared computers, always provide a clear Disconnect option:

```typescript
<button
  onClick={() => {
    disconnect();
    localStorage.clear(); // Clear everything
    window.location.href = "/";
  }}
  className="text-red-600"
>
  Logout & Clear Data
</button>
```

---

## Testing Session Persistence

### Test Checklist

1. **Basic Persistence**

   - [ ] Connect wallet
   - [ ] Refresh page
   - [ ] Verify still connected

2. **Balance Persistence**

   - [ ] Check balance
   - [ ] Refresh page
   - [ ] Balance appears instantly (from cache)

3. **Disconnect Cleanup**

   - [ ] Click Disconnect
   - [ ] Refresh page
   - [ ] Verify NOT reconnected

4. **Multi-Tab Behavior**
   - [ ] Connect in Tab 1
   - [ ] Open Tab 2
   - [ ] Verify connected in both tabs

---

## Next Steps

You now understand session persistence! Continue learning:

1. **Build a complete app** → Combine wallet connection, gasless transactions, and persistence
2. **Explore balance watching** → Check `src/hooks/useBalanceWatcher.ts` for real-time updates

---

## Key Takeaways

- Session persistence is **automatic** with Lazorkit SDK
- Passkeys sync across devices via iCloud/Google Password Manager
- Store wallet-specific data with keys like `data_${walletAddress}`
- Always provide a clear Disconnect option
- Use cached data for instant UI updates on page load
- Sessions expire after 30 days for security
- Never store private keys—passkeys handle that in hardware
