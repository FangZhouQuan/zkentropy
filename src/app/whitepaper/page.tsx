"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useLocale } from "@/app/providers";
import { t, type TranslationKey } from "@/lib/i18n";

const toc = [
  { id: "abstract", key: "wp_abstract" },
  { id: "introduction", key: "wp_introduction" },
  { id: "problem-statement", key: "wp_problem" },
  { id: "solution", key: "wp_solution" },
  { id: "mechanism-design", key: "wp_mechanism" },
  { id: "zk-proof-system", key: "wp_zk_system" },
  { id: "smart-contract-architecture", key: "wp_contract_architecture" },
  { id: "tokenomics", key: "wp_tokenomics" },
  { id: "security", key: "wp_security" },
  { id: "roadmap", key: "wp_roadmap" },
  { id: "conclusion", key: "wp_conclusion" },
] as const satisfies ReadonlyArray<{ id: string; key: TranslationKey }>;

function Section({
  id,
  titleKey,
  children,
}: {
  id: string;
  titleKey: TranslationKey;
  children: ReactNode;
}) {
  const { locale } = useLocale();

  return (
    <motion.section
      id={id}
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-120px" }}
    >
      <div className="glass-card p-6 sm:p-8">
        <h2 className="bg-gradient-to-r from-[#5c7cfa] via-[#845ef7] to-[#22b8cf] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          {t(locale, titleKey)}
        </h2>
        <div className="mt-5 space-y-5 text-dark-100 leading-[1.8]">{children}</div>
      </div>
    </motion.section>
  );
}

function Subheading({ titleKey }: { titleKey: TranslationKey }) {
  const { locale } = useLocale();

  return <h3 className="pt-2 text-lg font-semibold text-white">{t(locale, titleKey)}</h3>;
}

function Highlight({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-primary-400">{children}</span>;
}

function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <div className="glass-card overflow-x-auto p-4 font-mono text-sm leading-7 text-gray-300">
      <pre>{children}</pre>
    </div>
  );
}

