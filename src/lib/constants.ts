// StackPay Links - Contract Addresses and Constants
// Testnet-focused for hackathon demo

export const CHAINS = {
  SEPOLIA: {
    id: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://eth-sepolia.public.blastapi.io',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  STACKS_TESTNET: {
    name: 'Stacks Testnet',
    apiUrl: 'https://api.testnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so/?chain=testnet',
  },
} as const;

// Ethereum Sepolia Contract Addresses
export const CONTRACTS = {
  // USDC on Sepolia (Circle's testnet USDC)
  USDC_SEPOLIA: '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238' as `0x${string}`,

  // xReserve Bridge on Sepolia
  XRESERVE_SEPOLIA: '0x008888878fcb3dfea7756fc3c1b0cd6fe44444a2' as `0x${string}`,

  // Mainnet addresses (for reference)
  XRESERVE_MAINNET: '0x888888888fcb3dfea7756fc3c1b0cd6fe444443c' as `0x${string}`,
} as const;

// Stacks Contract Addresses
export const STACKS_CONTRACTS = {
  // USDCx token contract on Stacks Testnet
  USDCX_TESTNET: 'ST3JDZQZXCQNXKKS31BDGPEW0ESEV1RCQ19R5MZTM.usdcx-v1',

  // USDCx token contract on Stacks Mainnet
  USDCX_MAINNET: 'ST2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usdcx-v1',
} as const;

// xReserve Bridge Constants
export const BRIDGE = {
  // Remote domain ID for Stacks (used in depositToRemote)
  STACKS_REMOTE_DOMAIN: 10003,

  // USDC has 6 decimals
  USDC_DECIMALS: 6,

  // Minimum deposit amount (1 USDC)
  MIN_DEPOSIT_USDC: 1,

  // Estimated peg-in time on testnet (~15 minutes)
  ESTIMATED_PEGIN_MINUTES: 15,

  // Estimated peg-out time on testnet (~25 minutes)
  ESTIMATED_PEGOUT_MINUTES: 25,

  // Peg-out minimum (~4.80 USDCx)
  MIN_PEGOUT_USDCX: 4.8,
} as const;

// Payment link statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  DEPOSITING: 'depositing',
  CONFIRMING: 'confirming',
  BRIDGING: 'bridging',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
