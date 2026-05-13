"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useLocale } from "@/app/providers";
import { t } from "@/lib/i18n";

export default function Navbar() {
  const { locale, setLocale } = useLocale();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0a0b0d]/78 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#5c7cfa] to-[#845ef7] text-sm font-bold text-white shadow-[0_0_28px_rgba(92,124,250,0.34)]">
            ZK
          </span>
          <span className="truncate text-lg font-semibold tracking-tight text-white">ZKEntropy</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link className="text-sm text-gray-400 transition-colors hover:text-white" href="/#mint">
            {t(locale, "nav_mint")}
          </Link>
          <Link className="text-sm text-gray-400 transition-colors hover:text-white" href="/#history">
            {t(locale, "nav_history")}
          </Link>
          <Link className="text-sm text-gray-400 transition-colors hover:text-white" href="/#how">
            {t(locale, "nav_docs")}
          </Link>
          <Link className="text-sm text-gray-400 transition-colors hover:text-white" href="/whitepaper">
            {t(locale, "nav_whitepaper")}
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "zh" : "en")}
            className="h-9 rounded-lg border border-white/10 px-3 text-xs font-medium text-gray-300 transition-all hover:border-white/20 hover:text-white"
          >
            {locale === "en" ? "中文" : "EN"}
          </button>

          <ConnectButton.Custom>
            {({ account, chain, mounted, openAccountModal, openConnectModal }) => {
              const connected = mounted && account && chain;

              return (
                <div {...(!mounted && { "aria-hidden": true, style: { opacity: 0, pointerEvents: "none" as const } })}>
                  {connected ? (
                    <button
                      type="button"
                      onClick={openAccountModal}
                      className="h-9 rounded-lg border border-white/10 bg-[#25262B] px-3 text-sm font-medium text-white transition-colors hover:border-white/20"
                    >
                      {account.displayName}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openConnectModal}
                      className="btn-glow h-9 rounded-lg px-3 text-sm font-semibold text-white sm:px-4"
                    >
                      {t(locale, "nav_connect")}
                    </button>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </nav>
  );
}
