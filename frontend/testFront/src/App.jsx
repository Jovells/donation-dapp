import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useMetaMask } from "metamask-react";
import Donate from './pages/Donate';
import { ethers } from "ethers";
import { donation } from "./contract";
import DonationHistory from './pages/DonationHistory';
import ChangeBeneficiary from './pages/ChangeBeneficiary';
import PauseOperations from './pages/PauseOperations';
import { EthersContext } from './utils/EtherContext';
import WithdrawFunds from './pages/WithdrawFunds';

function App() {
  const [beneficiary, setBeneficiary] = useState("");
  const [totalDonations, setTotalDonations] = useState(0);
  const { provider, donation, status, connect, account, chainId, ethereum} = useContext(EthersContext)

  useEffect(() => {
    async function getCurrentBeneficiary() {
      if (donation) {
        // console.log("Ethereum: ", ethereum)
        // Get Access to Signer
        // console.log({signer, donation});
        // Make Function Call
        try {
          const donationsAmount = await donation.getAmountReceived();
          setTotalDonations(donationsAmount);
          const currentBeneficiary = await donation.currentBeneficiary()
          setBeneficiary(currentBeneficiary);
        } catch (error) {
          console.log(error)
        }
      }
    }

    getCurrentBeneficiary();

    return () => {
    }
  }, [ethereum, donation, beneficiary])
  

  if (status === "initializing") return <div>Synchronisation with MetaMask ongoing...</div>

  if (status === "unavailable") return <div>MetaMask not available </div>

  if (status === "notConnected") return <button onClick={connect}>Connect to MetaMask</button>

  if (status === "connecting") return <div>Connecting...</div>

  if (status === "connected") return (
    <div>
      <div>Connected account {account} on chain ID {chainId}</div>
      <div>Current Beneficiary: {beneficiary}</div>
      <div>Total Donations: {ethers.utils.formatEther(totalDonations)}</div>
      {/* Import Add EC Page */}
      <hr />
      <h3>Donate</h3>
      <Donate beneficiary={beneficiary} />
      <hr />
      <h3>Donation History</h3>
      <DonationHistory />
      <hr />
      <h3>Change Beneficiary</h3>
      <ChangeBeneficiary />
      <hr />
      <h3>Pause Operations</h3>
      <PauseOperations />
      <hr />
      <h3>Withdraw Funds</h3>
      <WithdrawFunds />
      <br /><br /><br />
    </div>
  )

  return null;
}

export default App
