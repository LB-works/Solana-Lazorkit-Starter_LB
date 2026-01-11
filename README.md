# Lazorkit Solana Starter ⚡

A high-quality Next.js starter template for getting started with [Lazorkit](https://lazorkit.com) on Solana. This project demonstrates how to build a UX-first dApp with **Passkey Authentication** and **Gasless Transactions**.

## Features 🚀

- **Passkey Authentication**: Users login with FaceID/TouchID. No seed phrases.
- **Gasless Transfers**: Sponsored transactions where users pay 0 SOL (fees paid in USDC or by paymaster).
- **Embedded Wallet**: Powered by Lazorkit SDK.
- **Example Use Cases**:
  - 💸 **Gasless Transfer**: Send funds without holding SOL for gas.
  - 🛍️ **Pay with Solana**: A reusable e-commerce checkout widget.
  - 🔄 **Token Swap**: A mock interface demonstrating complex transaction signing.

## Tech Stack 🛠️

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Blockchain**: [Lazorkit SDK](https://docs.lazorkit.com), [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started 🏁

### 1. Clone & Install
```bash
git clone https://github.com/your-username/solana-lazorkit-starter.git
cd solana-lazorkit-starter
npm install
```

### 2. Configure Environment
This project is pre-configured for **Solana Devnet**.
You typically don't need to change anything to run the demo.
See `components/LazorkitProviderWrapper.tsx` for configuration.

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

## Troubleshooting 🔧

### "WebAuthn Not Supported" / TLS Errors
Passkeys **require HTTPS**. On `localhost`, you might see connection errors.
*   **Fix**: Deploy to Vercel/Netlify for a free HTTPS domain.
*   **Workaround**: Use Chrome's `localhost` flag or just ignore the error if testing UI only.

### "Insufficient Funds"
New smart wallets start with 0 SOL.
*   **Fix**: Use the built-in **"Request Airdrop"** button in the app header to get 1 Devnet SOL.

## Session Persistence 💾
This starter uses `@lazorkit/wallet` which automatically handles session persistence.
*   After a refresh, `useWallet()` checks mostly localStorage/indexedDB for an existing session.
*   The `useEffect` in `ConnectWallet.tsx` automatically reconnects the user if a session is found.

## Project Structure 📂

```
├── src/
│   ├── app/
│   │   ├── page.tsx            # Main landing page with all demos
│   │   ├── layout.tsx          # Root layout with LazorkitProvider
│   │   └── globals.css         # Global styles
│   └── components/
│       ├── ConnectWallet.tsx   # Passkey Login Button
│       ├── GaslessTransfer.tsx # Sponsored Transaction Form
│       ├── PayWithSolana.tsx   # E-commerce Widget
│       ├── TokenSwap.tsx       # Swap Interface
│       └── LazorkitProviderWrapper.tsx # SDK Initialization
├── tutorials/              # Step-by-step guides
│   ├── TUTORIAL_WALLET.md  # How to build the specific wallet connection
│   └── TUTORIAL_GASLESS.md # How to do gasless txs
```

## Tutorials 📚

Check out the [tutorials](./tutorials) folder for deep dives:
1. **[How to Create a Passkey Wallet](./tutorials/TUTORIAL_WALLET.md)** - Learn how the connection flow works.
2. **[How to Send Gasless Transactions](./tutorials/TUTORIAL_GASLESS.md)** - Learn about Paymasters and fee tokens.

## License
MIT
