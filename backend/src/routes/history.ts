import { Router } from "express";
import { isAddress } from "ethers";
import { getHistory, getTotalTokens } from "../services/db";

const router = Router();

router.get("/:address", (req, res, next) => {
  try {
    const { address } = req.params;

    if (!isAddress(address)) {
      return res.status(400).json({ success: false, error: "Invalid wallet address" });
    }

    const mints = getHistory(address).map((mint) => ({
      id: mint.id,
      tier: mint.tier,
      multiplier: mint.multiplier,
      tokens: mint.tokens,
      txHash: mint.tx_hash,
      timestamp: mint.timestamp,
      claimed: Boolean(mint.claimed),
    }));

    return res.json({
      address,
      mints,
      totalTokens: getTotalTokens(address),
      mintCount: mints.length,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
