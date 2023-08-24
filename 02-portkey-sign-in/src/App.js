import { SignIn, PortkeyProvider } from "@portkey/did-ui-react";
import { useRef, useState } from "react";
import "@portkey/did-ui-react/dist/assets/index.css"; // import portkey css
import "./App.css";

const App = () => {
  const signInComponentRef = useRef();
  const [wallet, setWallet] = useState();

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
        <SignIn
          ref={signInComponentRef}
          onFinish={(wallet) => {
            setWallet(wallet);
          }}
        />
        {wallet && (
          <p>
            Wallet address: ELF_{wallet?.caInfo.caAddress}_{wallet?.chainId}
          </p>
        )}
      </div>
    </PortkeyProvider>
  );
};

export default App;
