// StackPay Links - Create Payment Link API
// POST /api/links - Create a new payment link

import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isValidStacksAddress } from '@/lib/stacks';
import { BRIDGE, PAYMENT_STATUS } from '@/lib/constants';
import type { CreatePaymentLinkRequest, CreatePaymentLinkResponse, PaymentLinkRow, PaymentLink } from '@/lib/types';
import { rowToPaymentLink } from '@/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse<CreatePaymentLinkResponse>> {
  try {
    const body: CreatePaymentLinkRequest = await request.json();
    const { recipientAddress, amount, memo } = body;

    // Validate recipient address
    if (!recipientAddress || !isValidStacksAddress(recipientAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Stacks address' },
        { status: 400 }
      );
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < BRIDGE.MIN_DEPOSIT_USDC) {
      return NextResponse.json(
        { success: false, error: `Minimum amount is ${BRIDGE.MIN_DEPOSIT_USDC} USDC` },
        { status: 400 }
      );
    }

    // Generate unique ID
    const id = nanoid(10);

    // Get D1 database binding
    const { env } = await getCloudflareContext();
    const db = env.DB;

    if (!db) {
      // Fallback for local development without D1
      const link: PaymentLink = {
        id,
        recipientAddress,
        amount,
        memo,
        status: PAYMENT_STATUS.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, link });
    }

    // Insert into database
    await db.prepare(
      `INSERT INTO payment_links (id, recipient_address, amount, memo, status)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(id, recipientAddress, amount, memo || null, PAYMENT_STATUS.PENDING)
      .run();

    // Fetch the created link
    const result = await db.prepare(
      `SELECT * FROM payment_links WHERE id = ?`
    )
      .bind(id)
      .first<PaymentLinkRow>();

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to create payment link' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      link: rowToPaymentLink(result),
    });
  } catch (error) {
    console.error('Error creating payment link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/links - List all payment links (for merchant dashboard)
export async function GET(): Promise<NextResponse> {
  try {
    const { env } = await getCloudflareContext();
    const db = env.DB;

    if (!db) {
      return NextResponse.json({ success: true, links: [] });
    }

    const result = await db.prepare(
      `SELECT * FROM payment_links ORDER BY created_at DESC LIMIT 100`
    ).all<PaymentLinkRow>();

    const links = result.results.map(rowToPaymentLink);

    return NextResponse.json({ success: true, links });
  } catch (error) {
    console.error('Error listing payment links:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
