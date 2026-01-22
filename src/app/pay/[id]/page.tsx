'use client';

// StackPay Links - Pay Page
// Payer connects wallet and completes USDC to USDCx bridge payment

import { useEffect, useState, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAccount, useSwitchChain } from 'wagmi';
import { formatUnits } from 'viem';
import QRCode from 'react-qr-code';
import { ConnectWallet } from '@/components/connect-wallet';
import { usePayment } from '@/lib/hooks/usePayment';
import { BRIDGE, PAYMENT_STATUS, CHAINS } from '@/lib/constants';
import { getStacksExplorerUrl } from '@/lib/stacks';
import { sepolia } from '@/lib/wagmi';
import type { PaymentLink, GetPaymentLinkResponse } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PayPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const justCreated = searchParams.get('created') === 'true';

  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const [link, setLink] = useState<PaymentLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const hasTriggeredDeposit = useRef(false);

  const isWrongNetwork = isConnected && chain?.id !== sepolia.id;
  const paymentUrl = typeof window !== 'undefined' ? `${window.location.origin}/pay/${id}` : '';

  // Payment hook
  const {
    step,
    error: paymentError,
    depositTxHash,
    needsApproval,
    hasSufficientBalance,
    balance,
    isApproving,
    isDepositing,
    approveSuccess,
    approve,
    deposit,
    refetchAllowance,
  } = usePayment({
    recipientStacksAddress: link?.recipientAddress || '',
    amountUsdc: link?.amount || '0',
    onSuccess: async (txHash) => {
      // Update payment link status
      await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: PAYMENT_STATUS.CONFIRMING,
          ethTxHash: txHash,
          payerAddress: address,
        }),
      });
      // Redirect to status page
      router.push(`/status/${id}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  // Fetch payment link data
  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await fetch(`/api/links/${id}`);
        const data: GetPaymentLinkResponse = await response.json();

        if (!data.success || !data.link) {
          throw new Error(data.error || 'Payment link not found');
        }

        setLink(data.link);

        // If payment is already processing or completed, redirect to status
        if (data.link.status !== PAYMENT_STATUS.PENDING) {
          router.push(`/status/${id}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment link');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLink();
  }, [id, router]);

  // After approval success, trigger deposit (only once)
  useEffect(() => {
    if (approveSuccess && !hasTriggeredDeposit.current) {
      hasTriggeredDeposit.current = true;
      refetchAllowance();
      // Small delay to ensure allowance is updated
      const timer = setTimeout(() => {
        deposit();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [approveSuccess, deposit, refetchAllowance]);

  const handlePay = async () => {
    if (!link) return;

    // Update status to depositing
    await fetch(`/api/links/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: PAYMENT_STATUS.DEPOSITING,
        payerAddress: address,
      }),
    });

    if (needsApproval) {
      approve();
    } else {
      deposit();
    }
  };

  // Copy link to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(paymentUrl);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="animate-pulse text-gray-500">Loading payment...</div>
      </div>
    );
  }

  if (error && !link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg" />
            <span className="font-bold text-xl">StackPay</span>
          </Link>
          <ConnectWallet />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        {/* Just Created Banner */}
        {justCreated && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
              Payment Link Created!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              Share this link with your payer. They can pay using any Ethereum wallet.
            </p>
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowQR(!showQR)}
                className="px-3 py-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 text-sm rounded-lg"
              >
                {showQR ? 'Hide QR' : 'Show QR'}
              </button>
            </div>
            {showQR && (
              <div className="mt-4 p-4 bg-white rounded-lg inline-block">
                <QRCode value={paymentUrl} size={200} />
              </div>
            )}
          </div>
        )}

        {/* Payment Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-orange-500 to-purple-600 text-white">
            <p className="text-sm opacity-80 mb-1">Payment Request</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{link?.amount}</span>
              <span className="text-xl">USDC</span>
            </div>
            {link?.memo && (
              <p className="mt-2 text-sm opacity-90">{link.memo}</p>
            )}
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            {/* Recipient */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Recipient (Stacks Testnet)</p>
              <a
                href={getStacksExplorerUrl(link?.recipientAddress || '', true)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-blue-600 hover:underline break-all"
              >
                {link?.recipientAddress}
              </a>
            </div>

            {/* Bridge Info */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sepolia USDC</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="text-purple-600 font-medium">Stacks USDCx</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                via Circle xReserve Bridge (~{BRIDGE.ESTIMATED_PEGIN_MINUTES} min)
              </p>
            </div>

            {/* Wallet Balance */}
            {isConnected && balance !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Your Sepolia USDC Balance</span>
                <span className={hasSufficientBalance ? 'text-green-600' : 'text-red-600'}>
                  {formatUnits(balance, BRIDGE.USDC_DECIMALS)} USDC
                </span>
              </div>
            )}

            {/* Error Message */}
            {(error || paymentError) && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error || paymentError}</p>
              </div>
            )}

            {/* Wrong Network Warning */}
            {isWrongNetwork && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                  Please switch to Sepolia testnet
                </p>
                <button
                  onClick={() => switchChain({ chainId: sepolia.id })}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded"
                >
                  Switch Network
                </button>
              </div>
            )}

            {/* Insufficient Balance Warning */}
            {isConnected && !hasSufficientBalance && balance !== undefined && (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Insufficient USDC balance. You need at least {link?.amount} USDC.
                </p>
                <a
                  href={`https://faucet.circle.com/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-600 hover:underline mt-1 inline-block"
                >
                  Get testnet USDC from Circle Faucet
                </a>
              </div>
            )}
          </div>

          {/* Action */}
          <div className="p-6 pt-0">
            {!isConnected ? (
              <div className="space-y-3">
                <p className="text-center text-sm text-gray-500 mb-3">
                  Connect your Ethereum wallet to pay
                </p>
                <ConnectWallet />
              </div>
            ) : isWrongNetwork ? (
              <button
                onClick={() => switchChain({ chainId: sepolia.id })}
                className="w-full py-4 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg"
              >
                Switch to Sepolia
              </button>
            ) : (
              <button
                onClick={handlePay}
                disabled={!hasSufficientBalance || isApproving || isDepositing}
                className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all"
              >
                {isApproving
                  ? 'Approving USDC...'
                  : isDepositing
                  ? 'Processing Payment...'
                  : needsApproval
                  ? `Approve & Pay ${link?.amount} USDC`
                  : `Pay ${link?.amount} USDC`}
              </button>
            )}
          </div>
        </div>

        {/* Help Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need testnet tokens?{' '}
          <a
            href="https://faucet.circle.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Circle USDC Faucet
          </a>
          {' | '}
          <a
            href="https://sepoliafaucet.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Sepolia ETH Faucet
          </a>
        </p>
      </main>
    </div>
  );
}
