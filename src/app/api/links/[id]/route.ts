// StackPay Links - Single Payment Link API
// GET /api/links/[id] - Get a payment link by ID
// PATCH /api/links/[id] - Update a payment link

import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { PAYMENT_STATUS } from '@/lib/constants';
import type { GetPaymentLinkResponse, UpdatePaymentLinkRequest, UpdatePaymentLinkResponse, PaymentLinkRow } from '@/lib/types';
import { rowToPaymentLink } from '@/lib/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<GetPaymentLinkResponse>> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Payment link ID is required' },
        { status: 400 }
      );
    }

    const { env } = await getCloudflareContext();
    const db = env.DB;

    if (!db) {
      // Return mock data for local development
      return NextResponse.json({
        success: true,
        link: {
          id,
          recipientAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          amount: '10',
          memo: 'Test payment',
          status: PAYMENT_STATUS.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    const result = await db.prepare(
      `SELECT * FROM payment_links WHERE id = ?`
    )
      .bind(id)
      .first<PaymentLinkRow>();

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Payment link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      link: rowToPaymentLink(result),
    });
  } catch (error) {
    console.error('Error fetching payment link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<UpdatePaymentLinkResponse>> {
  try {
    const { id } = await params;
    const body: UpdatePaymentLinkRequest = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Payment link ID is required' },
        { status: 400 }
      );
    }

    const { env } = await getCloudflareContext();
    const db = env.DB;

    if (!db) {
      // Return mock update for local development
      return NextResponse.json({
        success: true,
        link: {
          id,
          recipientAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          amount: '10',
          status: body.status || PAYMENT_STATUS.PENDING,
          ethTxHash: body.ethTxHash,
          stacksTxId: body.stacksTxId,
          payerAddress: body.payerAddress,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: (string | null)[] = [];

    if (body.status) {
      updates.push('status = ?');
      values.push(body.status);

      // Set completed_at if status is completed
      if (body.status === PAYMENT_STATUS.COMPLETED) {
        updates.push("completed_at = datetime('now')");
      }
    }

    if (body.ethTxHash !== undefined) {
      updates.push('eth_tx_hash = ?');
      values.push(body.ethTxHash || null);
    }

    if (body.stacksTxId !== undefined) {
      updates.push('stacks_tx_id = ?');
      values.push(body.stacksTxId || null);
    }

    if (body.payerAddress !== undefined) {
      updates.push('payer_address = ?');
      values.push(body.payerAddress || null);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Add ID to values
    values.push(id);

    await db.prepare(
      `UPDATE payment_links SET ${updates.join(', ')} WHERE id = ?`
    )
      .bind(...values)
      .run();

    // Fetch updated link
    const result = await db.prepare(
      `SELECT * FROM payment_links WHERE id = ?`
    )
      .bind(id)
      .first<PaymentLinkRow>();

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Payment link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      link: rowToPaymentLink(result),
    });
  } catch (error) {
    console.error('Error updating payment link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
