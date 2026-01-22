-- StackPay Links - D1 Database Schema
-- Stores payment link data for the cross-chain payment system

-- Payment links table
CREATE TABLE IF NOT EXISTS payment_links (
  id TEXT PRIMARY KEY,
  -- Merchant's Stacks address (recipient)
  recipient_address TEXT NOT NULL,
  -- Amount in USDC (stored as string to preserve precision)
  amount TEXT NOT NULL,
  -- Optional memo/description
  memo TEXT,
  -- Payment status: pending, depositing, confirming, bridging, completed, failed
  status TEXT NOT NULL DEFAULT 'pending',
  -- Ethereum transaction hash (when deposited)
  eth_tx_hash TEXT,
  -- Stacks transaction ID (when bridged)
  stacks_tx_id TEXT,
  -- Payer's Ethereum address
  payer_address TEXT,
  -- Timestamps
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);

-- Index for quick status lookups
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON payment_links(status);

-- Index for recipient address lookups
CREATE INDEX IF NOT EXISTS idx_payment_links_recipient ON payment_links(recipient_address);

-- Trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_payment_links_timestamp
  AFTER UPDATE ON payment_links
  FOR EACH ROW
BEGIN
  UPDATE payment_links SET updated_at = datetime('now') WHERE id = OLD.id;
END;
