import { ethers, utils } from 'ethers';

const arbitrum = require('../configs/arbitrum/config.json');
const arbitrumTestnet = require('../configs/arbitrumTestnet/config.json');
const mainnet = require('../configs/mainnet/config.json');
const xdai = require('../configs/xdai/config.json');
const goerli = require('../configs/goerli/config.json');
const localhost = require('../configs/localhost/config.json');

const appConfig: AppConfig = {
  arbitrum,
  arbitrumTestnet,
  mainnet,
  xdai,
  goerli,
  localhost,
};

export function shortenAddress(address: string, digits = 4) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${address.substring(0, digits + 2)}...${address.substring(
    42 - digits
  )}`;
}

export function isAddress(value: string) {
  try {
    return ethers.utils.getAddress(value.toLowerCase());
  } catch {
    return false;
  }
}

export function toChecksum(address) {
  return utils.getAddress(address);
}

export function toAddressStub(address, size = 'default') {
  const start = address.slice(0, 6);
  const end = address.slice(-4);

  switch (size) {
    case 'short':
      return `${start}..`;
    case 'long':
      return address;
    default:
      return `${start}...${end}`;
  }
}

export function getERC20Token(address) {
  let tokenObject;
  Object.entries(appConfig).forEach(([_, value]) => {
    if (!tokenObject)
      tokenObject = value?.tokens?.find(token => token.address === address);
  });
  return tokenObject;
}

export function getDxVoteContract(address) {
  let contract;
  Object.entries(appConfig).forEach(([_, value]) => {
    Object.entries(value?.contracts).forEach(([name, value]) => {
      if (!contract && value === address)
        contract = { contract: name, address: value };
    });
  });
  return contract;
}
