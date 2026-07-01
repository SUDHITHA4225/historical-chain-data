const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WeatherOracle", function () {
  let weatherOracle;
  let owner;
  let addr1;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    addr1 = signers[1];
    const WeatherOracle = await ethers.getContractFactory("WeatherOracle", owner);
    weatherOracle = await WeatherOracle.deploy(
      owner.address,
      owner.address,
      ethers.utils.formatBytes32String("job-id")
    );
    await weatherOracle.deployed();
  });

  it("emits a request event and stores the pending report", async function () {
    const tx = await weatherOracle.connect(addr1).requestWeather("London", { value: ethers.utils.parseEther("0.001") });
    const receipt = await tx.wait();

    const event = receipt.logs.find((log) => weatherOracle.interface.parseLog(log).name === "WeatherRequested");
    const parsed = event ? weatherOracle.interface.parseLog(event) : null;
    expect(parsed).to.not.be.null;
    expect(parsed.args.city).to.equal("London");
    expect(parsed.args.requester).to.equal(addr1.address);
  });

  it("parses weather data and emits a report event", async function () {
    const payload = '{"temperature": 21.5, "description": "light rain"}';
    const tx = await weatherOracle.fulfill(ethers.utils.formatBytes32String("req-1"), payload);
    const receipt = await tx.wait();

    const event = receipt.logs.find((log) => weatherOracle.interface.parseLog(log).name === "WeatherReported");
    const parsed = event ? weatherOracle.interface.parseLog(event) : null;
    expect(parsed).to.not.be.null;
    expect(parsed.args.city).to.equal("Unknown");
    expect(parsed.args.temperature.toNumber()).to.equal(21);
    expect(parsed.args.description).to.equal("light rain");
  });

  it("allows only the owner to update the oracle configuration", async function () {
    try {
      await weatherOracle.connect(addr1).setChainlinkOracle(addr1.address);
      expect.fail("Expected the transaction to revert");
    } catch (error) {
      expect(error.message).to.include("reverted");
    }

    await weatherOracle.setJobId(ethers.utils.formatBytes32String("new-job"));
    expect(await weatherOracle.jobId()).to.equal(ethers.utils.formatBytes32String("new-job"));
  });
});
