import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import 'tailwindcss/tailwind.css'
import { WagmiConfig } from 'wagmi'
import { store } from '../app/store'
import client from '../constants/wagmiClient'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <Provider store={store}>
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    </Provider>
  )
}

export default MyApp
