"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useLocale } from "@/app/providers";
import type { HistoryMint, HistoryResponse } from "@/lib/api";
import { CONTRACT_ADDRESS, TIERS, ZKE_ABI } from "@/lib/contract";
import { t } from "@/lib/i18n";

export default function History({
  history,
  finalized,
  isConnected,
  loading = false,
  onClaimed,
}: {
  history?: HistoryResponse | null;
  finalized: boolean;
  isConnected: boolean;
  loading?: boolean;
  onClaimed?: () => void;
}) {
  const { locale } = useLocale();
  const [claimError, setClaimError] = useState<string | null>(null);
  const { writeContractAsync, data: claimHash, isPending } = useWriteContract();
  const { isLoading: isClaiming, isSuccess } = useWaitForTransactionReceipt({ hash: claimHash });

  useEffect(() => {
    if (isSuccess) {
      onClaimed?.();
    }
  }, [isSuccess, onClaimed]);

  async function handleClaim() {
    try {
      setClaimError(null);
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ZKE_ABI,
        functionName: "claim",
      });
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Claim failed");
    }
  }

  return (
    <section id="history" className="px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="glass-card overflow-hidden p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Wallet</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{t(locale, "history_title")}</h2>
            </div>
            {history && (
              <div className="font-mono text-sm text-gray-400">
                {history.mintCount.toLocaleString()} mints / {history.totalTokens.toLocaleString()} ZKE
              </div>
            )}
          </div>

          {!isConnected ? (
            <div className="rounded-xl border border-white/5 bg-white/[0.03] px-5 py-8 text-center text-gray-400">
              {t(locale, "history_connect")}
            </div>
          ) : loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-14 animate-pulse rounded-xl bg-white/[0.05]" />
              ))}
            </div>
          ) : !history || history.mints.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-white/[0.03] px-5 py-8 text-center text-gray-400">
              {t(locale, "history_empty")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    <th className="px-3 font-medium">{t(locale, "history_time")}</th>
                    <th className="px-3 font-medium">{t(locale, "history_tier")}</th>
                    <th className="px-3 font-medium">{t(locale, "history_multiplier")}</th>
                    <th className="px-3 font-medium">{t(locale, "history_tokens")}</th>
                    <th className="px-3 font-medium">{t(locale, "history_status")}</th>
                    <th className="px-3 font-medium">{t(locale, "history_tx")}</th>
                    <th className="px-3 text-right font-medium">{t(locale, "history_claim")}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.mints.map((mint) => (
                    <HistoryRow
                      key={mint.id}
                      finalized={finalized}
                      isClaiming={isPending || isClaiming}
                      locale={locale}
                      mint={mint}
                      onClaim={handleClaim}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {claimError && (
            <div className="mt-4 rounded-xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/8 px-4 py-3 text-sm text-[#ff8787]">
              {claimError}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function HistoryRow({
  mint,
  finalized,
  isClaiming,
  locale,
  onClaim,
}: {
  mint: HistoryMint;
  finalized: boolean;
  isClaiming: boolean;
  locale: "en" | "zh";
  onClaim: () => void;
}) {
  const tier = TIERS[mint.tier];
  const statusKey: "history_claimed" | "history_claimable" | "history_pending" = mint.claimed
    ? "history_claimed"
    : finalized
      ? "history_claimable"
      : "history_pending";
  const canClaim = finalized && !mint.claimed;

  return (
    <tr className="rounded-xl bg-white/[0.025] text-sm text-gray-300">
      <td className="rounded-l-xl border-y border-l border-white/5 px-3 py-4">{formatTime(mint.timestamp, locale)}</td>
      <td className="border-y border-white/5 px-3 py-4">
        <span className={`font-mono font-semibold tier-${mint.tier}`}>
          {tier?.emoji ?? "-"} {mint.tier}
        </span>
      </td>
      <td className="border-y border-white/5 px-3 py-4 font-mono">{mint.multiplier.toFixed(1)}x</td>
      <td className="border-y border-white/5 px-3 py-4 font-mono text-primary-400">
        {mint.tokens.toLocaleString()} ZKE
      </td>
      <td className="border-y border-white/5 px-3 py-4">
        <span className={mint.claimed ? "text-gray-500" : finalized ? "text-[#51cf66]" : "text-[#fcc419]"}>
          {t(locale, statusKey)}
        </span>
      </td>
      <td className="border-y border-white/5 px-3 py-4">
        {mint.txHash ? (
          <a
            className="font-mono text-primary-400 transition-colors hover:text-white"
            href={`https://etherscan.io/tx/${mint.txHash}`}
            rel="noreferrer"
            target="_blank"
          >
            {shortHash(mint.txHash)}
          </a>
        ) : (
          <span className="text-gray-600">-</span>
        )}
      </td>
      <td className="rounded-r-xl border-y border-r border-white/5 px-3 py-4 text-right">
        <button
          type="button"
          onClick={onClaim}
          disabled={!canClaim || isClaiming}
          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-primary-400 disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:border-white/10"
        >
          {isClaiming && canClaim ? "..." : t(locale, "history_claim")}
        </button>
      </td>
    </tr>
  );
}

function formatTime(timestamp: number, locale: "en" | "zh"): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp * 1000));
}

function shortHash(hash: string): string {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}
