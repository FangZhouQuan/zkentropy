'use client';

import { useLocale } from '@/app/providers';
import { t } from '@/lib/i18n';

export default function Footer() {
  const { locale } = useLocale();
  return (
    <footer className="border-t border-white/5 px-6 py-12 mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5c7cfa] to-[#845ef7] flex items-center justify-center">
              <span className="text-white font-bold text-sm">ZK</span>
            </div>
            <span className="font-semibold text-white">ZKEntropy</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Etherscan</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Contract</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">{t(locale, 'footer_built')}</p>
          <p className="text-xs text-gray-600 mt-1">© 2025 ZKEntropy Protocol</p>
        </div>
      </div>
    </footer>
  );
}
