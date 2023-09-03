import { useEffect, useState } from 'react'
import { useMetaMask } from "metamask-react";
import { ethers } from "ethers";
import { donation } from "../contract";

export default function DonationHistory() {

    const { ethereum } = useMetaMask();
    const [history, setHistory] = useState([]);


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
        const donationCounter = await myDonation.donationCounter();
        //get block in which contract was deployed
        const contractBlockNumber = await myDonation.deploymentblockNumber()
        const currentBlockNumber = await provider.getBlockNumber();
        // console.log('currentBlockNumber: ', currentBlockNumber);
        // console.log('contractBlockNumber: ', contractBlockNumber);

        const filt = myDonation.filters.DonationReceived();

        console.log(filt)

        donation.on(filt, (donationId, donor, amount, message, timestamp) => {
            console.log('donationId: ', donationId, 'donor: ', donor, 'amount: ', amount, 'message: ', message, 'timestamp: ', timestamp);
            setHistory((history) => [...history, {donationId, donor, amount, message, timestamp}]);
        })
    
        // myDonation.on("DonationReceived", (donationId, donor, amount, message, timestamp) => {
        //     console.log('donationId: ', donationId, 'donor: ', donor, 'amount: ', amount, 'message: ', message, 'timestamp: ', timestamp);
        //     setHistory((history) => [...history, {donationId, donor, amount, message, timestamp}]);
        // })

        //function to get events, 1000 blocks at a time, then recursively call itself until all events are retrieved
        async function getEvents() {
            let cursor = BigInt(contractBlockNumber);
            const events = [];

            async function getBatch(start){
                let end = BigInt(start) + BigInt(999);

                cursor = end + BigInt(1);
                if (end > BigInt(currentBlockNumber)) {
                    // console.log('end: ', end, 'currentBlockNumber: ', currentBlockNumber);
                    end = BigInt(currentBlockNumber);
                }
                // console.log('start: ', start, 'end: ', end, 'difference', end - start);
                const newEvents = await myDonation.queryFilter(myDonation.filters.DonationReceived, start, end);
                // console.log('newEvents: ', newEvents);
                return newEvents;
            }


            while ((events.length < donationCounter) && (cursor < BigInt(currentBlockNumber))) {
                // console.log('events: ', events.length);
                events.push(...await getBatch(cursor));
            }

            return events;

        }

        const allEvents = await getEvents();

   const history = allEvents.map((event) => {
          const eventLog = donation.interface.parseLog(event);
          const [donationId, donor, amount, message, timestamp] = event.args
        //   console.log('eventLog: ', donationId, donor, amount, message, timestamp);
            return {donationId: String(donationId), 
                donor, 
                amount :ethers.formatEther(amount), 
                message, 
                timestamp: new Date(parseInt(timestamp) * 1000).toUTCString()}
        });

    
       
        setHistory(history);
      }
    }

    getCurrentBeneficiary();

    
    return () => {
    }
  }, [ethereum])
  
  return(
    <>
    {history.map((donation) => 
            <div key={donation.donationId}>
            <div>Donation ID: {donation.donationId}</div>
            <div>Donor: {donation.donor}</div>
            <div>Amount: {donation.amount}</div>
            <div>Message: {donation.message}</div>
            <div>Timestamp: {donation.timestamp}</div>
            </div>
        
    )}
    </>
  )}