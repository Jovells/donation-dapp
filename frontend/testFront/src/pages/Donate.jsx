import { useContext, useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import { ethers } from "ethers";
import { donation } from "../contract";
import { EthersContext } from "../utils/EtherContext";


function Donate({ beneficiary }) {
    const { donation, ethereum } = useContext(EthersContext)
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [donated, setDonated] = useState(false);

    const donate = async () => {
        if (ethereum) {
            // Get Access to Signer
            // Make Function Call
            console.log("Address: ", beneficiary);
            await donation.donate(message, {value: ethers.utils.parseUnits(amount, 'wei') }).catch((err) => alert(err.message));
            setDonated('Thank you for your donation!');

        }
    }

    return (
        <div>
            {donated && <div>{donated}</div>}
            <input type="text" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
            <input type="text" placeholder="Message" onChange={(e) => setMessage(e.target.value)} />
            <button onClick={donate}>Donate</button>
        </div>
    );
}

export default Donate;