import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ethers } from 'ethers';
import WeatherOracleArtifact from './contracts/WeatherOracle.json';
import WeatherForm from './components/WeatherForm';
import WeatherReportsList from './components/WeatherReportsList';

const weatherOracleAddress = process.env.REACT_APP_WEATHER_ORACLE_ADDRESS || '0x0000000000000000000000000000000000000000';
const subgraphUri = process.env.REACT_APP_SUBGRAPH_URL || 'http://localhost:8000/subgraphs/name/weather-oracle';

const client = new ApolloClient({ uri: subgraphUri, cache: new InMemoryCache() });

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(p);
      p.send('eth_requestAccounts', []).then(async () => {
        const signer = await p.getSigner();
        const address = await signer.getAddress();
        const network = await p.getNetwork();
        const balance = await p.getBalance(address);
        setAccount(address);
        setSigner(signer);
        setNetwork(network);
        setBalance(ethers.utils.formatEther(balance));
        setContract(new ethers.Contract(weatherOracleAddress, WeatherOracleArtifact.abi, signer));
      }).catch(() => {});
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }
    const p = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await p.send('eth_requestAccounts', []);
    const signer = await p.getSigner();
    const address = accounts[0];
    const network = await p.getNetwork();
    const balance = await p.getBalance(address);
    setAccount(address);
    setSigner(signer);
    setNetwork(network);
    setBalance(ethers.utils.formatEther(balance));
    setContract(new ethers.Contract(weatherOracleAddress, WeatherOracleArtifact.abi, signer));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Decentralized Weather Oracle</h1>
      <p>Request live weather data on-chain and explore historical reports from The Graph.</p>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p><strong>Connected:</strong> {account}</p>
          <p><strong>Network:</strong> {network?.name || 'unknown'}</p>
          <p><strong>Balance:</strong> {balance} ETH</p>
        </div>
      )}
      {contract && <WeatherForm contract={contract} account={account} />}
      <WeatherReportsList client={client} />
    </div>
  );
}

export default App;
