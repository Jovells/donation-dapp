import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useMetaMask } from "metamask-react";
import Donate from './pages/Donate';
import { ethers } from "ethers";
import { donation } from "./contract";
import DonationHistory from './pages/DonationHistory';

function App() {
  const { status, connect, account, chainId } = useMetaMask();
  const [benefitiary, setBenefitiary] = useState("");
  const { ethereum } = useMetaMask();

  useEffect(() => {
    async function getCurrentBeneficiary() {
      if (ethereum) {
        // console.log("Ethereum: ", ethereum)
        // Get Access to Signer
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        // console.log({signer, donation});
        // Make Function Call
        const myDonation = donation.connect(signer);
        const currentBeneficiary = await myDonation.currentBeneficiary();
        setBenefitiary(currentBeneficiary);
        return{currentBeneficiary, myDonation}
      }
    }

    getCurrentBeneficiary();

    return () => {
    }
  }, [ethereum])
  

  if (status === "initializing") return <div>Synchronisation with MetaMask ongoing...</div>

  if (status === "unavailable") return <div>MetaMask not available </div>

  if (status === "notConnected") return <button onClick={connect}>Connect to MetaMask</button>

  if (status === "connecting") return <div>Connecting...</div>

  if (status === "connected") return (
    <div>
      <div>Connected account {account} on chain ID {chainId}</div>
      <div>Current Beneficiary: {benefitiary}</div>
      {/* Import Add EC Page */}
      <hr />
      <h3>Donate</h3>
      <Donate beneficiary={benefitiary} />
      <hr />
      <h3>Donation History</h3>
      <DonationHistory />
      <hr />
      <h3>Change Beneficiary</h3>
      {/* <ChangeBeneficiary /> */}
      <hr />
      <h3>Pause Operations</h3>
      {/* <PauseOperations /> */}
      <br /><br /><br />
    </div>
  )

  return null;
}

export default App
