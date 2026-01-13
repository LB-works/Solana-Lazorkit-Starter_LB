# Tutorial: Understanding Session Persistence

One of the biggest friction points in Web3 is the "re-login" dance. Lazorkit solves this by treating the browser as a secure, persistent gateway to the user's Smart Wallet.

## How it Works

The Lazorkit SDK (specifically `@lazorkit/wallet`) uses a combination of **WebAuthn** and secure browser storage to maintain an active session.

### The Flow

1. **First Login**: User creates/connects a passkey. The SDK generates a Smart Wallet and saves the reference to the local environment.
2. **Page Reload**: On mount, the SDK checks browser storage for an active session signature.
3. **Implicit Reconnection**: If a valid session is found, the `isConnected` state becomes `true` automatically without the user needing to click "Connect" again.

## Implementation in this Starter

In `ConnectWallet.tsx`, we demonstrate how to leverage this built-in persistence:

```tsx
// src/components/ConnectWallet.tsx

const { isConnected, smartWalletPubkey } = useWallet();

useEffect(() => {
  // If we're already connected on mount, the SDK has recovered the session!
  if (isConnected && smartWalletPubkey) {
    console.log("Welcome back!", smartWalletPubkey.toBase58());
    fetchBalance();
  }
}, [isConnected, smartWalletPubkey]);
```

### Key Security Benefits

- **Non-Custodial**: The session is tied to the biometric passkey on the device.
- **Hardware Bound**: Even if a physical device is stolen, the passkey is protected by Biometrics (FaceID/TouchID).
- **No Seed Phrases**: No plain-text keys are stored in local storage, reducing attack surface.

## Pro-Tip

Test this by logging in, refreshing the page, and watching the balance area. You'll notice you stay logged in seamlessly, this is the **10x UX** in action!
