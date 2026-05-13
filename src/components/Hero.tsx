"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/app/providers";
import { t } from "@/lib/i18n";

export default function Hero() {
  const { locale } = useLocale();

  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-32 sm:pb-20 sm:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5c7cfa]/60 to-transparent" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#5c7cfa]/20 bg-[#5c7cfa]/10 px-4 py-1.5 text-xs font-medium text-[#748ffc]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#748ffc]" />
              {t(locale, "hero_badge")}
            </span>
          </motion.div>

          <motion.h1
            className="mt-7 text-5xl font-bold leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <span>Provably Fair</span>
            <span className="mt-2 block bg-gradient-to-r from-[#5c7cfa] via-[#845ef7] to-[#22b8cf] bg-clip-text text-transparent">
              Token Launch
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400 lg:mx-0"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
          >
            {t(locale, "hero_desc")}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
          >
            <a className="btn-glow inline-flex h-12 w-full items-center justify-center rounded-xl px-7 text-base font-semibold text-white sm:w-auto" href="#mint">
              {t(locale, "hero_mint_btn")}
            </a>
            <a
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/10 px-7 text-base font-medium text-gray-300 transition-all hover:border-white/20 hover:text-white sm:w-auto"
              href="#how"
            >
              {t(locale, "hero_learn_btn")}
            </a>
          </motion.div>
        </div>

        <motion.div
          className="glass-card mx-auto w-full max-w-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff6b6b]/80" />
            <span className="h-3 w-3 rounded-full bg-[#fcc419]/80" />
            <span className="h-3 w-3 rounded-full bg-[#51cf66]/80" />
            <span className="ml-3 text-xs text-gray-500">ZKEntropy.sol</span>
          </div>
          <pre className="overflow-x-auto p-5 text-left text-xs leading-6 text-gray-300 sm:text-sm">
            <code>{`function mint(bytes calldata proof) external payable {
  require(msg.value == 0.0025 ether);

  uint256 entropy = block.prevrandao ^ totalMinted;
  uint256 tier = verifier.verify(proof, entropy);

  claimable[msg.sender] += allocation(tier);
  poolETH += msg.value / 2;
}`}</code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
