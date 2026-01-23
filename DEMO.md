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

## Pitch Video Script (3-4 minutes)

> **Note:** This is a PITCH video, not just a demo. It should explain the project, integration approach, and potential impact.

---

### INTRO - Hook (0:00 - 0:15)

**[Screen: You on camera or animated title card]**

> "What if paying a Stacks merchant was as easy as clicking a link? No bridging. No new wallet. Just pay."
>
> "I'm [Your Name] from Whyme Labs, and this is StackPay Links."

---

### THE PROBLEM (0:15 - 0:45)

**[Screen: Problem visualization - show the friction]**

> "Here's the problem. Stacks is building the future of Bitcoin DeFi, and USDCx brings native USDC to the ecosystem."
>
> "But there's a gap. Most crypto users today hold USDC on Ethereum. If a Stacks merchant wants to accept payment, their customer has to:"

**[Show numbered list on screen]**

> "One - Figure out what bridging means.
> Two - Navigate to a bridge interface.
> Three - Wait for the transaction.
> Four - Then finally pay the merchant."
>
> "That's too much friction. Most users give up."

---

### THE SOLUTION (0:45 - 1:15)

**[Screen: StackPay Links landing page]**

> "StackPay Links eliminates all of that."
>
> "Think of it as Stripe Payment Links, but cross-chain into Bitcoin Layer 2."

**[Screen: Simple flow diagram]**

> "Merchants create a payment link with their Stacks address and amount. Share it via text, email, or QR code. The payer clicks, connects their Ethereum wallet, and pays. That's it."
>
> "Behind the scenes, we use Circle's xReserve bridge to convert USDC to USDCx automatically. The merchant receives native USDCx on Stacks."

---

### LIVE DEMO (1:15 - 2:30)

**[Screen: Browser showing stackpay.whymelabs.com]**

> "Let me show you how it works."

#### Creating a Payment Link (1:15 - 1:45)

**[Navigate to /create]**

> "As a merchant, I go to Create Payment Link. I enter my Stacks testnet address..."

**[Fill form]**

> "...set the amount to 5 USDC, add a memo 'Coffee order', and click Create."

**[Show generated link + QR]**

> "Instantly, I get a shareable link and QR code. I can text this to my customer or display it at my shop."

#### Payer Experience (1:45 - 2:15)

**[Open pay page]**

> "Now I'm the customer. I click the link and see the payment request - 5 USDC for coffee."

**[Connect wallet]**

> "I connect MetaMask. The app shows my USDC balance and explains the bridge route."

**[Click Pay]**

> "I click Pay, approve the USDC spend, and confirm the transaction."

**[Show status page]**

> "Done. The status page shows real-time progress: depositing, confirming, bridging..."

#### Completion (2:15 - 2:30)

**[Show completed status or Stacks explorer]**

> "In about 15 minutes, the bridge completes. The merchant's Stacks wallet now has 5 USDCx. Payment received."

---

### INTEGRATION APPROACH (2:30 - 3:00)

**[Screen: Technical architecture diagram]**

> "Let me explain how we integrated with USDCx."

**[Show diagram: Payer → xReserve → Stacks]**

> "We use Circle's xReserve bridge contract on Ethereum Sepolia. When a user pays, we call the depositToRemote function with three key parameters:"

**[Show code snippet or bullet points]**

> "The remote domain - 10003 for Stacks.
> The recipient's Stacks address encoded as bytes32.
> And the USDC amount."
>
> "The bridge handles attestation, relaying, and minting USDCx on Stacks."

**[Show tech stack]**

> "Our stack: Next.js for the frontend, Cloudflare Workers for serverless edge deployment, D1 for database, and wagmi plus viem for wallet connections."

---

### POTENTIAL IMPACT (3:00 - 3:30)

**[Screen: Impact visualization]**

> "So what's the potential impact?"

**[Show bullet points as you speak]**

> "First - Liquidity bridge. Billions of dollars in USDC sit on Ethereum. StackPay Links creates a direct pipeline for that liquidity to flow into Stacks."
>
> "Second - Merchant adoption. By removing wallet friction, we make it practical for real businesses to accept crypto on Stacks."
>
> "Third - User onboarding. Ethereum users can now interact with Stacks ecosystem without learning new tools. They pay, and they're done."

---

### FUTURE ROADMAP (3:30 - 3:45)

**[Screen: Roadmap or future features]**

> "Looking ahead, we plan to:"
>
> "Deploy to mainnet with real USDC.
> Add merchant dashboards with payment history.
> Support multiple currencies beyond USDC.
> And enable peg-out for USDCx back to Ethereum."

---

### CLOSING (3:45 - 4:00)

**[Screen: You on camera + call to action]**

> "StackPay Links - bringing Ethereum liquidity to Stacks, one payment link at a time."
>
> "Try the live demo at stackpay.whymelabs.com. Check out our code on GitHub."
>
> "Thank you for watching. Let's build the future of cross-chain payments together."

**[End card: Logo + URLs]**

```
StackPay Links

Live Demo: stackpay.whymelabs.com
GitHub: github.com/Whyme-Labs/intentpay

Built for the Stacks x USDCx Hackathon
```

---

## Quick Reference - Pitch Structure

| Section | Duration | Key Message |
|---------|----------|-------------|
| Hook | 15 sec | Grab attention with the vision |
| Problem | 30 sec | Bridging friction is killing adoption |
| Solution | 30 sec | Payment links + automatic bridging |
| Demo | 75 sec | Show the complete flow |
| Integration | 30 sec | How we use xReserve |
| Impact | 30 sec | Liquidity, merchants, users |
| Roadmap | 15 sec | What's next |
| Closing | 15 sec | Call to action |
| **Total** | **~4 min** | |

---

## Recording Tips for Pitch Video

1. **Start strong** - The first 10 seconds decide if judges keep watching
2. **Face on camera** - At least for intro and closing, show yourself
3. **Energy** - Sound excited about your project
4. **Pace** - Speak clearly, not too fast
5. **B-roll** - Mix screen recording with diagrams and text overlays
6. **Music** - Light background music adds polish (royalty-free)
7. **Edit tight** - Cut pauses and mistakes

### Recommended Tools
- **Recording**: Loom, OBS Studio, or QuickTime
- **Editing**: DaVinci Resolve (free), CapCut, or Final Cut Pro
- **Diagrams**: Excalidraw, Figma, or Canva
- **Music**: YouTube Audio Library (free)

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
| xReserve (Sepolia) | `0x008888878f94C0d87defdf0B07f46B93C1934442` |
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
