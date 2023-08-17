import { SignIn, PortkeyProvider, did } from "@portkey/did-ui-react";
import { useRef, useCallback, useState } from "react";
import "@portkey/did-ui-react/dist/assets/index.css"; // import portkey css
import BigNumber from "bignumber.js";
import AElf from "aelf-sdk";
import "./App.css";

const CHAIN_ID = "AELF";

const aelf = new AElf(
  new AElf.providers.HttpProvider("https://aelf-test-node.aelf.io")
);

const App = () => {
  const ref = useRef();
  const [wallet, setWallet] = useState();
  const [balance, setBalance] = useState(new BigNumber(0));
  const [message, setMessage] = useState("");

  const getBalance = async (wallet) => {
    const viewWallet = AElf.wallet.createNewWallet();
    setMessage("");

    try {
      setMessage("Fetching chainsInfo...");
      const chainsInfo = await did.services.getChainsInfo();
      const chainInfo = chainsInfo.find((chain) => chain.chainId === CHAIN_ID);

      setMessage("Fetching multiTokenContract...");
      const multiTokenContract = await aelf.chain.contractAt(
        chainInfo.defaultToken.address,
        viewWallet
      );

      setMessage("Fetching caInfo...");
      const caInfo = await did.didWallet.getHolderInfoByContract({
        caHash: wallet.caInfo.caHash,
        chainId: CHAIN_ID,
      });

      setMessage("Fetching GetBalance...");
      const result = await multiTokenContract.GetBalance.call({
        symbol: "ELF",
        owner: caInfo.caAddress,
      });

      const balance = new BigNumber(result?.balance).dividedBy(10 ** 8);

      setBalance(balance);
      setMessage("");
    } catch (err) {
      setMessage(err);
    }
  };

  const onFinish = useCallback((didWallet) => {
    setWallet(didWallet);
    getBalance(didWallet);
  }, []);

  return (
    <PortkeyProvider networkType={"TESTNET"}>
      <div className="my-app">
        <button
          onClick={() => {
            ref.current?.setOpen(true);
          }}
        >
          Sign In
        </button>
        <SignIn ref={ref} onFinish={onFinish} />
        {wallet ? (
          <>
            <button onClick={() => getBalance(wallet)}>getBalance</button>
            <p>
              Wallet address: ELF_{wallet.caInfo.caAddress}_{CHAIN_ID}
            </p>
            {message ? (
              <p>{message}</p>
            ) : (
              <p>Balance: {balance.toFixed(2)} ELF</p>
            )}
          </>
        ) : null}
      </div>
    </PortkeyProvider>
  );
};

export default App;
