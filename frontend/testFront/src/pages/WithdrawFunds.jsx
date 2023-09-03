import { useContext, useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import { ethers } from "ethers";
import { EthersContext } from "../utils/EtherContext";


function WithdrawFunds({ beneficiary }) {
    const { provider, donation, ethereum } = useContext(EthersContext);
    const [fundsWithdrawn, setFundsWithdrawn] = useState(false);

    const withdrawFunds = async () => {
        if (ethereum) {
            // Get Access to Signer
            // Make Function Call
            console.log("Address: ", beneficiary);
            await donation.withdrawFunds().catch((err) => alert(err.message));
            setFundsWithdrawn(!fundsWithdrawn);

        }
    }

    return (
        <div>
            <div> {fundsWithdrawn ? "Funds Withdrawn": "Click to withdraw funds" } </div>
            <button onClick={withdrawFunds}>Withdraw Funds</button>
        </div>
    );
}

export default WithdrawFunds;