'use client';

import { useLocale } from '@/app/providers';
import { t } from '@/lib/i18n';
import { TIERS, MINT_PRICE, BASE_TOKENS_PER_MINT, MAX_MINTS } from '@/lib/contract';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export default function MintSection({ totalMinted = 0 }: { totalMinted?: number }) {
  const { locale } = useLocale();
  const { isConnected } = useAccount();
  const [isProving, setIsProving] = useState(false);
  const soldOut = totalMinted >= MAX_MINTS;
  const progress = (totalMinted / MAX_MINTS) * 100;

  return (
    <section id="mint" className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white">{t(locale, 'mint_title')}</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">{t(locale, 'mint_subtitle')}</p>
        </motion.div>

        {/* Progress */}
        <div className="glass-card p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">{t(locale, 'stats_minted')}: {totalMinted.toLocaleString()} / {MAX_MINTS.toLocaleString()}</span>
            <span className="text-sm font-mono text-[#5c7cfa]">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-3 rounded-full bg-[#25262B] overflow-hidden">
            <motion.div className="h-full progress-bar rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.max(progress, 2)}%` }} transition={{ duration: 1 }} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mint Card */}
          <motion.div className="glass-card p-8 relative overflow-hidden" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#5c7cfa]/10 to-transparent rounded-bl-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm text-gray-400">{t(locale, 'mint_price')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-mono text-white">{MINT_PRICE}</span>
                  <span className="text-gray-500">ETH</span>
                </div>
              </div>

              <div className="bg-[#1A1B1E] rounded-xl p-5 mb-8">
                <div className="text-xs text-gray-500 mb-2">Base allocation</div>
                <div className="text-gray-300 text-sm font-mono">
                  {BASE_TOKENS_PER_MINT.toLocaleString()} ZKE × (0.8x – 2.0x)
                </div>
              </div>

              {soldOut ? (
                <button disabled className="w-full py-4 rounded-xl text-base font-semibold bg-[#25262B] text-gray-500 cursor-not-allowed">
                  {t(locale, 'mint_sold_out')}
                </button>
              ) : !isConnected ? (
                <button disabled className="w-full py-4 rounded-xl text-base font-semibold bg-[#25262B] text-gray-500 cursor-not-allowed">
                  {t(locale, 'mint_connect_first')}
                </button>
              ) : (
                <button
                  onClick={() => { setIsProving(true); setTimeout(() => setIsProving(false), 2000); }}
                  disabled={isProving}
                  className="w-full btn-glow py-4 rounded-xl text-base font-semibold text-white disabled:opacity-50"
                >
                  {isProving ? t(locale, 'mint_btn_loading') : t(locale, 'mint_btn')}
                </button>
              )}
            </div>
          </motion.div>

          {/* Tier Distribution */}
          <motion.div className="glass-card p-8" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-lg font-semibold mb-6 text-white">{t(locale, 'tier_title')}</h3>
            <div className="space-y-3">
              {TIERS.map((tier, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                  <span className="text-2xl">{tier.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold tier-${i}`}>{tier.multiplier}x</span>
                      <span className="text-xs text-gray-500">{locale === 'zh' ? tier.labelZh : tier.label}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-[#25262B] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${tier.probability * 2}%`, backgroundColor: tier.color }} />
                    </div>
                  </div>
                  <span className="text-sm font-mono text-gray-400 w-10 text-right">{tier.probability}%</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 rounded-xl bg-[#1A1B1E] text-center">
              <span className="text-xs text-gray-500">Expected value: <span className="text-[#5c7cfa] font-mono">1.015x</span> (near-fair)</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
