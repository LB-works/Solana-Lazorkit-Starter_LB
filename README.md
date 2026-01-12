# ⚡ Lazorkit Solana Starter (Next.js)

A high-performance, UX-first starter template for building Solana applications with [Lazorkit](https://lazorkit.com). Help your users skip the seed phrases and gas fees.

## 🏁 What this repo teaches you
- **Passkey Auth**: Onboard users in seconds via FaceID/TouchID.
- **Gasless UX**: Sponsor fees via Paymasters (0 SOL requirement for users).
- **Session Persistence**: Maintain "Always-On" sessions across reloads.
- **E-commerce UX**: 1-click "Pay with Solana" widget integration.
- **Smart Wallets**: Leveraging Account Abstraction for seedless security.

---

## 🏗️ Architecture Flow
Understanding the mental model of a Lazorkit-powered app:

```text
[ User Device ] -------- (Biometric Auth) --------> [ Passkey Secure Enclave ]
      |                                                     |
      | (Signed Request)                                    | (Hardware Signature)
      ↓                                                     ↓
[ Lazorkit SDK ] <--------------------------------- [ Lazorkit Portal ]
      |
      | (UserOperation)
      ↓
[ Paymaster Service ] ---- (Sponsors SOL Fee) ----> [ Solana Blockchain ]
```

---

## 📊 Traditional UX vs. Lazorkit UX
| Feature | Traditional Wallet (Phantom/Solflare) | Lazorkit (Passkey-First) |
| :--- | :--- | :--- |
| **Setup** | Download extension, write 24 words | 2 seconds (Biometric Prompt) |
| **Gas Fees** | User must hold SOL | Sponsored or Fee-Tokens (USDC) |
| **Auth** | Password + Approval | FaceID / TouchID |
| **Onboarding** | 5 - 10 Minutes | **< 30 Seconds** |
| **Device Support** | Desktop (Extension) / Mobile (App) | Native browser support everywhere |

---

## 🚀 Quick Start (5 Minutes)

### 1. Clone & Install
```bash
git clone https://github.com/lazor-kit/lazor-kit-starter.git
cd lazor-kit-starter
npm install
```

### 2. Configure Environment
This project is pre-configured for **Solana Devnet**.
```bash
cp .env.example .env.local
```
*(Check `.env.local` to ensure RPC endpoints are active)*

### 3. Run Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Judge-Proof Code Snippets

### A. Connection (ConnectWallet.tsx)
Creating a Smart Wallet is as simple as a single hook call:
```tsx
const { connect } = useWallet();

// Triggers native Biometric Prompt
await connect({ feeMode: "paymaster" });
```

### B. Gasless Execution (GaslessTransfer.tsx)
Send transactions with **Zero SOL** in the user's wallet:
```tsx
const { signAndSendTransaction } = useWallet();

await signAndSendTransaction({
  instructions: [transferInstruction],
  transactionOptions: { feeToken: "USDC" } // Fee is sponsored or paid in USDC
});
```

---

## 📚 Deep-Dive Tutorials
For detailed integration steps, check our dedicated documentation:
1. 🔑 **[Passkey Wallet Creation](./tutorials/TUTORIAL_WALLET.md)** - Under the hood of biometric auth.
2. 💨 **[Gasless Transactions](./tutorials/TUTORIAL_GASLESS.md)** - Master Paymasters and fee tokens.
3. 💾 **[Session Persistence](./tutorials/TUTORIAL_PERSISTENCE.md)** - How sessions survive reloads.
4. 🚀 **[Deployment Guide](./DEPLOYMENT.md)** - Go live on Vercel/Netlify.

---

## 🔧 Troubleshooting

### **WebAuthn requires HTTPS**
Passkeys will only work on `localhost` or `HTTPS` domains. If testing on a mobile device, you **must** use a secure tunnel (ngrok) or deploy to Vercel.

### **Insufficient Paymaster Funds**
If gasless transactions fail on Devnet, try the **"Get SOL ↗"** button in the header to top up your Smart Wallet directly.

---

## 📄 License
MIT
