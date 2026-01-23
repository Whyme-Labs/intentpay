# StackPay Links - Pitch Document

> **Cross-Chain Payment Links for the Stacks Ecosystem**
>
> Built for the Stacks x USDCx Hackathon

---

## Executive Summary

StackPay Links is a payment infrastructure solution that enables merchants on the Stacks blockchain to accept USDC payments from any Ethereum wallet. By abstracting away the complexity of cross-chain bridging, we create a "Stripe Payment Links" experience for Web3 - where payers simply click, connect, and pay.

**Live Demo:** https://stackpay.whymelabs.com

**GitHub:** https://github.com/Whyme-Labs/intentpay

---

## The Problem

### Fragmented Liquidity Across Chains

The cryptocurrency ecosystem faces a fundamental challenge: liquidity is fragmented across multiple blockchains. While Stacks is building the future of Bitcoin DeFi and USDCx brings native USDC to the ecosystem, most crypto users today hold their USDC on Ethereum.

### The Friction of Cross-Chain Payments

When a Stacks merchant wants to accept payment from an Ethereum user, the current experience is painful:

1. **Education Barrier** - The payer must understand what "bridging" means
2. **Navigation Complexity** - Find and navigate to a bridge interface
3. **Waiting Period** - Wait for the bridge transaction to complete
4. **Multiple Steps** - Finally send the payment to the merchant

**Result:** Most users abandon the payment process. This friction is killing adoption.

### Real-World Impact

- **Merchants lose sales** because customers won't complete complex payment flows
- **Users miss opportunities** because the process is too intimidating
- **The ecosystem suffers** from reduced liquidity flow and adoption

---

## The Solution

### StackPay Links: One-Click Cross-Chain Payments

StackPay Links eliminates all bridging friction by creating shareable payment links that handle everything automatically.

**For Merchants:**
- Create a payment link in seconds
- Receive native USDCx directly in their Stacks wallet
- No technical knowledge required

**For Payers:**
- Click a link or scan a QR code
- Connect any Ethereum wallet (MetaMask, etc.)
- Pay with familiar USDC
- Done - no bridging knowledge needed

### The Magic Behind the Scenes

When a payer completes a payment:

```
Ethereum USDC → Circle xReserve Bridge → Stacks USDCx → Merchant Wallet
     ↑                    ↑                    ↑              ↑
 Payer's         Automatic          Native         Merchant
 Wallet         Cross-Chain         Stacks         Receives
                 Transfer           Token           Funds
```

The entire bridging process is abstracted away. The payer thinks they're just "paying" - they don't need to know about xReserve, attestations, or cross-chain messaging.

---

## How It Works

### Step 1: Merchant Creates Payment Link

```
┌─────────────────────────────────────┐
│     Create Payment Link             │
├─────────────────────────────────────┤
│  Stacks Address: ST2PD...Q20QR4     │
│  Amount: 25 USDC                    │
│  Memo: "Invoice #1234"              │
│                                     │
│  [Create Link]                      │
└─────────────────────────────────────┘
```

The merchant enters their Stacks address, the payment amount, and an optional memo. One click generates a unique payment link and QR code.

### Step 2: Share the Link

The payment link can be shared anywhere:
- Email invoices
- Chat messages
- Social media
- Physical QR codes at point-of-sale
- Embedded in websites

### Step 3: Payer Completes Payment

```
┌─────────────────────────────────────┐
│     Payment Request                 │
├─────────────────────────────────────┤
│                                     │
│         25 USDC                     │
│     "Invoice #1234"                 │
│                                     │
│  To: ST2PD...Q20QR4 (Stacks)        │
│                                     │
│  Your Balance: 150 USDC             │
│                                     │
│  [Connect Wallet]                   │
│  [Pay 25 USDC]                      │
│                                     │
└─────────────────────────────────────┘
```

The payer sees a clean payment interface. They connect their Ethereum wallet, approve the USDC spend, and confirm. That's it.

### Step 4: Merchant Receives USDCx

