import { Contract, formatEther, isAddress, JsonRpcProvider } from "ethers";
import { getMintCount, getUniqueMinters } from "./db";
import { MAX_MINTS } from "./proof";
import type { ContractStatus } from "../types";

const rpcUrl = process.env.RPC_URL ?? "https://ethereum-rpc.publicnode.com";
const contractAddress = process.env.CONTRACT_ADDRESS ?? "0x0000000000000000000000000000000000000000";

const provider = new JsonRpcProvider(rpcUrl);
const abi = [
  "function totalMinted() view returns (uint256)",
  "function finalized() view returns (bool)",
  "function poolETH() view returns (uint256)",
];

const contract =
  isAddress(contractAddress) && contractAddress !== "0x0000000000000000000000000000000000000000"
    ? new Contract(contractAddress, abi, provider)
    : null;

let statusCache: { timestamp: number; value: ContractStatus } | null = null;

export async function getLatestBlockEntropy(): Promise<{ entropy: string; blockNumber: number }> {
  const block = await provider.getBlock("latest");
  if (!block) {
    throw new Error("Unable to fetch latest block");
  }

  const blockWithRandao = block as typeof block & { prevRandao?: string };
  const entropyHex = blockWithRandao.prevRandao ?? block.hash;
  if (!entropyHex) {
    throw new Error("Latest block does not expose prevrandao or hash");
  }

  return {
    entropy: BigInt(entropyHex).toString(),
    blockNumber: block.number,
  };
}

export async function getContractStatus(): Promise<ContractStatus> {
  const now = Date.now();
  if (statusCache && now - statusCache.timestamp < 30_000) {
    return statusCache.value;
  }

  let totalMinted = getMintCount();
  let poolETH = "0.0";
  let finalized = false;

  if (contract) {
    try {
      const [chainTotalMinted, chainPoolETH, chainFinalized] = await Promise.all([
        contract.totalMinted(),
        contract.poolETH(),
        contract.finalized(),
      ]);

      totalMinted = Number(chainTotalMinted);
      poolETH = formatEther(chainPoolETH);
      finalized = Boolean(chainFinalized);
    } catch (error) {
      console.warn("Falling back to local status cache:", error);
    }
  }

  const value: ContractStatus = {
    totalMinted,
    maxMints: MAX_MINTS,
    remaining: Math.max(MAX_MINTS - totalMinted, 0),
    poolETH,
    uniqueMinters: getUniqueMinters(),
    finalized,
    contractAddress,
  };

  statusCache = { timestamp: now, value };
  return value;
}
