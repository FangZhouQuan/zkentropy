"use client";

import { useLocale } from "@/app/providers";
import { t } from "@/lib/i18n";

export default function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="mt-10 border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#5c7cfa] to-[#845ef7] text-sm font-bold text-white">
            ZK
          </span>
          <div>
            <div className="font-semibold text-white">ZKEntropy</div>
            <div className="text-xs text-gray-600">{t(locale, "footer_built")}</div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-400">
          <a href="https://etherscan.io" className="transition-colors hover:text-white" target="_blank" rel="noreferrer">
            Etherscan
          </a>
          <a href="https://github.com/FangZhouQuan/zkentropy" className="transition-colors hover:text-white" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Contract
          </a>
        </div>
      </div>
    </footer>
  );
}
