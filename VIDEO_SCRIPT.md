# Lazorkit Solana Starter - Video Demo Script

**Target Length:** 2-3 Minutes
**Goal:** Demonstrate the seamless UX of Passkeys and Gasless transactions on Solana.

---

## Scene 1: Introduction

**Audio/Voiceover:**
"Hello guys, I'm here today to demo the Lazorkit Solana starter template. We all know building on Solana is fast, but onboarding users is still slow. The constant need for seed phrases, wallet extensions, and needing SOL for gas fees—these make a massive barrier or an inconvenience for new users and some veteran users as well.

Lazorkit solves this issue with Passkeys and Gasless Transactions. No need for seed phrases, or keeping some SOL for transaction fees. So let's dive in and see this operation in action."

---

## Scene 2: Passkey Authentication

**Action:**

1. Click the **"Connect Passkey"** button.
2. Show the **System Biometric Prompt** (FaceID / TouchID / Windows Hello).
3. Authenticate instantly.

**Audio/Voiceover:**
"First, to begin the login flow, all you have to do is click 'Connect Passkey' and authenticate with your biometric—FaceID, TouchID, or Windows Hello. And just like that, we're in.

It takes less than 2 seconds. Under the hood, this created a non-custodial Smart Wallet secured by my device's hardware enclave. No seed phrases to write down or lose."

---

## Scene 3: Gasless Transactions (SOL)

**Action:**

1. Navigate to **Send** tab.
2. Enter recipient and amount (0.01 SOL).
3. Click **"Send SOL"**.
4. Show success message and click **"View on Explorer"**.
5. Highlight **Fee Payer** (Paymaster) address.

**Audio/Voiceover:**
"Now, let me show you the real magic: Gasless Transactions.

I'll navigate to the Send tab here. I'm going to send a small amount of SOL—let's say 0.01 SOL—to this recipient address.

Notice the 'Gasless Patterns Active' badge? That means our Paymaster is sponsoring the transaction fee.

I'll click 'Send SOL'... and there we go—transaction confirmed!

Now here's the important part: let me click 'View on Explorer' to prove this is truly gasless.

As you can see on the Solana Explorer, the 'Fee Payer' is a different address from my wallet. That's the Lazorkit Paymaster covering the fee entirely. I paid zero SOL for this transaction. This means you can onboard users with literally zero balance—they can start using your app immediately."

---

## Scene 4: USDC Transfer

**Action:**

1. Switch asset to **USDC**.
2. Show real balance.
3. Initiate transfer.

**Audio/Voiceover:**
"This isn't just for SOL. Let me switch to USDC here.

This template uses real Circle Devnet USDC—not mocked data. I can send USDC the exact same way, and it's also gasless.

The starter detects incoming transfers for both SOL and USDC in real-time, which you can see in the activity log here."

---

## Scene 5: Session Persistence

**Action:**

1. Refresh the page.
2. Show wallet stays connected.
3. Click **"Disconnect"**.

**Audio/Voiceover:**
"One major friction point in Web3 is constant reconnection every time you refresh. Let me show you how this solves that.

I'm going to refresh the page right now... and as you can see, I'm still logged in. No need to reconnect, no passkey prompt—it just works, like a Web2 app.

But unlike Web2, this is completely non-custodial. My keys are still hardware-bound to my device.

When I'm done, I can click 'Disconnect' to securely wipe the session. Clean logout, just like that."

---

## Scene 6: Conclusion

**Visual:**

- Show GitHub Repo / README.

**Audio/Voiceover:**
"So that's the Lazorkit Solana Starter in action.

This template gives you everything you need: passkey authentication, gasless infrastructure, real USDC support, token swaps, and comprehensive documentation to help you build production-ready Solana apps.

It's fully open source and available on GitHub right now. Clone the repo, customize it for your project, and start building the future of Solana UX today.

Thanks for watching!"
