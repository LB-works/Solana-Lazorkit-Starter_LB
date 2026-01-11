# Tutorial: Triggering a Gasless Transaction

Users interacting with blockchain usually need SOL to pay for gas. This is a huge friction point. Lazorkit allows you to sponsor these fees or let users pay in other tokens (like USDC).

## The Concept
Instead of a regular transaction, we send a **UserOperation** (or meta-transaction) to a **Paymaster**. The Paymaster pays the SOL gas fee, and in return, it can either:
1. **Sponsor it** completely (Free for user).
2. **Charge the user** in a token (e.g., take 1 USDC from the user).

## Implementation

We use the `signAndSendTransaction` method from `useWallet`, but we pass special options.

**File:** `components/GaslessTransfer.tsx`

```typescript
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey } from "@solana/web3.js";

export function GaslessTransfer() {
  // 1. Get the wallet interface
  // use `smartWalletPubkey` instead of `publicKey`
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();

  const sendFreeMoney = async () => {
    // 2. Create a standard Solana Instruction
    // This is the action we want to perform (e.g., Send 0.1 SOL)
    const instruction = SystemProgram.transfer({
      fromPubkey: smartWalletPubkey,
      toPubkey: new PublicKey("RECIPIENT_ADDRESS..."),
      lamports: 100000000, // 0.1 SOL
    });

    // 3. Send it with Fee Configuration
    const signature = await signAndSendTransaction({
      instructions: [instruction],
      transactionOptions: {
        // This magic line tells Lazorkit to use the USDC Paymaster
        feeToken: "USDC" 
      }
    });

    console.log("Transaction Sent:", signature);
  };

  return (
    <button onClick={sendFreeMoney}>
        Send Gasless (Pay 0 SOL)
    </button>
  );
}
```

## Troubleshooting

### Transaction Fails?
*   **Check Paymaster**: Ensure your `paymasterUrl` in `LazorkitProviderWrapper` is correct.
*   **Check Balance**: Even though you pay gas in USDC, you (or the paymaster) need funds. On Devnet, the Lazorkit Paymaster usually sponsors valid transactions.
*   **Localhost**: Ensure you are not getting the TLS error (see README).

## Key Takeaways
- You write code like a normal Solana app (creating instructions).
- You just change **how** you send it (`transactionOptions`).
- The user sees a "Sign" prompt, but they don't need SOL in their wallet to pay for the network fee.
