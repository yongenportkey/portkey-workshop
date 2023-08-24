import { SignIn, PortkeyProvider, did } from "@portkey/did-ui-react";
import { useRef, useCallback, useState } from "react";
import "@portkey/did-ui-react/dist/assets/index.css"; // import portkey css
import AElf from "aelf-sdk";
import "./App.css";

const CHAIN_ID = "AELF";

const aelf = new AElf(
  new AElf.providers.HttpProvider("https://aelf-test-node.aelf.io")
);

const App = () => {
  const signInComponentRef = useRef();
  const [wallet, setWallet] = useState();
  const [message, setMessage] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const getNFT = async (wallet) => {
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

      setMessage("Fetching NFT...");
      const result = await multiTokenContract.GetTokenInfo.call({
        symbol: "WKSPNFTAAA-6",
        owner: caInfo.caAddress,
      });

      setImgUrl(result?.externalInfo?.value?.["__nft_image_url"]);

      setMessage("");
    } catch (err) {
      setMessage(err);
    }
  };

  const onFinish = useCallback((didWallet) => {
    setWallet(didWallet);
  }, []);

  return (
    <PortkeyProvider networkType={"TESTNET"}>
      <div className="my-app">
        <button
          onClick={() => {
            signInComponentRef.current?.setOpen(true);
          }}
        >
          Sign In
        </button>
        <SignIn ref={signInComponentRef} onFinish={onFinish} />
        {wallet ? (
          <>
            <button onClick={() => getNFT(wallet)}>getNFT</button>
            <p>
              Wallet address: ELF_{wallet.caInfo.caAddress}_{CHAIN_ID}
            </p>
            {message ? (
              <p>{message}</p>
            ) : (
              <img src={imgUrl} width="600" alt="NFT image" />
            )}
          </>
        ) : null}
      </div>
    </PortkeyProvider>
  );
};

export default App;
