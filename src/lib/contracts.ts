// StackPay Links - Contract ABIs
// Minimal ABIs for xReserve bridge and USDC token interactions

// xReserve Bridge ABI (minimal - only depositToRemote function)
// The xReserve contract is an ERC1967 Proxy, so we call the proxy address
// but use the implementation ABI for encoding
export const XRESERVE_ABI = [
  {
    type: 'function',
    name: 'depositToRemote',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'remoteDomain', type: 'uint32' },
      { name: 'remoteRecipient', type: 'bytes32' },
      { name: 'localToken', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'maxFee', type: 'uint256' },
      { name: 'hookData', type: 'bytes' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'quoteDeposit',
    stateMutability: 'view',
    inputs: [
      { name: 'remoteDomain', type: 'uint32' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: 'fee', type: 'uint256' }],
  },
] as const;

// ERC-20 USDC ABI (minimal - approve, balanceOf, allowance)
export const USDC_ABI = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;
