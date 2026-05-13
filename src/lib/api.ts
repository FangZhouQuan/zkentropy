const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ApiStatus {
  totalMinted: number;
  maxMints: number;
  remaining: number;
  poolETH: string;
  uniqueMinters: number;
  finalized: boolean;
  contractAddress: `0x${string}`;
}

export interface ApiProof {
  a: [string, string];
  b: [[string, string], [string, string]];
  c: [string, string];
}

export interface MintApiResponse {
  success: true;
  proof: ApiProof;
  publicSignals: string[];
  tier: number;
  multiplier: number;
  tokens: number;
  entropy: string;
}

export interface HistoryMint {
  id: number;
  tier: number;
  multiplier: number;
  tokens: number;
  txHash: string | null;
  timestamp: number;
  claimed: boolean;
}

export interface HistoryResponse {
  address: string;
  mints: HistoryMint[];
  totalTokens: number;
  mintCount: number;
}

async function readJson<T>(res: Response, fallbackError: string): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || fallbackError);
  }
  return data as T;
}

export async function fetchStatus() {
  const res = await fetch(`${API_BASE}/api/status`);
  return readJson<ApiStatus>(res, "Failed to fetch status");
}

export async function requestMint(address: string, salt: string) {
  const res = await fetch(`${API_BASE}/api/mint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, salt }),
  });
  return readJson<MintApiResponse>(res, "Mint request failed");
}

export async function fetchHistory(address: string) {
  const res = await fetch(`${API_BASE}/api/history/${address}`);
  return readJson<HistoryResponse>(res, "Failed to fetch history");
}