function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function WhitepaperPage() {
  const { locale } = useLocale();

  return (
    <main className="min-h-screen bg-mesh bg-grid">
      <Navbar />

      <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-24 pt-28 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-20">
            <div className="glass-card p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Contents</p>
              <div className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                  >
                    {t(locale, item.key)}
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        <article className="min-w-0">
          <motion.header
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary-400">ZKEntropy Protocol</p>
            <h1 className="mt-4 bg-gradient-to-r from-[#5c7cfa] via-[#845ef7] to-[#22b8cf] bg-clip-text text-4xl font-bold tracking-normal text-transparent sm:text-6xl">
              {t(locale, "wp_title")}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-dark-100">{t(locale, "wp_subtitle")}</p>
          </motion.header>

          <div className="space-y-8">
            <Section id="abstract" titleKey="wp_abstract">
              <p>
                ZKEntropy is an ERC-20 fair launch mechanism designed to make initial token distribution
                transparent, constrained, and verifiably random without exposing private user entropy. Each mint
                produces a claimable allocation determined by a zero-knowledge proof and an on-chain entropy source.
              </p>
              <p>
                The launch uses a fixed mint price of <Highlight>0.0025 ETH</Highlight>, a maximum of{" "}
                <Highlight>10,000 mints</Highlight>, and a base allocation of{" "}
                <Highlight>50,000 ZKE</Highlight> per mint. The multiplier distribution has an expected value of{" "}
                <Highlight>1.015x</Highlight>, keeping outcomes near-fair while still creating a visible entropy layer.
              </p>
            </Section>

            <Section id="introduction" titleKey="wp_introduction">
              <p>
                Token launches often rely on opaque allocations, privileged access, hidden market-making, or
                centralized randomness. ZKEntropy approaches the launch as a protocol surface: the rules are explicit,
                the parameters are immutable, and the final allocation can be verified on-chain.
              </p>
              <p>
                The protocol combines a public ERC-20 mint phase, private browser-side entropy, a compact Groth16
                proof, and a liquidity-opening flow intended to reduce operator discretion at launch time.
              </p>
            </Section>

            <Section id="problem-statement" titleKey="wp_problem">
              <p>
                Early token distribution is a high-trust moment. Buyers must trust that operators will not mint extra
                tokens, alter launch parameters, pause markets selectively, or route liquidity in a way that creates
                asymmetric outcomes.
              </p>
              <BulletList
                items={[
                  "Manual allowlists and admin allocations are hard for users to audit in real time.",
                  "Randomness sourced only from frontend code is not independently verifiable.",
                  "Liquidity timing often gives insiders information advantages.",
                  "Overpowered owner controls can make a launch look fair while preserving hidden intervention paths.",
                ]}
              />
            </Section>

            <Section id="solution" titleKey="wp_solution">
              <p>
                ZKEntropy constrains the launch with fixed mint economics, on-chain accounting, and proof-verified
                multiplier assignment. Users mint once or multiple times, generate a private salt locally, and submit a
                proof that demonstrates the allocation was derived from the agreed entropy function.
              </p>
              <CodeBlock>{`allocation = baseTokensPerMint * multiplierTier
entropy    = Poseidon(userSalt, chainEntropy, mintIndex)
proof      = Groth16(entropy, tier, nullifier)`}</CodeBlock>
            </Section>

            <Section id="mechanism-design" titleKey="wp_mechanism">
              <Subheading titleKey="wp_mint_process" />
              <p>
                A participant pays <Highlight>0.0025 ETH</Highlight> per mint. The frontend creates a private salt,
                derives the proof inputs, and submits the proof together with the mint transaction. The contract records
                the user allocation but does not require users to reveal the private salt.
              </p>

              <Subheading titleKey="wp_multiplier_tiers" />
              <p>
                The tier table spans <Highlight>0.8x</Highlight>, <Highlight>0.9x</Highlight>,{" "}
                <Highlight>1.0x</Highlight>, <Highlight>1.2x</Highlight>, <Highlight>1.5x</Highlight>, and{" "}
                <Highlight>2.0x</Highlight>. The weighted expected value is <Highlight>1.015x</Highlight>, which keeps
                the game layer close to fair while providing visible entropy outcomes.
              </p>

              <Subheading titleKey="wp_fund_allocation" />
              <p>
                Mint proceeds are split by a simple <Highlight>50/50</Highlight> policy. Half of collected ETH is
                reserved for protocol liquidity and half remains available for project treasury operations after the
                mint phase is finalized.
              </p>
            </Section>

            <Section id="zk-proof-system" titleKey="wp_zk_system">
              <Subheading titleKey="wp_circuit_design" />
              <p>
                The circuit is planned in <Highlight>Circom 2.1</Highlight> with approximately{" "}
                <Highlight>509 constraints</Highlight>. Its role is intentionally narrow: bind private entropy,
                public entropy, and tier assignment into a proof that can be verified cheaply on-chain.
              </p>

              <Subheading titleKey="wp_poseidon_hash" />
              <p>
                Poseidon is used as the hash primitive because it is efficient inside arithmetic circuits. This allows
                entropy commitments to be computed with far fewer constraints than conventional hash functions.
              </p>

              <Subheading titleKey="wp_groth16" />
              <p>
                Groth16 provides compact proofs and fast Solidity verification, making it suitable for a mint path
                where gas cost and transaction simplicity matter.
              </p>

              <Subheading titleKey="wp_onchain_verification" />
              <p>
                The verifier target is roughly <Highlight>200k gas</Highlight>. This cost is paid during mint and keeps
                the proof verification step transparent to the settlement contract.
              </p>
            </Section>

            <Section id="smart-contract-architecture" titleKey="wp_contract_architecture">
              <Subheading titleKey="wp_erc20" />
              <p>
                ZKE is modeled as a fixed-parameter ERC-20 token. Launch records, claimable balances, and finalization
                state are stored on-chain so users can independently verify the lifecycle.
              </p>

              <Subheading titleKey="wp_uniswap_hook" />
              <p>
                The architecture targets a Uniswap V4 Hook using <Highlight>AFTER_SWAP</Highlight> behavior and the
                flag <Highlight>0x0040</Highlight>. The design intentionally avoids a BEFORE_SWAP hook to reduce
                honeypot-style detection risk and preserve a simpler trading path.
              </p>

              <Subheading titleKey="wp_flow" />
              <CodeBlock>{`Mint -> record claimable allocation
Finalize -> open liquidity and lock launch parameters
Claim -> transfer accumulated ZKE allocation to user`}</CodeBlock>

              <Subheading titleKey="wp_owner_permissions" />
              <p>
                Owner permissions are intentionally minimal: <Highlight>finalize</Highlight> and{" "}
                <Highlight>withdrawETH</Highlight> only. There is no admin mint, pause, or upgrade path in the intended
                launch surface.
              </p>
            </Section>

            <Section id="tokenomics" titleKey="wp_tokenomics">
              <BulletList
                items={[
                  <>
                    Total Supply: <Highlight>500,000,000 ZKE</Highlight>
                  </>,
                  <>
                    Mint Price: <Highlight>0.0025 ETH</Highlight>
                  </>,
                  <>
                    Max Mints: <Highlight>10,000</Highlight>
                  </>,
                  <>
                    Base Allocation: <Highlight>50,000 ZKE</Highlight> per mint
                  </>,
                  <>
                    Expected Value: <Highlight>1.015x</Highlight> near-fair multiplier distribution
                  </>,
                  <>
                    Liquidity: <Highlight>50% ETH</Highlight> to a Uniswap V4 full-range pool
                  </>,
                ]}
              />
            </Section>

            <Section id="security" titleKey="wp_security">
              <BulletList
                items={[
                  "No admin mint, pause, or upgrade mechanism in the intended launch contract surface.",
                  "Immutable launch parameters reduce governance discretion during the mint window.",
                  "Groth16 trusted setup uses a Powers of Tau ceremony model.",
                  "No BEFORE_SWAP hook is included, avoiding a common honeypot detection signal.",
                ]}
              />
            </Section>

            <Section id="roadmap" titleKey="wp_roadmap">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Phase 1", "Fair Launch (Mint)", "Open public minting and collect proof-verified allocations."],
                  ["Phase 2", "Claim & Pool Opening", "Finalize launch state, open liquidity, and enable claiming."],
                  ["Phase 3", "Governance & Ecosystem", "Introduce community-led parameter research and integrations."],
                ].map(([phase, title, text]) => (
                  <div key={phase} className="glass-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">{phase}</p>
                    <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-dark-100">{text}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="conclusion" titleKey="wp_conclusion">
              <p>
                ZKEntropy turns a token launch into a constrained cryptographic process: fixed economics, public
                settlement, private entropy, and on-chain proof verification. The result is a launch model that is
                inspectable by users and difficult for operators to manipulate after parameters are set.
              </p>
              <p>
                The protocol is intentionally narrow at launch. Its goal is not to hide complexity behind governance,
                but to make the first distribution event legible, auditable, and fair enough to stand on-chain.
              </p>
            </Section>
          </div>
        </article>
      </div>

      <Footer />
    </main>
  );
}
