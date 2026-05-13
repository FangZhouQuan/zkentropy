"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import History from "@/components/History";
import HowItWorks from "@/components/HowItWorks";
import MintSection from "@/components/MintSection";
import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";
import { fetchHistory, fetchStatus, type ApiStatus, type HistoryResponse } from "@/lib/api";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      const nextStatus = await fetchStatus();
      setStatus(nextStatus);
      setStatusError(null);
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "Failed to fetch status");
    } finally {
      setStatusLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    if (!address) {
      setHistory(null);
      return;
    }

    setHistoryLoading(true);
    try {
      const nextHistory = await fetchHistory(address);
      setHistory(nextHistory);
    } catch {
      setHistory(null);
    } finally {
      setHistoryLoading(false);
    }
  }, [address]);

  const refreshAll = useCallback(() => {
    void loadStatus();
    void loadHistory();
  }, [loadHistory, loadStatus]);

  useEffect(() => {
    void loadStatus();
    const interval = window.setInterval(() => {
      void loadStatus();
    }, 15000);

    return () => window.clearInterval(interval);
  }, [loadStatus]);

  useEffect(() => {
    if (isConnected && address) {
      void loadHistory();
      return;
    }

    setHistory(null);
    setHistoryLoading(false);
  }, [address, isConnected, loadHistory]);

  return (
    <main className="min-h-screen overflow-hidden bg-mesh bg-grid">
      <Navbar />
      <Hero />
      <Stats status={status} loading={statusLoading} />
      {statusError && (
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/8 px-4 py-3 text-sm text-[#ff8787]">
            {statusError}
          </div>
        </div>
      )}
      <MintSection totalMinted={status?.totalMinted ?? 0} onMintComplete={refreshAll} />
      <History
        finalized={status?.finalized ?? false}
        history={history}
        isConnected={isConnected}
        loading={historyLoading}
        onClaimed={refreshAll}
      />
      <HowItWorks />
      <Footer />
    </main>
  );
}
