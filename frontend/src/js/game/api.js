import { getWallet, getPlantsUnionContract } from '../wallet';

const contract = async () => {
  const wallet = getWallet();
  return await getPlantsUnionContract(wallet.provider, wallet.accounts[0]);
}

export const getRole = async () => {
  return await (await contract()).getRole();
}

export const getRoleByName = async (name) => {
  return await (await contract()).getRoleByName(name);
}

export const createRole = async (name, avatarId) => {
  return await (await contract()).createRole(name, avatarId);
}
