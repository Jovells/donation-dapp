import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import { donationContract } from "../contract";

const EthersContext = createContext();

function EthersProvider({ children }) {
    const { status, connect, account, chainId, ethereum } = useMetaMask();
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [connectedContract, setConnectedContract] = useState(null);



    useEffect(() => {
        async function init() {
            if (ethereum) {
                const provider = new ethers.BrowserProvider(ethereum);
                const newSigner = await provider.getSigner();
                setConnectedContract(donationContract.connect(newSigner));
                setProvider(provider);
                // setSigner(s);
            }
        }
        init();
    }, [ethereum, signer]);

    return (
        <EthersContext.Provider value={{ provider, signer, donation: connectedContract, status, connect, account, chainId, ethereum }}>
            {children}
        </EthersContext.Provider>
    );
}

export { EthersContext, EthersProvider };