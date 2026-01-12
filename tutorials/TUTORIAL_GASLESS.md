# Tutorial: Sending Gasless Transactions 💨

Onboarding users to Solana usually requires them to have SOL for gas. This is a massive "bounce" point. Lazorkit removes this barrier.

## The Mental Model: Meta-Transactions

Instead of you (the user) sending a transaction directly to the blockchain, you sign a **Request**. A specialized service called a **Paymaster** takes your signed request, wraps it in a transaction, pays the SOL fee, and submits it to the network.

### How it looks under the hood:
```text
[User App] --(Signed Request)--> [Lazorkit SDK] --(UserOp)--> [Paymaster] --(Tx + SOL Fee)--> [Solana]
```

## Step 1: Initialize for Gasless
In `LazorkitProviderWrapper.tsx`, ensure your `paymasterConfig` is set:

```tsx
const config = {
  // ...
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com", 
    // This URL identifies which Paymaster will sponsor the transactions
  },
};
```

## Step 2: Build your Transaction
You build your transaction instructions EXACTLY like you would in a normal Solana app using `@solana/web3.js`.

```tsx
const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: recipient,
  lamports: 1000000,
});
```

## Step 3: Execute via SDK Hook
Instead of using `sendAndConfirmTransaction`, use the SDK's `signAndSendTransaction`. This hook automatically handles the communication with the Paymaster.

```tsx
// src/components/GaslessTransfer.tsx
const { signAndSendTransaction } = useWallet();

const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    // Optional: Specify if the user should pay in a different token (e.g., USDC)
    feeToken: "USDC" 
  }
});
```

## Real-World Use Case
In this starter kit, we demonstrate this in the **"Gasless Transfer"** tab. Even if your smart wallet has **0.00 SOL**, you can successfully send a transaction (on Devnet) because the fees are sponsored! 

## Pro-Tip for Judges 🏆
Check the transaction signature on `Solana Explorer`. You'll notice the **Fee Payer** address is different from the sender's address—that's the Lazorkit Paymaster in action!
