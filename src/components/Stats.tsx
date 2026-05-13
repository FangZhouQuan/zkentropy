"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/app/providers";
import type { ApiStatus } from "@/lib/api";
import { MAX_MINTS } from "@/lib/contract";
import { t } from "@/lib/i18n";

const fallbackStatus: ApiStatus = {
  totalMinted: 0,
  maxMints: MAX_MINTS,
  remaining: MAX_MINTS,
  poolETH: "0",
  uniqueMinters: 0,
  finalized: false,
  contractAddress: "0x0000000000000000000000000000000000000000",
};

export default function Stats({ status, loading = false }: { status?: ApiStatus | null; loading?: boolean }) {
  const { locale } = useLocale();
  const data = status ?? fallbackStatus;
  const progress = data.maxMints > 0 ? (data.totalMinted / data.maxMints) * 100 : 0;

  const stats = [
    { label: t(locale, "stats_minted"), value: formatNumber(data.totalMinted), detail: `${progress.toFixed(1)}%` },
    { label: t(locale, "stats_remaining"), value: formatNumber(data.remaining), detail: "until close" },
    { label: t(locale, "stats_pool"), value: `${formatEth(data.poolETH)} ETH`, detail: "liquidity" },
    { label: t(locale, "stats_holders"), value: formatNumber(data.uniqueMinters), detail: "wallets" },
  ];

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              className="glass-card p-5"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">{item.label}</p>
              {loading ? (
                <div className="mt-5 space-y-3">
                  <div className="h-8 w-28 animate-pulse rounded-lg bg-white/10" />
                  <div className="h-3 w-16 animate-pulse rounded-full bg-white/5" />
                </div>
              ) : (
                <div className="mt-4 flex items-end justify-between gap-3">
                  <span className="text-2xl font-semibold text-white md:text-3xl">{item.value}</span>
                  <span className="text-xs text-[#748ffc]">{item.detail}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="glass-card mt-5 p-5"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-gray-400">{t(locale, "stats_progress")}</span>
            <span className="font-mono text-[#748ffc]">
              {loading ? "--" : `${formatNumber(data.totalMinted)} / ${formatNumber(data.maxMints)}`}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#25262B]">
            {loading ? (
              <div className="h-full w-1/3 animate-pulse rounded-full bg-white/10" />
            ) : (
              <motion.div
                className="progress-bar h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.max(progress, 0)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatEth(value: string): string {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0.0000";
  return parsed.toFixed(4);
}
