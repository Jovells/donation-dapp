import { useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import { ethers } from "ethers";
import { donation } from "../contract";


function Donate({ beneficiary }) {
    const { ethereum } = useMetaMask();
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [donated, setDonated] = useState(false);

    const donate = async () => {
        if (ethereum) {
            // Get Access to Signer
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            // Make Function Call
            console.log("Address: ", beneficiary);
            await donation.connect(signer).donate(message, {value: ethers.parseUnits(amount, 'wei') }).catch((err) => alert(err.message));
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