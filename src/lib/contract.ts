export const CONTRACTS = {
  ZKEntropy: "0x0000000000000000000000000000000000000000",
  Verifier: "0x0000000000000000000000000000000000000000",
} as const;

export const MINT_PRICE = 0.0025;
export const MAX_MINTS = 10000;
export const BASE_TOKENS_PER_MINT = 50000;

export const TIERS = [
  { multiplier: 0.8, probability: 15, label: "Common", labelZh: "普通", color: "#4dabf7" },
  { multiplier: 0.9, probability: 25, label: "Uncommon", labelZh: "优良", color: "#51cf66" },
  { multiplier: 1.0, probability: 30, label: "Standard", labelZh: "标准", color: "#ced4da" },
  { multiplier: 1.2, probability: 20, label: "Rare", labelZh: "稀有", color: "#fcc419" },
  { multiplier: 1.5, probability: 8, label: "Epic", labelZh: "史诗", color: "#ff922b" },
  { multiplier: 2.0, probability: 2, label: "Legendary", labelZh: "传说", color: "#ff6b6b" },
] as const;

export const ZKE_ABI = [
  {
    type: "function",
    name: "mint",
    stateMutability: "payable",
    inputs: [
      { name: "a", type: "uint256[2]" },
      { name: "b", type: "uint256[2][2]" },
      { name: "c", type: "uint256[2]" },
      { name: "salt", type: "uint256" },
      { name: "nullifier", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "totalMinted",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;
