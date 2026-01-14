# Lazorkit Solana Starter - Video Demo Script

**Target Length:** 2-3 Minutes
**Goal:** Demonstrate the seamless UX of Passkeys and Gasless transactions on Solana.

---

## Scene 1: Introduction & The Problem (0:00 - 0:30)

**Visual:**

- Start with the **Welcome Screen** of your app.
- Briefly show a standard "Connect Wallet" popup (like Phantom) as a comparison (optional, or just mention it).

**Audio/Voiceover:**
"Building on Solana is fast, but onboarding users is still slow. Seed phrases, browser extensions, and needing SOL for gas fees—it's a massive barrier (or 'bounce point') for new users.

Today, I'm showing you the **Lazorkit Solana Starter**, a production-ready template that solves this with **Biometric Passkeys** and **Gasless Transactions**. Let's dive in."

---

## Scene 2: Passkey Authentication (0:30 - 1:00)

**Action:**

1. Click the **"Connect with Passkey"** button.
2. Show the **System Biometric Prompt** (FaceID / TouchID / Windows Hello) popping up.
3. Authenticate instantly.
4. Show the **Connected Dashboard** appearing immediately.

**Audio/Voiceover:**
"First, watch the login flow. No extension required. I click 'Connect', use my FaceID, and... I'm in.

It takes less than 2 seconds. Under the hood, this created a non-custodial **Smart Wallet** secured by my device's hardware enclave. No seed phrases to lose."

---

## Scene 3: Gasless Transactions (SOL) (1:00 - 1:30)

**Action:**

1. Go to the **"Send"** tab.
2. Enter a recipient address.
3. Enter a small amount (e.g., 0.01 SOL).
4. Point out the "Gasless Patterns Active" badge or mention the fee is 0.
5. Click **"Send"**.
6. Wait for the success message.
7. **Crucial:** Click the "View on Explorer" link. Show that the **Fee Payer** is a different address (the Paymaster).

**Audio/Voiceover:**
"Now for the magic: Gasless Transactions. Usually, a user needs SOL to pay for gas. But here, our **Paymaster** sponsors the fee.

I'm sending SOL... and it's confirmed. If we check the explorer, you can see I paid **zero** fees. The Lazorkit Paymaster covered it entirely. This means you can onboard users with literally zero balance."

---

## Scene 4: Multi-Asset Support (USDC) (1:30 - 2:00)

**Action:**

1. Toggle the asset selector to **USDC**.
2. Show that the balance is real (Circle Devnet USDC), not mocked.
3. Initiate a transfer.

**Audio/Voiceover:**
"This isn't just for SOL. We've integrated full support for SPL tokens like **USDC**.

This template uses the real Circle Devnet USDC mint, so you can build robust payment flows immediately. It detects incoming transfers for both assets in real-time."

---

## Scene 5: Session Persistence & Architecture (2:00 - 2:30)

**Action:**

1. **Refresh the page**.
2. Show that the wallet **stays connected** instantly.
3. Click **"Disconnect"**.
4. Show the return to the landing page.

**Audio/Voiceover:**
"One major friction point in Web3 is constant re-connection. We've implemented robust **Session Persistence**.

If I refresh the page, I stay logged in—just like a Web2 app. But unlike Web2, it's non-custodial. When I'm done, a clean 'Disconnect' wipes the session keys for security."

---

## Scene 6: Conclusion (2:30 - Finish)

**Visual:**

- Show the GitHub Repository README.
- Scroll through the features list or screenshots.

**Audio/Voiceover:**
"This starter kit comes with everything you need: Authentication, Gasless infrastructure, Token Swaps, and comprehensive documentation to help you win your next hackathon.

It's open source and available now. Clone the repo and start building the future of Solana UX today."

---

## Production Tips:

- **Resolution:** Record in **1080p** or higher.
- **Clean Environment:** Close other browser tabs and irrelevant windows.
- **Zoom:** Zoom in slightly (110-125%) in your browser so text is readable on mobile devices.
- **Mouse:** Move your mouse smoothly; avoid jittery movements.
- **Audio:** If you can't record voiceover, use a high-quality AI voiceover tool (like ElevenLabs) or add clear, concise subtitles.
