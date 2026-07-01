require("dotenv").config();
const { ethers } = require("ethers");
const WeatherOracleArtifact = require("../artifacts/contracts/WeatherOracle.sol/WeatherOracle.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.REACT_APP_WEATHER_ORACLE_ADDRESS, WeatherOracleArtifact.abi, signer);
  const tx = await contract.requestWeather("Seattle", { value: ethers.utils.parseEther("0.001") });
  const receipt = await tx.wait();
  console.log(`Request submitted: ${receipt.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
