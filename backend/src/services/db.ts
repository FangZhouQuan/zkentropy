import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import type { MintRecord, SolidityProof } from "../types";

const dataDir = path.resolve(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.DB_PATH ?? path.join(dataDir, "zkentropy.sqlite");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS mints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT NOT NULL,
  salt TEXT NOT NULL,
  entropy TEXT NOT NULL,
  tier INTEGER NOT NULL,
  multiplier REAL NOT NULL,
  tokens INTEGER NOT NULL,
  proof_a TEXT NOT NULL,
  proof_b TEXT NOT NULL,
  proof_c TEXT NOT NULL,
  tx_hash TEXT,
  block_number INTEGER,
  timestamp INTEGER DEFAULT (strftime('%s','now')),
  claimed INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_address ON mints(address);
CREATE INDEX IF NOT EXISTS idx_timestamp ON mints(timestamp);
`);

export function insertMint(input: {
  address: string;
  salt: string;
  entropy: string;
  tier: number;
  multiplier: number;
  tokens: number;
  proof: SolidityProof;
  blockNumber?: number;
}): number {
  const result = db
    .prepare(
      `INSERT INTO mints (
        address, salt, entropy, tier, multiplier, tokens, proof_a, proof_b, proof_c, block_number
      ) VALUES (
        @address, @salt, @entropy, @tier, @multiplier, @tokens, @proofA, @proofB, @proofC, @blockNumber
      )`
    )
    .run({
      address: input.address.toLowerCase(),
      salt: input.salt,
      entropy: input.entropy,
      tier: input.tier,
      multiplier: input.multiplier,
      tokens: input.tokens,
      proofA: JSON.stringify(input.proof.a),
      proofB: JSON.stringify(input.proof.b),
      proofC: JSON.stringify(input.proof.c),
      blockNumber: input.blockNumber ?? null,
    });

  return Number(result.lastInsertRowid);
}

export function getMintCount(): number {
  const row = db.prepare("SELECT COUNT(*) AS count FROM mints").get() as { count: number };
  return row.count;
}

export function getUniqueMinters(): number {
  const row = db.prepare("SELECT COUNT(DISTINCT lower(address)) AS count FROM mints").get() as { count: number };
  return row.count;
}

export function getHistory(address: string): MintRecord[] {
  return db
    .prepare("SELECT * FROM mints WHERE lower(address) = lower(?) ORDER BY timestamp DESC, id DESC")
    .all(address) as MintRecord[];
}

export function getTotalTokens(address: string): number {
  const row = db
    .prepare("SELECT COALESCE(SUM(tokens), 0) AS total FROM mints WHERE lower(address) = lower(?)")
    .get(address) as { total: number };
  return row.total;
}