The Circle xReserve bridge processes the cross-chain transfer. In approximately 15-30 minutes (testnet), the merchant receives native USDCx in their Stacks wallet.

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        StackPay Links                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │   Next.js   │───▶│  Cloudflare │───▶│   Cloudflare D1     │ │
│  │  Frontend   │    │   Workers   │    │    (Database)       │ │
│  └─────────────┘    └─────────────┘    └─────────────────────┘ │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Payer's Browser                       │   │
│  │  ┌─────────────┐         ┌─────────────────────────┐    │   │
│  │  │   wagmi     │────────▶│  Ethereum Wallet        │    │   │
│  │  │   + viem    │         │  (MetaMask, etc.)       │    │   │
│  │  └─────────────┘         └─────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Ethereum (Sepolia)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐         ┌─────────────────────────────────┐   │
│  │    USDC     │────────▶│      Circle xReserve            │   │
│  │   Token     │         │         Bridge                  │   │
│  └─────────────┘         │                                 │   │
│                          │  depositToRemote(               │   │
│                          │    value,                       │   │
│                          │    remoteDomain: 10003,         │   │
│                          │    remoteRecipient: bytes32,    │   │
│                          │    localToken: USDC,            │   │
│                          │    maxFee: 0,                   │   │
│                          │    hookData: 0x                 │   │
│                          │  )                              │   │
│                          └─────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Cross-Chain Message
                              │ (~15-30 min testnet)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Stacks (Testnet)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      USDCx Token                         │   │
│  │   ST3JDZQZXCQNXKKS31BDGPEW0ESEV1RCQ19R5MZTM.usdcx-v1    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Merchant Wallet                        │   │
│  │              Receives native USDCx                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Integration with Circle xReserve

StackPay Links integrates directly with Circle's xReserve bridge infrastructure:

**Contract Addresses (Sepolia Testnet):**
| Contract | Address |
|----------|---------|
| USDC | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |
| xReserve | `0x008888878f94C0d87defdf0B07f46B93C1934442` |

**Stacks Configuration:**
| Parameter | Value |
|-----------|-------|
| Remote Domain | `10003` |
| USDCx Contract | `ST3JDZQZXCQNXKKS31BDGPEW0ESEV1RCQ19R5MZTM.usdcx-v1` |

### Stacks Address Encoding

To bridge funds to a Stacks address, we encode it as a bytes32 value:

