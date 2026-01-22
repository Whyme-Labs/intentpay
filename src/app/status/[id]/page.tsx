'use client';

// StackPay Links - Status Page
// Shows real-time status of a payment as it bridges from Sepolia to Stacks

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { PaymentStatusDisplay } from '@/components/payment-status';
import { PAYMENT_STATUS, BRIDGE, CHAINS } from '@/lib/constants';
import { getStacksExplorerUrl } from '@/lib/stacks';
import type { PaymentLink, GetPaymentLinkResponse } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StatusPage({ params }: PageProps) {
  const { id } = use(params);
  const [link, setLink] = useState<PaymentLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch and poll payment status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/links/${id}`);
        const data: GetPaymentLinkResponse = await response.json();

        if (!data.success || !data.link) {
          throw new Error(data.error || 'Payment not found');
        }

        setLink(data.link);

        // If status is confirming, simulate progression to bridging after a delay
        // In production, this would poll the blockchain for confirmation
        if (data.link.status === PAYMENT_STATUS.CONFIRMING) {
          setTimeout(async () => {
            await fetch(`/api/links/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: PAYMENT_STATUS.BRIDGING }),
            });
          }, 5000);
        }

        // If status is bridging, simulate completion after bridge time
        // In production, this would poll the Stacks API for USDCx receipt
        if (data.link.status === PAYMENT_STATUS.BRIDGING) {
          // For demo, complete after 30 seconds instead of 15 minutes
          setTimeout(async () => {
            await fetch(`/api/links/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: PAYMENT_STATUS.COMPLETED }),
            });
          }, 30000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="animate-pulse text-gray-500">Loading status...</div>
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
          <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            Testnet
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Status</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tracking your cross-chain payment
          </p>
        </div>

        {/* Status Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <PaymentStatusDisplay
            status={link?.status || PAYMENT_STATUS.PENDING}
            txHash={link?.ethTxHash}
            stacksTxId={link?.stacksTxId}
          />
        </div>

        {/* Payment Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold">Payment Details</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-medium">{link?.amount} USDC</span>
            </div>
            {link?.memo && (
              <div className="flex justify-between">
                <span className="text-gray-500">Memo</span>
                <span>{link.memo}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Recipient</span>
              <a
                href={getStacksExplorerUrl(link?.recipientAddress || '', true)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-blue-600 hover:underline"
              >
                {link?.recipientAddress?.slice(0, 10)}...{link?.recipientAddress?.slice(-8)}
              </a>
            </div>
            {link?.payerAddress && (
              <div className="flex justify-between">
                <span className="text-gray-500">Payer</span>
                <a
                  href={`${CHAINS.SEPOLIA.blockExplorer}/address/${link.payerAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-blue-600 hover:underline"
                >
                  {link.payerAddress.slice(0, 6)}...{link.payerAddress.slice(-4)}
                </a>
              </div>
            )}
            {link?.ethTxHash && (
              <div className="flex justify-between">
                <span className="text-gray-500">Ethereum Tx</span>
                <a
                  href={`${CHAINS.SEPOLIA.blockExplorer}/tx/${link.ethTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-blue-600 hover:underline"
                >
                  {link.ethTxHash.slice(0, 10)}...{link.ethTxHash.slice(-8)}
                </a>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Created</span>
              <span className="text-sm">
                {link?.createdAt ? new Date(link.createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>
            {link?.completedAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Completed</span>
                <span className="text-sm">
                  {new Date(link.completedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Completion Actions */}
        {link?.status === PAYMENT_STATUS.COMPLETED && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Payment Successful!</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {link.amount} USDCx has been delivered to the recipient on Stacks testnet.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/create"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-purple-700"
              >
                Create Another Link
              </Link>
              <a
                href={getStacksExplorerUrl(link.recipientAddress, true)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                View on Stacks Explorer
              </a>
            </div>
          </div>
        )}

        {/* Info Box for pending/processing states */}
        {link?.status !== PAYMENT_STATUS.COMPLETED && link?.status !== PAYMENT_STATUS.FAILED && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              {link?.status === PAYMENT_STATUS.BRIDGING ? 'Bridge in Progress' : 'Processing Payment'}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {link?.status === PAYMENT_STATUS.BRIDGING
                ? `Your payment is being bridged to Stacks. This typically takes ~${BRIDGE.ESTIMATED_PEGIN_MINUTES} minutes on testnet. You can safely close this page - the payment will complete automatically.`
                : 'Your transaction is being processed. Please wait while we confirm the deposit.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
