'use client';

import { useLocale } from '@/app/providers';
import { t } from '@/lib/i18n';
import { motion } from 'framer-motion';

export default function Hero() {
  const { locale } = useLocale();
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#5c7cfa]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#845ef7]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-[#5c7cfa]/10 text-[#748ffc] border border-[#5c7cfa]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#748ffc] animate-pulse" />
            {t(locale, 'hero_badge')}
          </span>
        </motion.div>

        <motion.h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <span className="text-white">{t(locale, 'hero_title_1')}</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5c7cfa] via-[#845ef7] to-[#22b8cf]">
            {t(locale, 'hero_title_2')}
          </span>
        </motion.h1>

        <motion.p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {t(locale, 'hero_desc')}
        </motion.p>

        <motion.div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <a href="#mint" className="btn-glow px-8 py-3.5 rounded-xl text-base font-semibold text-white inline-flex items-center gap-2">
            ⚡ {t(locale, 'hero_mint_btn')}
          </a>
          <a href="#how" className="px-8 py-3.5 rounded-xl text-base font-medium text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition-all">
            {t(locale, 'hero_learn_btn')}
          </a>
        </motion.div>

        {/* Code snippet */}
        <motion.div className="mt-16 glass-card p-4 max-w-lg mx-auto text-left font-mono text-sm" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-gray-500 text-xs">ZKEntropy.sol</span>
          </div>
          <code className="text-gray-300 text-xs leading-relaxed">
            <span className="text-[#845ef7]">function</span> <span className="text-[#22b8cf]">mint</span><span className="text-gray-500">(proof)</span> {'{'}<br/>
            <span className="text-gray-500 ml-4">// Verify ZK proof on-chain</span><br/>
            <span className="ml-4 text-[#51cf66]">require</span><span className="text-gray-500">(verifier.verifyProof(proof));</span><br/>
            <span className="ml-4 text-gray-500">// Fair allocation: 0.8x—2.0x</span><br/>
            <span className="ml-4 text-white">claimable</span><span className="text-gray-500">[msg.sender] += tokens;</span><br/>
            {'}'}
          </code>
        </motion.div>
      </div>
    </section>
  );
}
