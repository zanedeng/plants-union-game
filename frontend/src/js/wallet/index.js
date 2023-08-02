import { ConnectionType } from "./connection/ConnectionType";
import { MetaMask } from "./connection/MetaMask";
import { ethers } from "ethers";
import PlantsUnionABI from "./abis/PlantsUnion.json";

const GOERLI_CONSTRUCT_ADDRESS = '0x5146eE6c8D420a09f6f81F36392474dB1ef6AB35';

const walletDict = {
  [ConnectionType.INJECTED]: new MetaMask(),
};

export const getWallet = (type = ConnectionType.INJECTED) => {
  return walletDict[type];
};

export const getContract = async (address, abi, provider, account) => {
  const ethereum = new ethers.BrowserProvider(provider);
  const signer = await getSigner(ethereum, account)
  return account
    ? new ethers.Contract(address, abi, signer)
    : new ethers.Contract(address, abi, ethereum);
}

export const getSigner = async (provider, account) => {
  return await provider.getSigner(account);
}

export const getPlantsUnionContract = async (provider, account) => {
  return await getContract(GOERLI_CONSTRUCT_ADDRESS, PlantsUnionABI, provider, account);
}
