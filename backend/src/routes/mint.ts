import { Router } from "express";
import { isAddress } from "ethers";
import { getLatestBlockEntropy } from "../services/contract";
import { insertMint } from "../services/db";
import { generateProof } from "../services/proof";
import { assertUint256String, getTierRaw, mapTier, poseidonHash, toDecimalString } from "../utils/entropy";
import type { ErrorResponse, MintRequest, MintResponse } from "../types";

const router = Router();
const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;

router.post<"/", Record<string, never>, MintResponse | ErrorResponse, MintRequest>("/", async (req, res, next) => {
  try {
    const { address, salt } = req.body;

    if (!address || !isAddress(address)) {
      return res.status(400).json({ success: false, error: "Invalid wallet address" });
    }

    if (!salt) {
      return res.status(400).json({ success: false, error: "Missing salt" });
    }

    assertUint256String(salt, "salt");
    enforceAddressRateLimit(address);

    const { entropy, blockNumber } = await getLatestBlockEntropy();
    const normalizedSalt = toDecimalString(salt);
    const hash = await poseidonHash(entropy, normalizedSalt);
    const tierRaw = getTierRaw(hash);
    const tierInfo = mapTier(tierRaw);
    const proofResult = await generateProof(entropy, normalizedSalt);

    insertMint({
      address,
      salt: normalizedSalt,
      entropy,
      tier: tierInfo.tier,
      multiplier: tierInfo.multiplier,
      tokens: tierInfo.tokens,
      proof: proofResult.proof,
      blockNumber,
    });

    return res.json({
      success: true,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals,
      tier: tierInfo.tier,
      multiplier: tierInfo.multiplier,
      tokens: tierInfo.tokens,
      entropy,
    });
  } catch (error) {
    return next(error);
  }
});

function enforceAddressRateLimit(address: string): void {
  const key = address.toLowerCase();
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    throw new Error("Rate limit exceeded. Try again in one minute.");
  }

  recent.push(now);
  requestLog.set(key, recent);
}

export default router;
