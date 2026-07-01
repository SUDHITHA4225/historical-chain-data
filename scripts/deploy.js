const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  const oracleAddress = process.env.CHAINLINK_ORACLE_ADDRESS || deployer.address;
  const jobId = process.env.CHAINLINK_JOB_ID || "demo-job";
  const WeatherOracle = await ethers.getContractFactory("WeatherOracle");
  const weatherOracle = await WeatherOracle.deploy(
    oracleAddress,
    deployer.address,
    ethers.utils.formatBytes32String(jobId)
  );

  await weatherOracle.deployed();
  console.log(`WeatherOracle deployed to: ${weatherOracle.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
