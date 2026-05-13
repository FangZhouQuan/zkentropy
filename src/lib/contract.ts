export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const CONTRACTS = {
  ZKEntropy: CONTRACT_ADDRESS,
  Verifier: "0x0000000000000000000000000000000000000000",
} as const;

export const MINT_PRICE = 0.0025;
export const MAX_MINTS = 10000;
export const BASE_TOKENS_PER_MINT = 50000;

export const TIERS = [
  { multiplier: 0.8, probability: 15, label: "Common", labelZh: "普通", color: "#4dabf7", emoji: "🔵" },
  { multiplier: 0.9, probability: 25, label: "Uncommon", labelZh: "优良", color: "#51cf66", emoji: "🟢" },
  { multiplier: 1.0, probability: 30, label: "Standard", labelZh: "标准", color: "#ced4da", emoji: "⚪" },
  { multiplier: 1.2, probability: 20, label: "Rare", labelZh: "稀有", color: "#fcc419", emoji: "🟡" },
  { multiplier: 1.5, probability: 8, label: "Epic", labelZh: "史诗", color: "#ff922b", emoji: "🟠" },
  { multiplier: 2.0, probability: 2, label: "Legendary", labelZh: "传说", color: "#ff6b6b", emoji: "🔴" },
] as const;

export const ZKE_ABI = [
  {
    name: "mint",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "a", type: "uint256[2]" },
      { name: "b", type: "uint256[2][2]" },
      { name: "c", type: "uint256[2]" },
      { name: "entropy", type: "uint256" },
      { name: "tier", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "claim",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    name: "totalMinted",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "finalized",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "bool" }],
  },
  {
    name: "claimable",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;
