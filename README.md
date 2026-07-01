# ClimateChain

A decentralized weather data application that demonstrates how blockchain, smart contracts, indexing, and a web interface work together to store and retrieve weather information. The project includes a Solidity smart contract for weather requests, a The Graph subgraph for indexing historical records, and a React frontend for interacting with the application.

---

## Features

- Smart contract for requesting and storing weather data
- Historical weather data indexing using The Graph
- React frontend with wallet connectivity
- Local blockchain deployment using Hardhat
- Automated contract testing
- Simple and modular project structure

---

## Project Structure

```
ClimateChain/
├── contracts/          # Solidity smart contracts
├── scripts/            # Deployment and interaction scripts
├── test/               # Hardhat test cases
├── frontend/           # React application
├── subgraph/           # The Graph subgraph
├── docs/               # Screenshots and documentation
├── .env.example
└── README.md
```



---

## Project Components

### Smart Contract
The Weather Oracle smart contract handles weather requests and stores reported weather information through blockchain events.

### Subgraph
The Graph subgraph indexes emitted events and creates a searchable history of weather reports.

### Frontend
The React application allows users to:
- Connect MetaMask
- Submit weather requests
- View indexed weather reports
- Interact with the deployed smart contract

---

## Installation

Install project dependencies.

```bash
npm install

cd frontend
npm install

cd ../subgraph
npm install
```

---

## Run Local Blockchain

```bash
docker compose up -d
```

---

## Compile and Test

```bash
npx hardhat compile
npm test
```

---

## Deploy Contract

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## Configure Project

Update the deployed contract address in:

- `frontend/src/App.js`
- `subgraph/subgraph.yaml`
- `.env`

---

## Start Frontend

```bash
cd frontend
npm start
```

---

## Build Subgraph

```bash
cd subgraph

npx graph codegen
npx graph build
```

For deployment:

```bash
graph auth <GRAPH_AUTH_TOKEN>

graph deploy <SUBGRAPH_NAME>
```

---

## Environment Variables

Copy the example file and update the required values.

```bash
cp .env.example .env
```

---

## Testing

Run the test suite using:

```bash
npm test
```

---

## Screenshots

Store screenshots inside:

```
docs/screenshots/
```


---

## Conclusion

ClimateChain demonstrates the integration of blockchain technology with decentralized data indexing to create a transparent weather data management system. By combining Solidity smart contracts, The Graph, and a React-based interface, the project provides a complete workflow for requesting, storing, indexing, and retrieving weather information while serving as a practical foundation for building scalable decentralized oracle applications.

---
