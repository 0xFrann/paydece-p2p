import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
  Chain
} from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const alchemyId = process.env.ALCHEMY_ID;

// Define BSC chain
const bscChain: Chain = {
  id: 56,
  name: "Binance Smart Chain",
  network: "BSC",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Coin",
    symbol: "BNB"
  },
  rpcUrls: {
    default: "https://bsc-dataseed.binance.org/"
  },
  blockExplorers: {
    default: { name: "BSCScan", url: "https://bscscan.com" }
  },
  testnet: false
};

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [...defaultChains, bscChain],
  [alchemyProvider({ alchemyId }), publicProvider()]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi"
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true
      }
    })
  ],
  provider,
  webSocketProvider
});

export default client;
