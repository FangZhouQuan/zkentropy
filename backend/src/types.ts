export interface MintRequest {
  address: string;
  salt: string;
}

export interface SolidityProof {
  a: [string, string];
  b: [[string, string], [string, string]];
  c: [string, string];
}

export interface MintResponse {
  success: true;
  proof: SolidityProof;
  publicSignals: string[];
  tier: number;
  multiplier: number;
  tokens: number;
  entropy: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export interface MintRecord {
  id: number;
  address: string;
  salt: string;
  entropy: string;
  tier: number;
  multiplier: number;
  tokens: number;
  proof_a: string;
  proof_b: string;
  proof_c: string;
  tx_hash: string | null;
  block_number: number | null;
  timestamp: number;
  claimed: number;
}

export interface HistoryItem {
  id: number;
  tier: number;
  multiplier: number;
  tokens: number;
  txHash: string | null;
  timestamp: number;
  claimed: boolean;
}

export interface ContractStatus {
  totalMinted: number;
  maxMints: number;
  remaining: number;
  poolETH: string;
  uniqueMinters: number;
  finalized: boolean;
  contractAddress: string;
}

export interface TierInfo {
  tier: number;
  multiplier: number;
  tokens: number;
}
