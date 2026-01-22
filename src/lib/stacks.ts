// StackPay Links - Stacks Address Utilities
// Encodes Stacks addresses to bytes32 format for xReserve bridge

import { c32addressDecode } from 'c32check';

/**
 * Encodes a Stacks address to bytes32 format for xReserve depositToRemote
 *
 * Format: 11 bytes of 0x00 + [Stacks version byte] + [20-byte hash160]
 * Total: 32 bytes
 *
 * @param stacksAddress - Stacks address in c32check format (e.g., ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
 * @returns bytes32 encoded address as hex string
 */
export function encodeStacksAddressToBytes32(stacksAddress: string): `0x${string}` {
  try {
    // Decode the c32check address to get version and hash160
    const [version, hash160] = c32addressDecode(stacksAddress);

    // Convert hash160 hex string to bytes
    const hash160Bytes = Buffer.from(hash160, 'hex');

    if (hash160Bytes.length !== 20) {
      throw new Error('Invalid hash160 length');
    }

    // Create the 32-byte buffer
    // Format: 11 bytes padding + 1 byte version + 20 bytes hash160
    const bytes32 = Buffer.alloc(32, 0);

    // Set version byte at position 11
    bytes32[11] = version;

    // Copy hash160 starting at position 12
    hash160Bytes.copy(bytes32, 12);

    return `0x${bytes32.toString('hex')}` as `0x${string}`;
  } catch (error) {
    throw new Error(`Failed to encode Stacks address: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validates a Stacks address format
 *
 * @param address - Address to validate
 * @returns true if valid Stacks address
 */
export function isValidStacksAddress(address: string): boolean {
  if (!address) return false;

  // Stacks testnet addresses start with ST
  // Stacks mainnet addresses start with SP
  if (!address.startsWith('ST') && !address.startsWith('SP')) {
    return false;
  }

  try {
    c32addressDecode(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the Stacks explorer URL for an address
 *
 * @param address - Stacks address
 * @param isTestnet - Whether to use testnet explorer
 * @returns Explorer URL
 */
export function getStacksExplorerUrl(address: string, isTestnet = true): string {
  const chain = isTestnet ? '?chain=testnet' : '';
  return `https://explorer.hiro.so/address/${address}${chain}`;
}

/**
 * Gets the Stacks explorer URL for a transaction
 *
 * @param txId - Transaction ID
 * @param isTestnet - Whether to use testnet explorer
 * @returns Explorer URL
 */
export function getStacksTxExplorerUrl(txId: string, isTestnet = true): string {
  const chain = isTestnet ? '?chain=testnet' : '';
  return `https://explorer.hiro.so/txid/${txId}${chain}`;
}
