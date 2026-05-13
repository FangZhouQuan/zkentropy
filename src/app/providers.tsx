'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { createContext, useContext, useState, ReactNode } from 'react';
import { mainnet } from 'wagmi/chains';
import { http } from 'wagmi';
import { Locale } from '@/lib/i18n';

const config = getDefaultConfig({
  appName: 'ZKEntropy',
  projectId: 'a]b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
  chains: [mainnet],
  transports: { [mainnet.id]: http('https://ethereum-rpc.publicnode.com') },
});

const queryClient = new QueryClient();

const LocaleContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({
  locale: 'en', setLocale: () => {}
});

export function useLocale() { return useContext(LocaleContext); }

export function Providers({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme({
            accentColor: '#5c7cfa',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </LocaleContext.Provider>
  );
}
