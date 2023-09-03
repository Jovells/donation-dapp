import { ethers } from "ethers";
import ABI from "./abi.json";
import dotenv from "dotenv";
import { Network, Alchemy } from "alchemy-sdk";

// dotenv.config();

const settings = {
    apiKey: "fjfWrvNtk0DZ2dlAlWPk1I7FhdZemfrj",
    network: Network.MATIC_MUMBAI,
};
const alchemy = new Alchemy(settings);


const CONTRACT_ADDRESS = "0x4725F47b49E508856Afd6F0badDCb28d8f4427F6";
// const p2 = new ethers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/fjfWrvNtk0DZ2dlAlWPk1I7FhdZemfrj");
const provider = new ethers.providers.WebSocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/fjfWrvNtk0DZ2dlAlWPk1I7FhdZemfrj")

// new alchemy.ws.on(eventName, listener)
export const donation = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider )

// provider.websocket.onopen(()=>console.log("connected"))