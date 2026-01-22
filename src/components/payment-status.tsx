'use client';

// StackPay Links - Payment Status Component
// Displays the current status of a payment with progress visualization

import { PAYMENT_STATUS, type PaymentStatus, BRIDGE } from '@/lib/constants';

interface PaymentStatusDisplayProps {
  status: PaymentStatus;
  txHash?: string;
  stacksTxId?: string;
}

const STATUS_CONFIG = {
  [PAYMENT_STATUS.PENDING]: {
    label: 'Awaiting Payment',
    description: 'Waiting for payer to connect wallet and confirm transaction',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    step: 0,
  },
  [PAYMENT_STATUS.DEPOSITING]: {
    label: 'Processing Deposit',
    description: 'Approving USDC and depositing to xReserve bridge',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    step: 1,
  },
  [PAYMENT_STATUS.CONFIRMING]: {
    label: 'Confirming on Sepolia',
    description: 'Waiting for transaction confirmation on Ethereum Sepolia',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    step: 2,
  },
  [PAYMENT_STATUS.BRIDGING]: {
    label: 'Bridging to Stacks',
    description: `USDCx will be minted on Stacks in ~${BRIDGE.ESTIMATED_PEGIN_MINUTES} minutes`,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    step: 3,
  },
  [PAYMENT_STATUS.COMPLETED]: {
    label: 'Payment Complete',
    description: 'USDCx has been successfully delivered to the merchant',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    step: 4,
  },
  [PAYMENT_STATUS.FAILED]: {
    label: 'Payment Failed',
    description: 'Something went wrong. Please try again or contact support.',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    step: -1,
  },
};

const STEPS = ['Created', 'Depositing', 'Confirming', 'Bridging', 'Complete'];

export function PaymentStatusDisplay({ status, txHash, stacksTxId }: PaymentStatusDisplayProps) {
  const config = STATUS_CONFIG[status];
  const currentStep = config.step;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor} mb-6`}>
        <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} ${status === PAYMENT_STATUS.BRIDGING || status === PAYMENT_STATUS.DEPOSITING || status === PAYMENT_STATUS.CONFIRMING ? 'animate-pulse' : ''}`} />
        <span className={`font-semibold ${config.color}`}>{config.label}</span>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentStep >= index
                  ? 'bg-green-500 text-white'
                  : currentStep === index - 1 && status !== PAYMENT_STATUS.FAILED
                  ? 'bg-blue-500 text-white animate-pulse'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > index ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className="mt-2 text-xs text-gray-500">{step}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{config.description}</p>

      {/* Transaction Links */}
      <div className="space-y-2">
        {txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <span>View on Sepolia Etherscan</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        {stacksTxId && (
          <a
            href={`https://explorer.hiro.so/txid/${stacksTxId}?chain=testnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-purple-600 hover:text-purple-700"
          >
            <span>View on Stacks Explorer</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
