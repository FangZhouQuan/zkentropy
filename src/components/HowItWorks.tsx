'use client';

import { useLocale } from '@/app/providers';
import { t } from '@/lib/i18n';
import { motion } from 'framer-motion';

const steps = [
  { icon: '⚡', key: 'step1' },
  { icon: '🔐', key: 'step2' },
  { icon: '📝', key: 'step3' },
  { icon: '🚀', key: 'step4' },
];

export default function HowItWorks() {
  const { locale } = useLocale();
  return (
    <section id="how" className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white">{t(locale, 'how_title')}</h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#5c7cfa]/30 via-[#845ef7]/30 to-[#22b8cf]/30" />
          {steps.map((step, i) => (
            <motion.div key={i} className="glass-card p-6 text-center relative" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5c7cfa] to-[#845ef7] flex items-center justify-center mx-auto mb-4 relative z-10">
                <span className="text-white font-bold text-sm">{i + 1}</span>
              </div>
              <span className="text-3xl mb-3 block">{step.icon}</span>
              <h3 className="text-lg font-semibold mb-2 text-white">{t(locale, `how_${step.key}_title` as any)}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{t(locale, `how_${step.key}_desc` as any)}</p>
            </motion.div>
          ))}
        </div>

        {/* Technical details */}
        <motion.div className="mt-16 glass-card p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-lg font-semibold mb-4 text-white">Technical Architecture</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 rounded-xl bg-[#1A1B1E]">
              <div className="text-[#5c7cfa] font-semibold mb-2">🔗 Smart Contract</div>
              <ul className="space-y-1 text-gray-400">
                <li>• ERC-20 + Uniswap V4 Hook</li>
                <li>• Groth16 on-chain verifier</li>
                <li>• Immutable parameters</li>
                <li>• No admin mint/pause</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-[#1A1B1E]">
              <div className="text-[#845ef7] font-semibold mb-2">🔐 ZK Circuit</div>
              <ul className="space-y-1 text-gray-400">
                <li>• Circom 2.1 (509 constraints)</li>
                <li>• Poseidon hash for entropy</li>
                <li>• BN128 curve (Groth16)</li>
                <li>• ~200k gas verification</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-[#1A1B1E]">
              <div className="text-[#22b8cf] font-semibold mb-2">🌊 Liquidity</div>
              <ul className="space-y-1 text-gray-400">
                <li>• 50% ETH → Uniswap V4 pool</li>
                <li>• AFTER_SWAP hook (0x0040)</li>
                <li>• 1% swap fee</li>
                <li>• Full range liquidity</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
