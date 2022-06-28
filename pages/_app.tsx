import { WagmiConfig } from "wagmi";
import "../styles/globals.css";
import client from "../constants/wagmiClient";

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default MyApp;
