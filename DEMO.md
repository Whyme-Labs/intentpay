# StackPay Links - Demo Guide

> Demo documentation and video script for the Stacks x USDCx Hackathon submission

## Live Demo URL

**https://stackpay.whymelabs.com**

---

## Demo Flow Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   1. CREATE     │────▶│    2. SHARE     │────▶│     3. PAY      │────▶│   4. RECEIVE    │
│  Payment Link   │     │   Link/QR Code  │     │  (EVM Wallet)   │     │  USDCx on Stacks│
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Step 1: Merchant Creates Payment Link
- Navigate to `/create`
- Enter Stacks testnet address (recipient)
- Enter amount in USDC
- Add optional memo
- Click "Create Payment Link"

### Step 2: Share with Payer
- Copy the generated payment link
- Or show QR code for mobile scanning
- Share via any channel (email, chat, etc.)

### Step 3: Payer Completes Payment
- Payer opens link in browser
- Connects any Ethereum wallet (MetaMask, etc.)
- Approves USDC spending (if needed)
- Confirms deposit transaction
- USDC is sent to Circle xReserve bridge

### Step 4: Merchant Receives USDCx
- Bridge processes the cross-chain transfer (~15 min on testnet)
- USDCx is minted on Stacks testnet
- Merchant receives funds at their Stacks address

---

## Video Script

### Opening (0:00 - 0:15)

**[Screen: Landing page of StackPay Links]**

> "Hi, I'm presenting StackPay Links - cross-chain payment links that bridge USDC from Ethereum to USDCx on Stacks, using Circle's xReserve bridge."

---

### Problem Statement (0:15 - 0:30)

**[Screen: Show problem illustration or text]**

> "The problem: Merchants on Stacks want to accept payments, but most users only have Ethereum wallets with USDC. Currently, there's no simple way for Ethereum users to pay Stacks merchants directly."

---

### Solution Introduction (0:30 - 0:50)

**[Screen: Landing page features]**

> "StackPay Links solves this. Think of it as 'Stripe Payment Links, but cross-chain into Bitcoin L2.' Merchants create a simple payment link, share it with anyone, and payers can pay using any Ethereum wallet. The USDC automatically bridges to USDCx on Stacks."

---

### Demo: Creating a Payment Link (0:50 - 1:30)

**[Screen: Navigate to /create page]**

> "Let me show you how it works. First, I'll create a payment link as a merchant."

**[Action: Fill in the form]**

> "I enter my Stacks testnet address where I want to receive USDCx..."

> "Set the amount - let's say 2 USDC..."

> "And add an optional memo - 'Coffee order'..."

**[Action: Click Create Payment Link]**

> "Click create, and my payment link is ready!"

**[Screen: Show the generated link and QR code]**

> "I can copy this link or show the QR code. Let me share this with my payer."

---

### Demo: Payer Experience (1:30 - 2:30)

**[Screen: Payment page]**

> "Now, from the payer's perspective. They open the link and see the payment request - 2 USDC with the memo."

**[Action: Connect wallet]**

> "They connect their Ethereum wallet - in this case, MetaMask on Sepolia testnet."

**[Screen: Show wallet balance and payment details]**

> "The page shows their USDC balance and the bridge route: Sepolia USDC will be converted to Stacks USDCx via Circle xReserve."

**[Action: Click Pay button]**

> "Click pay, approve the USDC spending in MetaMask..."

**[Action: Confirm transaction]**

> "And confirm the deposit transaction. That's it from the payer's side!"

---

### Demo: Status Tracking (2:30 - 3:00)

**[Screen: Status page]**

> "Both parties can track the payment in real-time. We see the progress through each stage:"

> "Created... Depositing... Confirming on Ethereum... Bridging to Stacks..."

**[Screen: Show completed status]**

> "And finally, complete! The USDCx has been minted and delivered to the merchant's Stacks address."

---

### Technical Highlights (3:00 - 3:30)

**[Screen: Architecture diagram or code snippets]**

> "Under the hood, StackPay Links uses:"

> "- Circle's xReserve bridge for secure USDC to USDCx bridging"
> "- Cloudflare Workers for serverless, globally distributed backend"
> "- D1 database for payment link storage"
> "- wagmi and viem for seamless wallet connections"

---

