import { WagmiConfig } from "wagmi";
import client from "../constants/wagmiClient";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import { store } from "../app/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    </Provider>
  );
}

export default MyApp;
