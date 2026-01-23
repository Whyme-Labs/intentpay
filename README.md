# StackPay Links

> Cross-chain payment links that bridge USDC from Ethereum to USDCx on Stacks via Circle xReserve.

**Built for the [Stacks x USDCx Hackathon](https://dorahacks.io/hackathon/stacks-usdcx/buidl)**

## Live Demo

**https://stackpay.whymelabs.com**

See [DEMO.md](./DEMO.md) for the full demo guide and video script.

## Overview

StackPay Links is like "Stripe Payment Links, but cross-chain into Bitcoin L2." Merchants on Stacks can create shareable payment links that accept USDC from any Ethereum wallet, automatically bridging payments to USDCx on Stacks.

### Key Features

- **No Stacks Wallet Required for Payers** - Only needs an Ethereum wallet
- **One-Click Bridge** - USDC (Sepolia) → USDCx (Stacks) via Circle xReserve
- **QR Code Support** - Generate scannable payment links
- **Real-Time Tracking** - Watch payment progress from deposit to bridge completion
- **Serverless Architecture** - Built on Cloudflare Workers for global edge deployment

## How It Works

1. **Merchant creates a payment link** with their Stacks address and desired amount
2. **Share the link/QR** with anyone who needs to pay
3. **Payer connects EVM wallet** and approves USDC payment on Sepolia
4. **xReserve bridges** USDC to USDCx on Stacks (~15 min on testnet)
5. **Merchant receives USDCx** at their Stacks address

## Technical Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Payer Wallet  │────▶│  Circle xReserve │────▶│  Stacks USDCx   │
│ (Sepolia USDC)  │     │     (Bridge)     │     │   (Merchant)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌──────────────────┐
│ StackPay Links  │     │  Cloudflare D1   │
│   (Next.js)     │────▶│   (Database)     │
└─────────────────┘     └──────────────────┘
```

### Contract Addresses (Testnet)

**Ethereum Sepolia:**
- USDC: `0x1c7d4b196cb0c7b01d743fbc6116a902379c7238`
- xReserve: `0x008888878f94C0d87defdf0B07f46B93C1934442`

**Stacks Testnet:**
- USDCx: `ST3JDZQZXCQNXKKS31BDGPEW0ESEV1RCQ19R5MZTM.usdcx-v1`
- Remote Domain: `10003`

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Cloudflare account (for deployment)
- MetaMask or compatible EVM wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/stackpay-links.git
cd stackpay-links

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.dev.vars` file for local development:

```env
NEXTJS_ENV=development
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Database Setup

For local development, the app works without a database (uses in-memory storage).

For production, create a D1 database:

```bash
# Create the database
npx wrangler d1 create stackpay-db

# Update wrangler.jsonc with the database_id

# Apply the schema
npx wrangler d1 execute stackpay-db --local --file=./schema.sql
```

## Development

```bash
# Run Next.js dev server
npm run dev

# Preview on Cloudflare runtime locally
npm run preview

# Run type checking
npm run lint

# Generate Cloudflare types
npm run cf-typegen
```

## Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── links/           # Payment link API routes
│   ├── create/              # Create payment link page
│   ├── pay/[id]/            # Payment page
│   ├── status/[id]/         # Status tracking page
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Landing page
├── components/
│   ├── connect-wallet.tsx   # Wallet connection UI
│   ├── payment-status.tsx   # Status display component
│   └── providers.tsx        # wagmi/react-query providers
└── lib/
    ├── constants.ts         # Contract addresses, chain config
    ├── contracts.ts         # ABI definitions
    ├── stacks.ts            # Stacks address encoding
    ├── types.ts             # TypeScript interfaces
    ├── wagmi.ts             # wagmi configuration
    └── hooks/
        └── usePayment.ts    # Payment transaction hook
```

## Demo Flow

### For the Hackathon Demo

**Preparation:**
1. Fund a Sepolia wallet with ETH (for gas) and USDC
2. Have a Stacks testnet address ready (merchant)

**Demo Steps:**
1. Create a payment link at `/create`
2. Enter merchant's Stacks testnet address and amount
3. Share the generated link/QR
4. Connect payer's MetaMask to the pay page
5. Approve USDC and submit deposit transaction
6. Watch the status page as payment bridges to Stacks

### Getting Testnet Tokens

- **Sepolia ETH:** [sepoliafaucet.com](https://sepoliafaucet.com/)
- **Sepolia USDC:** [faucet.circle.com](https://faucet.circle.com/)
- **Stacks Testnet STX:** [explorer.hiro.so/sandbox/faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)

## Bridging Details

### Peg-In (USDC → USDCx)

1. Approve USDC spending by xReserve contract
2. Call `depositToRemote()` with:
   - `remoteDomain`: 10003 (Stacks)
   - `remoteRecipient`: bytes32-encoded Stacks address
   - `localToken`: USDC contract address
   - `value`: amount in 6 decimals

**Timing:** ~15 minutes on testnet

### Stacks Address Encoding

Stacks addresses are encoded to bytes32 for xReserve:
```
bytes32 = 11 bytes padding (0x00) + version byte + 20-byte hash160
```

## Hackathon Submission

**Track:** Bring liquidity from Ethereum to Stacks using USDCx

**Tagline:** "Stripe Payment Links, but cross-chain into Bitcoin L2"

**Deliverables:**
- [x] Working demo on testnet
- [x] GitHub repository with source code
- [ ] Pitch video (see [DEMO.md](./DEMO.md) for script)

## Known Limitations

- **Testnet Only:** Currently configured for Sepolia ↔ Stacks testnet
- **Bridge Timing:** Peg-in takes ~15 minutes on testnet
- **Minimum Amount:** 1 USDC minimum deposit
- **No Peg-Out:** v1 focuses on USDC → USDCx direction only

## Future Improvements

- [ ] Mainnet deployment
- [ ] Peg-out support (USDCx → USDC)
- [ ] Multiple currency support
- [ ] Merchant dashboard
- [ ] Webhook notifications
- [ ] Mobile wallet deep links

## Resources

- [USDCx Documentation](https://docs.stacks.co/learn/bridging/usdcx)
- [Circle xReserve Guide](https://docs.stacks.co/more-guides/bridging-usdcx)
- [Stacks Explorer (Testnet)](https://explorer.hiro.so/?chain=testnet)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)

## License

MIT

---

Built with Next.js, Cloudflare Workers, wagmi, and viem for the Stacks ecosystem.