### Key Benefits (3:30 - 3:50)

**[Screen: Benefits list]**

> "Key benefits:"

> "1. No Stacks wallet needed for payers - only Ethereum"
> "2. One-click bridge experience - no manual bridging steps"
> "3. QR code support for in-person payments"
> "4. Real-time tracking from deposit to delivery"

---

### Closing (3:50 - 4:00)

**[Screen: Landing page with links]**

> "StackPay Links - bringing Ethereum liquidity to Stacks, one payment link at a time."

> "Try it now at stackpay.whymelabs.com"

> "Thank you!"

---

## On-Screen Text / Captions

### Title Card
```
StackPay Links
Cross-Chain Payment Links for Stacks

Built for the Stacks x USDCx Hackathon
```

### Problem Slide
```
THE PROBLEM

- Merchants on Stacks want to accept payments
- Most users have Ethereum wallets with USDC
- No simple way to pay cross-chain
```

### Solution Slide
```
THE SOLUTION

StackPay Links
"Stripe Payment Links, but cross-chain into Bitcoin L2"

Ethereum USDC → Circle xReserve → Stacks USDCx
```

### Features Slide
```
KEY FEATURES

✓ No Stacks wallet needed for payers
✓ One-click bridge experience
✓ QR code support
✓ Real-time payment tracking
✓ Serverless architecture
```

### Tech Stack Slide
```
BUILT WITH

• Next.js + Cloudflare Workers
• Circle xReserve Bridge
• wagmi + viem
• Cloudflare D1 Database
```

### Closing Slide
```
StackPay Links

Live Demo: stackpay.whymelabs.com
GitHub: [your-repo-url]

Bringing Ethereum liquidity to Stacks,
one payment link at a time.
```

---

## Demo Preparation Checklist

### Before Recording

- [ ] Fund your Sepolia wallet with ETH (for gas)
- [ ] Fund your Sepolia wallet with USDC from [Circle Faucet](https://faucet.circle.com/)
- [ ] Have a Stacks testnet address ready
- [ ] Clear browser cache / use incognito for clean demo
- [ ] Disconnect wallet to show full connection flow

### Testnet Resources

| Resource | URL |
|----------|-----|
| Circle USDC Faucet | https://faucet.circle.com/ |
| Sepolia ETH Faucet | https://sepoliafaucet.com/ |
| Stacks Testnet Faucet | https://explorer.hiro.so/sandbox/faucet?chain=testnet |
| Sepolia Etherscan | https://sepolia.etherscan.io/ |
| Stacks Explorer | https://explorer.hiro.so/?chain=testnet |

### Contract Addresses (for reference)

| Contract | Address |
|----------|---------|
| USDC (Sepolia) | `0x1c7d4b196cb0c7b01d743fbc6116a902379c7238` |
| xReserve (Sepolia) | `0x008888878fcb3dfea7756fc3c1b0cd6fe44444a2` |
| Stacks Remote Domain | `10003` |

---

## Hackathon Submission Info

**Track:** Bring liquidity from Ethereum to Stacks using USDCx

**Project:** StackPay Links

**Tagline:** Cross-chain payment links that bridge USDC from Ethereum to USDCx on Stacks

**Description:**
StackPay Links enables merchants on Stacks to create shareable payment links that accept USDC from any Ethereum wallet. Payments are automatically bridged to USDCx on Stacks via Circle's xReserve, eliminating the need for payers to have a Stacks wallet or manually bridge funds.

**Key Innovation:**
- Abstracts away cross-chain complexity for end users
- Stripe-like payment link experience for Web3
- Leverages Circle xReserve for secure, native USDC bridging

---

## Video Recording Tips

1. **Resolution:** Record at 1920x1080 (1080p) minimum
2. **Browser:** Use Chrome with a clean profile
3. **Wallet:** Pre-fund MetaMask but disconnect before recording
4. **Speed:** Speak slowly and clearly
5. **Duration:** Aim for 3-4 minutes total
6. **Audio:** Use a good microphone, minimize background noise
7. **Editing:** Add zoom effects on important UI elements

### Recommended Tools
- Screen recording: OBS Studio, Loom, or QuickTime
- Video editing: DaVinci Resolve (free) or Final Cut Pro
- Thumbnails: Figma or Canva
