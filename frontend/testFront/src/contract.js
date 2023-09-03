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


const CONTRACT_ADDRESS = "0x0aDa7CfA69Add88C2BF2B2e15979A4d509Deaa1A";
const p2 = new ethers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/fjfWrvNtk0DZ2dlAlWPk1I7FhdZemfrj");
const provider = new ethers.WebSocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/fjfWrvNtk0DZ2dlAlWPk1I7FhdZemfrj")

// new alchemy.ws.on(eventName, listener)
export const donation = new ethers.Contract(CONTRACT_ADDRESS, ABI, p2 );

provider.websocket.onopen(()=>console.log("connected"))