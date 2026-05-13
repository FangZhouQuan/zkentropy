import { BASE_TOKENS_PER_MINT } from "../services/proof";
import type { TierInfo } from "../types";

type PoseidonFn = ((inputs: bigint[]) => unknown) & {
  F: {
    toString(value: unknown): string;
  };
};

const { buildPoseidon } = require("circomlibjs") as {
  buildPoseidon: () => Promise<PoseidonFn>;
};

let poseidonPromise: Promise<PoseidonFn> | null = null;

async function getPoseidon(): Promise<PoseidonFn> {
  poseidonPromise ??= buildPoseidon();
  return poseidonPromise;
}

export function assertUint256String(value: string, label: string): void {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${label} must be a uint256 decimal string`);
  }

  const parsed = BigInt(value);
  if (parsed < 0n || parsed > (1n << 256n) - 1n) {
    throw new Error(`${label} is outside uint256 range`);
  }
}

export function toDecimalString(value: string): string {
  return BigInt(value).toString();
}

export async function poseidonHash(entropy: string, salt: string): Promise<string> {
  const poseidon = await getPoseidon();
  const hash = poseidon([BigInt(entropy), BigInt(salt)]);
  return poseidon.F.toString(hash);
}

export function getTierRaw(hash: string): number {
  return Number(BigInt(hash) & 1023n);
}

export function mapTier(tierRaw: number): TierInfo {
  if (tierRaw >= 0 && tierRaw <= 152) return tierInfo(0, 0.8);
  if (tierRaw <= 407) return tierInfo(1, 0.9);
  if (tierRaw <= 713) return tierInfo(2, 1.0);
  if (tierRaw <= 917) return tierInfo(3, 1.2);
  if (tierRaw <= 999) return tierInfo(4, 1.5);
  if (tierRaw <= 1023) return tierInfo(5, 2.0);
  throw new Error("tier_raw is outside 10-bit range");
}

function tierInfo(tier: number, multiplier: number): TierInfo {
  return {
    tier,
    multiplier,
    tokens: Math.round(BASE_TOKENS_PER_MINT * multiplier),
  };
}
