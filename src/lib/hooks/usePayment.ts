'use client';

// StackPay Links - Payment Hook
// Handles the complete payment flow: approve USDC → deposit to xReserve

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS, BRIDGE } from '@/lib/constants';
import { USDC_ABI, XRESERVE_ABI } from '@/lib/contracts';
import { encodeStacksAddressToBytes32 } from '@/lib/stacks';

export type PaymentStep = 'idle' | 'approving' | 'approved' | 'depositing' | 'deposited' | 'error';

interface UsePaymentOptions {
  recipientStacksAddress: string;
  amountUsdc: string;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function usePayment({ recipientStacksAddress, amountUsdc, onSuccess, onError }: UsePaymentOptions) {
  const { address } = useAccount();
  const [step, setStep] = useState<PaymentStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>();
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}` | undefined>();

  // Parse amount to USDC decimals (6)
  const amountInUnits = parseUnits(amountUsdc || '0', BRIDGE.USDC_DECIMALS);

  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.USDC_SEPOLIA,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.XRESERVE_SEPOLIA] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read USDC balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.USDC_SEPOLIA,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Approve contract
  const { writeContract: writeApprove, isPending: isApproving } = useWriteContract();

  // Deposit contract
  const { writeContract: writeDeposit, isPending: isDepositing } = useWriteContract();

  // Wait for approve transaction
  const { isLoading: isWaitingApprove, isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  // Wait for deposit transaction
  const { isLoading: isWaitingDeposit, isSuccess: depositSuccess } = useWaitForTransactionReceipt({
    hash: depositTxHash,
  });

  // Check if approval is needed
  const needsApproval = allowance !== undefined && allowance < amountInUnits;

  // Check if balance is sufficient
  const hasSufficientBalance = balance !== undefined && balance >= amountInUnits;

  // Approve USDC spending
  const approve = useCallback(async () => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setStep('approving');
    setError(null);

    try {
      writeApprove(
        {
          address: CONTRACTS.USDC_SEPOLIA,
          abi: USDC_ABI,
          functionName: 'approve',
          args: [CONTRACTS.XRESERVE_SEPOLIA, amountInUnits],
        },
        {
          onSuccess: (hash) => {
            setApproveTxHash(hash);
          },
          onError: (err) => {
            setStep('error');
            setError(err.message);
            onError?.(err);
          },
        }
      );
    } catch (err) {
      setStep('error');
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message);
      onError?.(error);
    }
  }, [address, amountInUnits, writeApprove, onError]);

  // Deposit to xReserve
  const deposit = useCallback(async () => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setStep('depositing');
    setError(null);

    try {
      const remoteRecipient = encodeStacksAddressToBytes32(recipientStacksAddress);

      writeDeposit(
        {
          address: CONTRACTS.XRESERVE_SEPOLIA,
          abi: XRESERVE_ABI,
          functionName: 'depositToRemote',
          args: [
            amountInUnits, // value (amount in 6 decimals) - MUST BE FIRST
            BRIDGE.STACKS_REMOTE_DOMAIN, // remoteDomain for Stacks
            remoteRecipient, // bytes32 encoded Stacks address
            CONTRACTS.USDC_SEPOLIA, // USDC token address
            BigInt(0), // maxFee (0 for demo, bridge will use default)
            '0x' as `0x${string}`, // hookData (empty for v1)
          ],
          gas: BigInt(500000), // explicit gas limit
        },
        {
          onSuccess: (hash) => {
            setDepositTxHash(hash);
            setStep('deposited');
            onSuccess?.(hash);
          },
          onError: (err) => {
            setStep('error');
            setError(err.message);
            onError?.(err);
          },
        }
      );
    } catch (err) {
      setStep('error');
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message);
      onError?.(error);
    }
  }, [address, recipientStacksAddress, amountInUnits, writeDeposit, onSuccess, onError]);

  // Main pay function - handles approval if needed, then deposits
  const pay = useCallback(async () => {
    if (needsApproval) {
      await approve();
    } else {
      await deposit();
    }
  }, [needsApproval, approve, deposit]);

  // Effect: After approval succeeds, proceed to deposit
  // This is handled in the component that uses this hook

  return {
    // State
    step,
    error,
    approveTxHash,
    depositTxHash,
    needsApproval,
    hasSufficientBalance,
    allowance,
    balance,

    // Loading states
    isApproving: isApproving || isWaitingApprove,
    isDepositing: isDepositing || isWaitingDeposit,
    approveSuccess,
    depositSuccess,

    // Actions
    approve,
    deposit,
    pay,
    refetchAllowance,
    refetchBalance,

    // Reset
    reset: () => {
      setStep('idle');
      setError(null);
      setApproveTxHash(undefined);
      setDepositTxHash(undefined);
    },
  };
}
