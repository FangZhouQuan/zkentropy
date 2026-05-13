"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useLocale } from "@/app/providers";
import { requestMint, type MintApiResponse } from "@/lib/api";
import { BASE_TOKENS_PER_MINT, CONTRACT_ADDRESS, MAX_MINTS, MINT_PRICE, TIERS, ZKE_ABI } from "@/lib/contract";
import { t } from "@/lib/i18n";

type MintStatus = "idle" | "proving" | "sending" | "confirming" | "success" | "error";

export default function MintSection({
  totalMinted = 0,
  onMintComplete,
}: {
  totalMinted?: number;
  onMintComplete?: () => void;
}) {
  const { locale } = useLocale();
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<MintStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [proofResult, setProofResult] = useState<MintApiResponse | null>(null);
  const soldOut = totalMinted >= MAX_MINTS;
  const isBusy = status === "proving" || status === "sending" || status === "confirming";
  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (txHash && (isConfirming || status === "sending")) {
      setStatus("confirming");
    }
  }, [isConfirming, status, txHash]);

  useEffect(() => {
    if (isSuccess) {
      setStatus("success");
      onMintComplete?.();
    }
  }, [isSuccess, onMintComplete]);

  const statusCopy = useMemo(() => {
    if (status === "proving") return t(locale, "mint_status_proving");
    if (status === "sending" || isPending) return t(locale, "mint_status_sending");
    if (status === "confirming") return t(locale, "mint_status_confirming");
    if (status === "success") return t(locale, "mint_status_success");
    if (status === "error") return t(locale, "mint_status_error");
    return "";
  }, [isPending, locale, status]);

  async function handleMint() {
    if (!address) return;

    try {
      setError(null);
      setProofResult(null);
      setStatus("proving");

      const salt = Math.floor(Math.random() * 2 ** 32).toString();
      const result = await requestMint(address, salt);
      setProofResult(result);
      setStatus("sending");

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ZKE_ABI,
        functionName: "mint",
        args: [
          toUintTuple(result.proof.a),
          [
            toUintTuple(result.proof.b[0]),
            toUintTuple(result.proof.b[1]),
          ],
          toUintTuple(result.proof.c),
          BigInt(result.publicSignals[0] ?? result.entropy),
          BigInt(result.publicSignals[1] ?? result.tier),
        ],
        value: parseEther("0.0025"),
      });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Mint failed");
    }
  }

  return (
    <section id="mint" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">{t(locale, "mint_title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">{t(locale, "mint_subtitle")}</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            className="glass-card relative overflow-hidden p-7 sm:p-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {status === "success" && <Confetti />}
            <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-gradient-to-bl from-[#5c7cfa]/16 to-transparent" />

            <div className="relative z-10">
              <div className="mb-7 flex items-center justify-between gap-4">
                <span className="text-sm text-gray-400">{t(locale, "mint_price")}</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-semibold text-white">{MINT_PRICE}</span>
                  <span className="text-gray-500">ETH</span>
                </div>
              </div>

              <div className="mb-7 rounded-xl border border-white/5 bg-[#1A1B1E] p-5">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">{t(locale, "mint_base")}</div>
                <div className="font-mono text-sm text-gray-300">
                  {BASE_TOKENS_PER_MINT.toLocaleString()} ZKE x (0.8x - 2.0x)
                </div>
              </div>

              {status !== "idle" && (
                <div className="mb-5 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    {isBusy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#748ffc] border-t-transparent" />}
                    <span className={status === "error" ? "text-sm font-medium text-[#ff6b6b]" : "text-sm font-medium text-white"}>
                      {statusCopy}
                    </span>
                  </div>

                  {status === "sending" && <p className="mt-2 text-xs text-gray-500">{t(locale, "mint_wallet_prompt")}</p>}
                  {status === "confirming" && <p className="mt-2 text-xs text-gray-500">{t(locale, "mint_confirm_prompt")}</p>}

                  {status === "success" && proofResult && (
                    <div className="mt-3 rounded-lg bg-[#1A1B1E] p-3 text-sm text-gray-300">
                      <span className="text-lg">{tierSymbol(proofResult.tier)}</span>{" "}
                      {t(locale, "mint_result_prefix")}{" "}
                      <span className="font-mono text-primary-400">{proofResult.tokens.toLocaleString()} ZKE</span>
                    </div>
                  )}

                  {status === "error" && error && <p className="mt-2 text-xs text-[#ff8787]">{error}</p>}
                </div>
              )}

              {soldOut ? (
                <button className="h-13 w-full rounded-xl bg-[#25262B] px-5 py-4 font-semibold text-gray-500" disabled type="button">
                  {t(locale, "mint_sold_out")}
                </button>
              ) : !isConnected ? (
                <button className="h-13 w-full rounded-xl bg-[#25262B] px-5 py-4 font-semibold text-gray-500" disabled type="button">
                  {t(locale, "mint_connect_first")}
                </button>
              ) : status === "error" ? (
                <button type="button" onClick={handleMint} className="btn-glow h-13 w-full rounded-xl px-5 py-4 font-semibold text-white">
                  {t(locale, "mint_retry")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleMint}
                  disabled={isBusy}
                  className="btn-glow h-13 w-full rounded-xl px-5 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? statusCopy : t(locale, "mint_btn")}
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            className="glass-card p-7 sm:p-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-lg font-semibold text-white">{t(locale, "tier_title")}</h3>
            <div className="space-y-3">
              {TIERS.map((tier, index) => (
                <div key={tier.multiplier} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <span className={`w-14 font-mono font-semibold tier-${index}`}>{tier.multiplier}x</span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="truncate text-sm text-gray-300">{locale === "zh" ? tier.labelZh : tier.label}</span>
                      <span className="font-mono text-xs text-gray-500">{tier.probability}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#25262B]">
                      <div className="h-full rounded-full" style={{ width: `${tier.probability * 2}%`, backgroundColor: tier.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-white/5 bg-[#1A1B1E] p-4 text-center text-xs text-gray-500">
              {t(locale, "tier_ev")}: <span className="font-mono text-[#748ffc]">1.015x</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function toUintTuple(values: [string, string]): [bigint, bigint] {
  return [BigInt(values[0]), BigInt(values[1])];
}

function tierSymbol(tier: number): string {
  return TIERS[tier]?.emoji ?? "-";
}

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 14 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-2 w-2 rounded-full bg-primary-400"
          initial={{ opacity: 0, x: "50%", y: "50%", scale: 0.4 }}
          animate={{
            opacity: [0, 1, 0],
            x: `${20 + index * 5}%`,
            y: `${10 + (index % 5) * 16}%`,
            scale: [0.4, 1, 0.6],
          }}
          transition={{ duration: 1.4, delay: index * 0.03 }}
        />
      ))}
    </div>
  );
}
