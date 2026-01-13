# ⚡ Lazorkit Solana Starter (Next.js)

A high-performance, UX-first starter template for building Solana applications with [Lazorkit](https://lazorkit.com). Help your users skip the seed phrases and gas fees.

## 🏆 Why Choose This Template?

| Learning Pattern | This Template | Educational Value |
|------------------|---------------|----------------|-------------------|
| **Bidirectional Swaps** | ✅ Full implementation | ❌ Not included | Master dynamic transaction construction |
| **Activity Timeline** | ✅ Live event logging | Understand UserOperation lifecycle |
| **Feature Gating** | ✅ Subscription hook | ❌ Not included | Learn wallet-based access control |
| **Multi-Asset Send** | ✅ SOL + USDC | Master SPL token patterns |
| **Gasless Everywhere** | ✅ All transactions | True Web2 UX experience |

---

## 🏗️ Technical Architecture
We use a **hybrid security model** that combines hardware-level passkey signatures with non-custodial Smart Wallets.

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Lazorkit
    participant Paymaster
    participant Solana
    
    User->>Browser: Click Connect
    Browser->>Lazorkit: Request WebAuthn Signature
    Lazorkit-->>Browser: Biometric Prompt (FaceID/TouchID)
    User->>Browser: Authenticate
    Browser->>Lazorkit: Signed Challenge
    Lazorkit->>Solana: Deploy/Identify Smart Wallet
    Solana-->>User: Wallet Connected 🎉
    
    Note over User,Solana: Executing a Gasless Transaction
    
    User->>Lazorkit: Sign Transaction Request
    Lazorkit->>Paymaster: Send UserOp
    Paymaster->>Solana: Submit Tx + Sponsor Gas (SOL)
    Solana-->>User: Success (Fixed 0.00 SOL fee)
```

---

## 📚 Recommended Learning Path

**New to Lazorkit?** Follow this sequence to master passkey wallets and account abstraction:

### 1️⃣ Foundation: Passkey Authentication
**Start with:** `ConnectWallet.tsx`
- Learn how WebAuthn creates secure, password-less wallets.
- Understand the smart wallet creation and persistence flow.

### 2️⃣ Core Pattern: Gasless Multi-Asset Transfers
**Next:** `SendFund.tsx` → `ReceiveFund.tsx`
- Learn how paymasters sponsor transaction fees for both SOL and SPL tokens.
- Master the canonical "Send/Receive" patterns in Web3.

### 3️⃣ Observability: SDK Interaction Timeline
**Then:** `ActivityLogUI.tsx` + `useActivityLog.ts`
- Understand the background "magic" of UserOperations.
- Learn how to visualize SDK event lifecycles for better developer UX.

### 4️⃣ Advanced: Bidirectional Swaps
**Next:** `TokenSwap.tsx`
- Master complex transaction construction with bidirectional logic.
- Learn how to manage dynamic input/output state in production-ready dApps.

### 5️⃣ Real-World: Feature Gating
**Finally:** `useSubscription.ts`
- Learn how to gate features based on wallet state (Free vs Pro).
- Build the foundation for token-gated SaaS or premium Web3 content.

---

## 📊 TLazorkit UX
| Feature | Lazorkit (Passkey-First) |
| :--- | :--- |
| **Setup** | 2 seconds (Biometric Prompt) |
| **Gas Fees** | Sponsored or Fee-Tokens (USDC) |
| **Auth** | FaceID / TouchID |
| **Onboarding** | **< 30 Seconds** |
| **Security** | Seed phrase vulnerability | Hardware-bound (Secure Enclave) |
| **Device Support** | Desktop (Extension) / Mobile (App) | Native browser support everywhere |

---

## ❓ FAQ & Troubleshooting

### **Q: Do I need a browser extension to use this?**
No. Lazorkit uses the native **WebAuthn** capabilities of your browser. It works just like Logging in with Apple or Google but in a fully non-custodial way.

### **Q: What happens if I lose my phone?**
Passkeys are typically synced via **iCloud Keychain** or **Google Password Manager**. As long as you have access to your primary cloud account, your wallet remains accessible on your new device.

---

## 🚀 Quick Start (5 Minutes)

### 1. Clone & Install
```bash
git clone https://github.com/lazor-kit/lazor-kit-starter.git
cd lazor-kit-starter
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 🛠️ Expert Code Snippets

### A. Connection (ConnectWallet.tsx)
```tsx
const { connect } = useWallet();
await connect({ feeMode: "paymaster" });
```

### B. Gasless Execution (TokenSwap.tsx)
```tsx
const { signAndSendTransaction } = useWallet();

await signAndSendTransaction({
  instructions: [transferInstruction],
  transactionOptions: { feeToken: "USDC" } 
});
```

---

## 🔧 Troubleshooting

### **WebAuthn requires HTTPS**
Passkeys will only work on `localhost` or `HTTPS` domains.

### **Insufficient Paymaster Funds**
If gasless transactions fail on Devnet, try the **"Get SOL ↗"** button in the header.

---

## 📄 License
MIT
