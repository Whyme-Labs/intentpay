// StackPay Links - Wagmi Configuration
// Web3 wallet connection setup for EVM chains

import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// WalletConnect Project ID - Get yours at https://cloud.walletconnect.com
// For hackathon demo, using a placeholder - replace with your own
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: 'StackPay Links',
        description: 'Cross-chain payment links: USDC to USDCx via Circle xReserve',
        url: 'https://stackpay.link',
        icons: ['https://stackpay.link/icon.png'],
      },
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
});

// Re-export chain for convenience
export { sepolia };
