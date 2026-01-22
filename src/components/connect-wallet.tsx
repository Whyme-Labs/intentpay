'use client';

// StackPay Links - Wallet Connection Component
// Handles connecting EVM wallets via wagmi

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export function ConnectWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const isWrongNetwork = isConnected && chain?.id !== sepolia.id;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        {isWrongNetwork && (
          <span className="text-sm text-red-500">Wrong network - Switch to Sepolia</span>
        )}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector, chainId: sepolia.id })}
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
        >
          {isPending ? 'Connecting...' : `Connect ${connector.name}`}
        </button>
      ))}
    </div>
  );
}

export function WalletStatus() {
  const { address, isConnected, chain } = useAccount();

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-2 h-2 bg-green-500 rounded-full" />
      <span className="font-mono text-gray-600 dark:text-gray-400">
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
      <span className="text-gray-400">on {chain?.name || 'Unknown'}</span>
    </div>
  );
}
