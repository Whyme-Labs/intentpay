// StackPay Links - TypeScript Types

import { PaymentStatus } from './constants';

// Payment link data structure
export interface PaymentLink {
  id: string;
  recipientAddress: string;
  amount: string;
  memo?: string;
  status: PaymentStatus;
  ethTxHash?: string;
  stacksTxId?: string;
  payerAddress?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// API request/response types
export interface CreatePaymentLinkRequest {
  recipientAddress: string;
  amount: string;
  memo?: string;
}

export interface CreatePaymentLinkResponse {
  success: boolean;
  link?: PaymentLink;
  error?: string;
}

export interface GetPaymentLinkResponse {
  success: boolean;
  link?: PaymentLink;
  error?: string;
}

export interface UpdatePaymentLinkRequest {
  status?: PaymentStatus;
  ethTxHash?: string;
  stacksTxId?: string;
  payerAddress?: string;
}

export interface UpdatePaymentLinkResponse {
  success: boolean;
  link?: PaymentLink;
  error?: string;
}

// Database row type (snake_case as stored in D1)
export interface PaymentLinkRow {
  id: string;
  recipient_address: string;
  amount: string;
  memo: string | null;
  status: string;
  eth_tx_hash: string | null;
  stacks_tx_id: string | null;
  payer_address: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

// Convert database row to PaymentLink
export function rowToPaymentLink(row: PaymentLinkRow): PaymentLink {
  return {
    id: row.id,
    recipientAddress: row.recipient_address,
    amount: row.amount,
    memo: row.memo || undefined,
    status: row.status as PaymentStatus,
    ethTxHash: row.eth_tx_hash || undefined,
    stacksTxId: row.stacks_tx_id || undefined,
    payerAddress: row.payer_address || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at || undefined,
  };
}
