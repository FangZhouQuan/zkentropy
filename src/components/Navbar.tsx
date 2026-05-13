'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLocale } from '@/app/providers';
import { t } from '@/lib/i18n';

export default function Navbar() {
  const { locale, setLocale } = useLocale();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0b0d]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5c7cfa] to-[#845ef7] flex items-center justify-center">
            <span className="text-white font-bold text-sm">ZK</span>
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">ZKEntropy</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#mint" className="text-sm text-gray-400 hover:text-white transition-colors">Mint</a>
          <a href="#how" className="text-sm text-gray-400 hover:text-white transition-colors">Docs</a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all"
          >
            {locale === 'en' ? '中文' : 'EN'}
          </button>
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
              const connected = mounted && account && chain;
              return (
                <div {...(!mounted && { style: { opacity: 0, pointerEvents: 'none' as const } })}>
                  {!connected ? (
                    <button onClick={openConnectModal} className="btn-glow px-4 py-2 rounded-xl text-sm font-medium text-white">
                      {t(locale, 'nav_connect')}
                    </button>
                  ) : (
                    <button onClick={openAccountModal} className="px-4 py-2 rounded-xl text-sm font-medium bg-[#25262B] border border-white/10 text-white">
                      {account.displayName}
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
