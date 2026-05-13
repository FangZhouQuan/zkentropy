"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/app/providers";
import { t } from "@/lib/i18n";

const steps = [
  { key: "step1", number: "01" },
  { key: "step2", number: "02" },
  { key: "step3", number: "03" },
  { key: "step4", number: "04" },
] as const;

const architecture = [
  {
    title: "Smart Contract",
    color: "#5c7cfa",
    items: ["ERC-20 fair mint", "Groth16 verifier", "Immutable launch rules", "No admin allocation"],
  },
  {
    title: "ZK Circuit",
    color: "#845ef7",
    items: ["Private salt input", "Entropy commitment", "Multiplier proof", "BN128 Groth16"],
  },
  {
    title: "Liquidity",
    color: "#22b8cf",
    items: ["50% ETH to pool", "Launch finalization", "Claim after close", "Public settlement"],
  },
] as const;

export default function HowItWorks() {
  const { locale } = useLocale();

  return (
    <section id="how" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">{t(locale, "how_title")}</h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.key}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#5c7cfa] to-[#845ef7] font-mono text-sm font-semibold text-white">
                {step.number}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{t(locale, `how_${step.key}_title`)}</h3>
              <p className="text-sm leading-6 text-gray-400">{t(locale, `how_${step.key}_desc`)}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="glass-card mt-6 p-7 sm:p-8"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-5 text-lg font-semibold text-white">{t(locale, "architecture_title")}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {architecture.map((group) => (
              <div key={group.title} className="rounded-xl border border-white/5 bg-[#1A1B1E] p-5">
                <div className="mb-3 font-semibold" style={{ color: group.color }}>
                  {group.title}
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#748ffc]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
