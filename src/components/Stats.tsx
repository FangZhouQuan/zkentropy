"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/app/providers";
import { MAX_MINTS } from "@/lib/contract";
import { t } from "@/lib/i18n";

const TOTAL_MINTED = 1847;
const POOL_DEPTH = "4.62 ETH";
const UNIQUE_MINTERS = "913";

export default function Stats() {
  const { locale } = useLocale();
  const remaining = MAX_MINTS - TOTAL_MINTED;
  const progress = (TOTAL_MINTED / MAX_MINTS) * 100;

  const stats = [
    { label: t(locale, "stats_minted"), value: TOTAL_MINTED.toLocaleString(), detail: `${progress.toFixed(1)}%` },
    { label: t(locale, "stats_remaining"), value: remaining.toLocaleString(), detail: "until close" },
    { label: t(locale, "stats_pool"), value: POOL_DEPTH, detail: "liquidity" },
    { label: t(locale, "stats_holders"), value: UNIQUE_MINTERS, detail: "wallets" },
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
              <div className="mt-4 flex items-end justify-between gap-3">
                <span className="text-2xl font-semibold text-white md:text-3xl">{item.value}</span>
                <span className="text-xs text-[#748ffc]">{item.detail}</span>
              </div>
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
              {TOTAL_MINTED.toLocaleString()} / {MAX_MINTS.toLocaleString()}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#25262B]">
            <motion.div
              className="progress-bar h-full rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
