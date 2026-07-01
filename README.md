# Decentralized Weather Data Oracle and Historical Data Subgraph

This repository contains a complete local prototype for a decentralized weather data workflow. It combines:
- a Solidity WeatherOracle contract for request/fulfill-style weather data handling,
- a The Graph subgraph for indexing historical weather reports,
- a React frontend for wallet connection, contract interaction, and subgraph queries.

## What is included
- Smart contract: [contracts/WeatherOracle.sol](contracts/WeatherOracle.sol)
- Deployment script: [scripts/deploy.js](scripts/deploy.js)
- Interaction script: [scripts/request-weather.js](scripts/request-weather.js)
- Contract tests: [test/WeatherOracle.test.js](test/WeatherOracle.test.js)
- Subgraph project: [subgraph](subgraph)
- Frontend app: [frontend](frontend)

## Verified local status
The project was verified locally with:
- `npx hardhat test` → 3 passing tests
- `npx hardhat run scripts/deploy.js --network localhost` → deployed successfully to `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- `cd frontend && npm run build` → production build completed successfully

## Architecture overview
- The contract emits `WeatherRequested` and `WeatherReported` events so the subgraph can index each request and its report.
- The subgraph maps those events into a `WeatherReport` entity with the fields required by the assignment.
- The frontend connects MetaMask, submits weather requests, and displays the historical reports from the subgraph.

## Local setup

### 1. Install dependencies
```bash
npm install
cd frontend && npm install
cd ../subgraph && npm install
```

### 2. Start the local EVM node
```bash
docker compose up -d
```

### 3. Compile and test the contracts
```bash
npx hardhat compile
npm test
```

### 4. Deploy the contract locally
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Update the frontend and subgraph addresses
Update the deployed contract address in:
- [frontend/src/App.js](frontend/src/App.js)
- [subgraph/subgraph.yaml](subgraph/subgraph.yaml)
- [.env.example](.env.example)

### 6. Run the frontend
```bash
cd frontend
npm start
```

## Subgraph setup
```bash
cd subgraph
npx graph codegen
npx graph build
```

For a hosted-service deployment, authenticate and deploy with:
```bash
graph auth <GRAPH_AUTH_TOKEN>
graph deploy <SUBGRAPH_NAME>
```

## Environment variables
Copy [.env.example](.env.example) to `.env` and update the values before deploying or running the frontend.

## Screenshots
The following placeholder screenshots are included for documentation purposes:
- [docs/screenshots/frontend-overview.svg](docs/screenshots/frontend-overview.svg)
- [docs/screenshots/subgraph-playground.svg](docs/screenshots/subgraph-playground.svg)

## Notes
- This local implementation uses a simplified JSON parser for temperature and description values.
- For production-grade Chainlink deployment, replace the local placeholder flow with a real Any API job and external adapter, then fund the contract with LINK and configure the oracle and job ID.
