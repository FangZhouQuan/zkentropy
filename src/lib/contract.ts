export const CONTRACTS = {
  ZKEntropy: '0x0000000000000000000000000000000000000000',
  Verifier: '0x0000000000000000000000000000000000000000',
} as const;

export const MINT_PRICE = 0.0025;
export const MAX_MINTS = 10000;
export const BASE_TOKENS_PER_MINT = 50000;

export const TIERS = [
  { multiplier: 0.8, probability: 15, label: 'Common', labelZh: '普通', color: '#4dabf7', emoji: '🔵' },
  { multiplier: 0.9, probability: 25, label: 'Uncommon', labelZh: '优良', color: '#51cf66', emoji: '🟢' },
  { multiplier: 1.0, probability: 30, label: 'Standard', labelZh: '标准', color: '#ced4da', emoji: '⚪' },
  { multiplier: 1.2, probability: 20, label: 'Rare', labelZh: '稀有', color: '#fcc419', emoji: '🟡' },
  { multiplier: 1.5, probability: 8, label: 'Epic', labelZh: '史诗', color: '#ff922b', emoji: '🟠' },
  { multiplier: 2.0, probability: 2, label: 'Legendary', labelZh: '传说', color: '#ff6b6b', emoji: '🔴' },
];

export const ZKE_ABI = [
  'function mint(uint256[2],uint256[2][2],uint256[2],uint256,uint256) payable',
  'function claim() external',
  'function totalMinted() view returns (uint256)',
  'function finalized() view returns (bool)',
  'function totalClaimable(address) view returns (uint256)',
  'function getMintRecords(address) view returns (tuple(uint256 amount, uint8 tier, uint64 timestamp, bool claimed)[])',
  'function getEntropy() view returns (uint256)',
  'function poolETH() view returns (uint256)',
] as const;
