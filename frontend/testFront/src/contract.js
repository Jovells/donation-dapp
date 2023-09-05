import { ethers } from "ethers";
import ABI from "./abi.json" assert { type: "json" };

// const CONTRACT_ADDRESS = "0x4725F47b49E508856Afd6F0badDCb28d8f4427F6";
const CONTRACT_ADDRESS = "0x84f0114ad4BEb008ce2B47473413F7bdC2ec50bb";
// const provider = new ethers.providers.WebSocketProvider(`wss://polygon-mumbai.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || "" }`)
const provider = new ethers.WebSocketProvider(`wss://polygon-mumbai.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`);
// const provider = new ethers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`);
// const contract = new ethers.Contract(ADDRESS, ABI, provider);
export const donationContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider );
// donationContract.on('EmergencyStopSet', ()=> console.log('EmergencyStopSet on contract.js'));
// donationContract.on('BeneficiaryChanged', ()=> console.log('BeneficiaryChanged on contract.js'));