```
bytes32 = [11 bytes 0x00 padding] + [1 byte version] + [20 bytes hash160]

Example for ST2PDAXSRMBF0702EWF6DWP8ADH40QDCHY8Q20QR4:
0x00000000000000000000001aacd57738a2de03804ee3ccde590a6c480bb591f2
                        ^^
                   version byte (1a = 26 for ST testnet)
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS |
| Blockchain | wagmi v2, viem |
| Hosting | Cloudflare Workers (Edge) |
| Database | Cloudflare D1 (SQLite) |
| Bridge | Circle xReserve / CCTP |

---

## Market Opportunity

### The Cross-Chain Payment Problem is Universal

Every blockchain ecosystem faces the same challenge: users hold assets on different chains than where they want to transact. This creates a massive opportunity for payment infrastructure that abstracts away complexity.

### Target Markets

**1. Stacks Merchants**
- DeFi protocols accepting fees
- NFT marketplaces
- Service providers in the Bitcoin ecosystem
- Physical merchants accepting crypto

**2. Ethereum Users**
- Largest pool of USDC holders
- Familiar with MetaMask and wallet-based payments
- Looking for ways to interact with Bitcoin DeFi

**3. Cross-Chain Commerce**
- Any business operating across multiple chains
- Payment processors seeking to support multiple blockchains
- Platforms wanting to offer unified checkout

### Market Size

- **$30B+** USDC circulating supply (majority on Ethereum)
- **Growing Stacks ecosystem** with Bitcoin DeFi innovation
- **Increasing demand** for cross-chain payment solutions

---

## Competitive Advantage

### Why StackPay Links Wins

| Feature | StackPay Links | Manual Bridging | Other Solutions |
|---------|---------------|-----------------|-----------------|
| User Experience | One-click | 4+ steps | Varies |
| Technical Knowledge Required | None | High | Medium |
| Time to Payment | Instant (bridge async) | User manages | Varies |
| Merchant Setup | 30 seconds | N/A | Minutes-Hours |
| Stacks Native | Yes | Manual | Limited |

### Key Differentiators

1. **Zero Learning Curve** - Payers don't need to know about bridges
2. **Instant Payment Links** - Merchants can start accepting payments immediately
3. **Native USDCx** - Merchants receive real, usable tokens on Stacks
4. **Serverless Architecture** - Global edge deployment, high reliability
5. **Open Source** - Transparent, auditable, community-driven

---

## Traction & Validation

### Current Status

- **Working testnet demo** deployed and functional
- **Full payment flow** implemented end-to-end
- **Real xReserve integration** with successful bridge transactions

### Hackathon Deliverables

- [x] Live demo application
- [x] GitHub repository with full source code
- [x] Technical documentation
- [x] Pitch video

---

## Roadmap

### Phase 1: Foundation (Current - Hackathon)
- [x] Core payment link functionality
- [x] xReserve bridge integration
- [x] Basic UI/UX
- [x] Testnet deployment

### Phase 2: Production Ready (Q1 2026)
- [ ] Mainnet deployment
- [ ] Security audit
- [ ] Enhanced error handling and recovery
- [ ] Payment confirmation webhooks

### Phase 3: Merchant Tools (Q2 2026)
- [ ] Merchant dashboard
- [ ] Payment history and analytics
- [ ] Bulk payment link creation
- [ ] API for programmatic access

### Phase 4: Ecosystem Expansion (Q3 2026)
- [ ] Peg-out support (USDCx → USDC)
- [ ] Multiple currency support
- [ ] Additional chain integrations
- [ ] Mobile wallet deep links

### Phase 5: Enterprise Features (Q4 2026)
- [ ] Multi-signature support
- [ ] Recurring payments
- [ ] Invoice management
- [ ] Accounting integrations

---

## Business Model

### Revenue Opportunities

**1. Transaction Fees**
- Small percentage fee on each payment
- Competitive with traditional payment processors
- Volume-based pricing for large merchants

**2. Premium Features**
- Advanced analytics and reporting
- Custom branding
- Priority support
- API access

**3. Enterprise Licensing**
- White-label solution for payment processors
- Custom integrations
- SLA guarantees

### Pricing Strategy (Future)

| Tier | Fee | Features |
|------|-----|----------|
| Free | 0.5% | Basic payment links, standard support |
| Pro | 0.3% | Dashboard, analytics, webhooks |
| Enterprise | Custom | White-label, API, dedicated support |

---

## Team

### Whyme Labs

We are a team of builders passionate about making crypto accessible to everyone. Our focus is on creating infrastructure that removes barriers to adoption.

**Core Competencies:**
- Full-stack Web3 development
- Cross-chain infrastructure
- User experience design
- Serverless architecture

---

## Why This Matters for Stacks

### Bringing Liquidity to Bitcoin DeFi

StackPay Links creates a direct pipeline for Ethereum liquidity to flow into the Stacks ecosystem. Every payment link is a potential on-ramp for new capital.

### Enabling Real Commerce

By making payments easy, we enable real businesses to operate on Stacks. This drives adoption, increases network activity, and strengthens the ecosystem.

### Showcasing USDCx

StackPay Links demonstrates the power of native USDC on Stacks. Users experience the benefits of USDCx without needing to understand the underlying technology.

---

## Potential Impact

### Quantifiable Benefits

1. **Liquidity Bridge**
   - Billions of dollars in USDC on Ethereum
   - Direct pipeline to Stacks ecosystem
   - Measurable TVL growth

2. **Merchant Adoption**
   - Lower barrier to accepting crypto
   - Familiar payment link model
   - Integration with existing workflows

3. **User Onboarding**
   - Ethereum users interact with Stacks
   - No new wallet required
   - Natural progression to deeper engagement

### Ecosystem Effects

- **More merchants** → More use cases → More users
- **More users** → More liquidity → Better DeFi
- **Better DeFi** → More developers → More innovation

---

## Call to Action

### Try It Now

1. Visit **https://stackpay.whymelabs.com**
2. Create a payment link with your Stacks testnet address
3. Share the link and complete a test payment
4. Watch USDCx arrive in your wallet

### Get Involved

- **Star the repo:** https://github.com/Whyme-Labs/intentpay
- **Follow development:** Watch for updates and new features
- **Provide feedback:** Help us improve the product

---

## Appendix

### Technical Specifications

**Supported Networks:**
- Ethereum Sepolia (Testnet) → Stacks Testnet
- Ethereum Mainnet → Stacks Mainnet (Planned)

**Supported Tokens:**
- USDC (Ethereum) → USDCx (Stacks)
- Additional tokens planned

**Bridge Timing:**
- Testnet: ~15-30 minutes
- Mainnet: ~15 minutes (estimated)

**Minimum Payment:**
- 1 USDC

### Security Considerations

- No private keys stored
- Client-side wallet signing only
- Cloudflare DDoS protection
- Rate limiting on API endpoints
- Input validation and sanitization

### Resources

- [USDCx Documentation](https://docs.stacks.co/learn/bridging/usdcx)
- [Circle xReserve Guide](https://docs.stacks.co/more-guides/bridging-usdcx)
- [Stacks Explorer](https://explorer.hiro.so/?chain=testnet)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)

---

**StackPay Links** - Bringing Ethereum liquidity to Stacks, one payment link at a time.

*Built with passion for the Stacks x USDCx Hackathon*
