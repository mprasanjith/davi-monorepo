#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

hardhat_running() {
  nc -z localhost 8545
}

start_hardhat_node() {
  # pnpm hardhat node --hostname 0.0.0.0 --export "build/deployment-info.json" | grep -vE 'eth_getBlockByNumber|eth_getBlockByHash' &
  pnpm hardhat node --hostname 0.0.0.0 --export "build/deployment-info.json" | grep -vE 'eth_getBlockByNumber|eth_getBlockByHash|eth_getTransactionReceipt|Mined empty block|eth_getLogs|eth_call|Transaction|From|To|Value|Gas used|Block|Contract deployment|Contract address|Contract call|eth_chainId|eth_blockNumber|eth_accounts' &
  # pnpm hardhat node --hostname 0.0.0.0 --export "build/deployment-info.json" | grep -vE 'Transaction|From|To|Value|Gas used|Block|Contract deployment|Contract address|Contract call' &

  echo "Waiting for hardhat to launch..."

  while ! hardhat_running; do
    sleep 0.1 # wait for 1/10 of the second before check again
  done

  echo "Harhat node launched!"
}

if hardhat_running; then
  echo "Killing existent hardhat"
  kill $(lsof -t -i:8545) 
fi


start_hardhat_node
node ./src/buildConfig.js
node ./src/updateProjectsConfig.js
echo "Hardhat node running locally"