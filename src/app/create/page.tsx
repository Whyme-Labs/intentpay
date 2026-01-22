'use client';

// StackPay Links - Create Payment Link Page
// Merchant creates a payment link with their Stacks address and amount

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isValidStacksAddress } from '@/lib/stacks';
import { BRIDGE } from '@/lib/constants';
import type { CreatePaymentLinkResponse } from '@/lib/types';

export default function CreatePaymentLinkPage() {
  const router = useRouter();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidAddress = recipientAddress.length === 0 || isValidStacksAddress(recipientAddress);
  const isValidAmount = amount.length === 0 || (parseFloat(amount) >= BRIDGE.MIN_DEPOSIT_USDC);
  const canSubmit = isValidStacksAddress(recipientAddress) && parseFloat(amount) >= BRIDGE.MIN_DEPOSIT_USDC;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientAddress, amount, memo: memo || undefined }),
      });

      const data: CreatePaymentLinkResponse = await response.json();

      if (!data.success || !data.link) {
        throw new Error(data.error || 'Failed to create payment link');
      }

      // Redirect to the payment page for sharing
      router.push(`/pay/${data.link.id}?created=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Payment Link</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate a link to receive USDC payments bridged to USDCx on Stacks
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Address */}
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium mb-2">
              Your Stacks Address (Testnet)
            </label>
            <input
              id="recipient"
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
              className={`w-full px-4 py-3 rounded-lg border ${
                !isValidAddress
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
              } focus:ring-2 focus:border-transparent bg-white dark:bg-gray-800 font-mono text-sm`}
            />
            {!isValidAddress && (
              <p className="mt-1 text-sm text-red-500">
                Please enter a valid Stacks address (starts with ST or SP)
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This is where USDCx will be delivered on Stacks testnet
            </p>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount (USDC)
            </label>
            <div className="relative">
              <input
                id="amount"
                type="number"
                step="0.01"
                min={BRIDGE.MIN_DEPOSIT_USDC}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10.00"
                className={`w-full px-4 py-3 pr-16 rounded-lg border ${
                  !isValidAmount
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent bg-white dark:bg-gray-800`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                USDC
              </span>
            </div>
            {!isValidAmount && (
              <p className="mt-1 text-sm text-red-500">
                Minimum amount is {BRIDGE.MIN_DEPOSIT_USDC} USDC
              </p>
            )}
          </div>

          {/* Memo */}
          <div>
            <label htmlFor="memo" className="block text-sm font-medium mb-2">
              Memo (Optional)
            </label>
            <input
              id="memo"
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Coffee order #1031"
              maxLength={100}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
            />
            <p className="mt-1 text-xs text-gray-500">
              Add context for the payment (shown to payer)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">How it works</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>1. Share the payment link with your payer</li>
              <li>2. Payer connects their Ethereum wallet and pays in USDC</li>
              <li>3. USDC is bridged via Circle xReserve (~{BRIDGE.ESTIMATED_PEGIN_MINUTES} min)</li>
              <li>4. You receive USDCx on Stacks testnet</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isSubmitting ? 'Creating...' : 'Create Payment Link'}
          </button>
        </form>
      </main>
    </div>
  );
}
