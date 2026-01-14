# Tutorial: Gasless Transactions on Solana

Learn how to send transactions without requiring users to hold SOL for gas fees. This tutorial covers the Paymaster pattern and how Lazorkit enables true zero-balance onboarding.

## Table of Contents

1. [The Problem](#the-problem)
2. [The Solution: Paymasters](#the-solution-paymasters)
3. [Implementation Guide](#implementation-guide)
4. [Real-World Examples](#real-world-examples)
5. [Advanced Patterns](#advanced-patterns)
6. [Troubleshooting](#troubleshooting)

---

## The Problem

### Traditional Solana Onboarding

```
New User arrives at your dApp
→ Needs to create wallet (seed phrase hell)
→ Needs to buy SOL on an exchange
→ Needs to transfer SOL to wallet
→ Finally can use your app
➜ 95% of users drop off before this point
```

**User Friction:**

- Don't understand what SOL is
- Don't want to create exchange account
- Just wanted to try your app

**Developer Pain:**

- Can't onboard users without gas fees
- Can't airdrop SOL to thousands of users (expensive)
- Can't create "freemium" models like Web2

---

## The Solution: Paymasters

### What is a Paymaster?

A **Paymaster** is a service that sponsors transaction fees on behalf of users. Think of it like a "gas credit card"—you sign the transaction, but someone else pays the bill.

### How It Works

```
 ┌──────────┐
 │   User   │ (Has 0 SOL)
 └────┬─────┘
      │ 1. Sign transaction with passkey
      ▼
 ┌─────────────┐
 │ Lazorkit SDK │
 └────┬────────┘
      │ 2. Send UserOperation
      ▼
 ┌──────────────┐
 │  Paymaster   │ (Has lots of SOL)
 └────┬─────────┘
      │ 3. Wrap + Sign + Pay fees
      ▼
 ┌──────────────┐
 │ Solana Network│
 └──────────────┘
      4. Transaction succeeds with 0 SOL from user
```

**Key Benefit:** User can transact on Solana without owning any SOL.

---

## Implementation Guide

### Step 1: Verify Paymaster Configuration

Ensure your `LazorkitProviderWrapper.tsx` has the Paymaster configured:

```typescript
<LazorkitProvider
  rpcUrl="https://api.devnet.solana.com"
  portalUrl="https://portal.lazor.sh"
  paymasterConfig={{
    paymasterUrl: "https://kora.devnet.lazorkit.com", // ← This is the magic
  }}
>
  {children}
</LazorkitProvider>
```

**That's it.** Every transaction will now be gasless automatically.

### Step 2: Build a Normal Solana Transaction

You write transactions EXACTLY like regular Solana code:

```typescript
import { SystemProgram, PublicKey } from "@solana/web3.js";

const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: new PublicKey("RECIPIENT_ADDRESS"),
  lamports: 100_000, // 0.0001 SOL
});
```

**No special Paymaster syntax required.**

### Step 3: Send with `signAndSendTransaction`

```typescript
import { useWallet } from "@lazorkit/wallet";

const { signAndSendTransaction, smartWalletPubkey } = useWallet();

async function sendGasless() {
  const instruction = SystemProgram.transfer({
    fromPubkey: smartWalletPubkey!,
    toPubkey: new PublicKey("9UJp...UNG1"), // Recipient
    lamports: 100_000,
  });

  try {
    const signature = await signAndSendTransaction({
      instructions: [instruction],
    });

    console.log("Transaction succeeded:", signature);
    console.log("User paid: 0 SOL 🎉");
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}
```

**That's it.** The Paymaster automatically sponsors the fees.

---

## Real-World Examples

### Example 1: Send SOL Gaslessly

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { useState } from "react";

export function SendSOL() {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    if (!smartWalletPubkey) return;

    setStatus("Signing...");

    try {
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: new PublicKey(recipient),
        lamports: parseFloat(amount) * 1_000_000_000, // Convert SOL to lamports
      });

      const signature = await signAndSendTransaction({
        instructions: [instruction],
      });

      setStatus(`Success! Transaction: ${signature}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSend}>Send (Gasless)</button>
      {status && <p>{status}</p>}
    </div>
  );
}
```

### Example 2: Send USDC Gaslessly

```typescript
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useWallet } from "@lazorkit/wallet";
import { PublicKey } from "@solana/web3.js";

const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

export async function sendUSDC(recipientAddress: string, amount: number) {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();

  if (!smartWalletPubkey) throw new Error("Not connected");

  // Get token accounts
  const senderTokenAccount = await getAssociatedTokenAddress(
    USDC_MINT,
    smartWalletPubkey
  );

  const recipientTokenAccount = await getAssociatedTokenAddress(
    USDC_MINT,
    new PublicKey(recipientAddress)
  );

  // Create transfer instruction
  const instruction = createTransferInstruction(
    senderTokenAccount,
    recipientTokenAccount,
    smartWalletPubkey,
    amount * 1_000_000 // USDC has 6 decimals
  );

  // Send gaslessly
  const signature = await signAndSendTransaction({
    instructions: [instruction],
  });

  return signature;
}
```

**Key Point:** SPL token transfers are ALSO gasless. User doesn't need SOL.

### Example 3: Write to Memo Program (True Zero-Balance)

The Memo program is perfect for testing gasless transactions because it costs literally 0 SOL to execute:

```typescript
import { TransactionInstruction, PublicKey } from "@solana/web3.js";
import { useWallet } from "@lazorkit/wallet";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb"
);

export async function sendMemo(message: string) {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();

  if (!smartWalletPubkey) throw new Error("Not connected");

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: smartWalletPubkey,
        isSigner: true,
        isWritable: true,
      },
    ],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(message, "utf-8"),
  });

  const signature = await signAndSendTransaction({
    instructions: [instruction],
  });

  console.log("Memo written to blockchain:", signature);
  console.log("Cost to user: 0 SOL");

  return signature;
}
```

---

## Advanced Patterns

### Pattern 1: Pay Fees in USDC

Instead of the Paymaster paying fees, let users pay in USDC:

```typescript
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    feeToken: "USDC", // User pays ~$0.0001 in USDC instead of SOL
  },
});
```

**Use Case:** User has USDC but no SOL. They can still transact.

### Pattern 2: Batch Multiple Instructions

```typescript
const instructions = [
  SystemProgram.transfer({ ... }),
  createTransferInstruction({ ... }), // USDC transfer
  memoInstruction,
];

const signature = await signAndSendTransaction({
  instructions, // All executed in one gasless transaction
});
```

### Pattern 3: Set Compute Budget

For complex transactions, increase compute units:

```typescript
import { ComputeBudgetProgram } from "@solana/web3.js";

const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({
  units: 400_000, // Increase from default 200k
});

const signature = await signAndSendTransaction({
  instructions: [computeBudgetIx, ...yourInstructions],
});
```

---

## Troubleshooting

### Issue: "Transaction too large"

**Cause:** Transaction exceeds compute unit limit  
**Fix:**

- Reduce number of instructions
- Split into multiple transactions
- Increase compute budget (see Pattern 3)

### Issue: "TransactionTooOld" error

**Cause:** Devnet network congestion  
**Fix:** This is a Devnet issue, not your code. Simply retry the transaction.

### Issue: Paymaster "Insufficient Funds"

**Cause:** Paymaster wallet ran out of SOL  
**Fix:** This is rare on Devnet. Contact Lazorkit support or wait for refill.

### Issue: Transaction works on Devnet but fails on local validator

**Cause:** Paymaster is configured for Devnet only  
**Fix:** See FAQ in main README about local validator limitations.

---

## Verification

### How to Verify Fees Were Actually Paid by Paymaster

1. Send a gasless transaction
2. Copy the signature
3. Open Solana Explorer: `https://explorer.solana.com/tx/YOUR_SIGNATURE?cluster=devnet`
4. Look at "Fee Payer" field
5. **It should be a different address than your wallet**

**Example:**

```
Sender: YOUR_WALLET_ADDRESS
Fee Payer: PAYMASTER_WALLET_ADDRESS ← Different!
Fee: 0.000005 SOL (paid by Paymaster)
```

---

## Next Steps

Now that you can send gasless transactions:

1. **Learn about session persistence** → [TUTORIAL_PERSISTENCE.md](./TUTORIAL_PERSISTENCE.md)
2. **Explore balance watching** → Check `src/hooks/useBalanceWatcher.ts`

---

## Key Takeaways

- Paymasters sponsor transaction fees on behalf of users
- Zero configuration required - just use `signAndSendTransaction`
- Works for ALL Solana instructions (transfers, SPL tokens, custom programs)
- Users can transact with 0 SOL balance
- Fees can be paid in USDC instead of SOL
- Always verify the Fee Payer on Solana Explorer to confirm gasless worked
