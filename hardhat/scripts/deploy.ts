import "@nomicfoundation/hardhat-toolbox-viem";
import { network } from "hardhat";

async function main() {
  console.log("Deploying TipPost contract...");

  const connection = await network.connect();
  const tipPost = await connection.viem.deployContract("TipPost");

  console.log(`TipPost deployed to: ${tipPost.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});