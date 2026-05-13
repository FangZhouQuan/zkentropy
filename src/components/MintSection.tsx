"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useLocale } from "@/app/providers";
import { BASE_TOKENS_PER_MINT, MAX_MINTS, MINT_PRICE, TIERS } from "@/lib/contract";
import { t } from "@/lib/i18n";

export default function MintSection({ totalMinted = 0 }: { totalMinted?: number }) {
  const { locale } = useLocale();
  const { isConnected } = useAccount();
  const [isProving, setIsProving] = useState(false);
  const soldOut = totalMinted >= MAX_MINTS;

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

              {soldOut ? (
                <button className="h-13 w-full rounded-xl bg-[#25262B] px-5 py-4 font-semibold text-gray-500" disabled type="button">
                  {t(locale, "mint_sold_out")}
                </button>
              ) : !isConnected ? (
                <button className="h-13 w-full rounded-xl bg-[#25262B] px-5 py-4 font-semibold text-gray-500" disabled type="button">
                  {t(locale, "mint_connect_first")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsProving(true);
                    window.setTimeout(() => setIsProving(false), 1800);
                  }}
                  disabled={isProving}
                  className="btn-glow h-13 w-full rounded-xl px-5 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProving ? t(locale, "mint_btn_loading") : t(locale, "mint_btn")}
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
