import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import WalletOptionsModal from '../WalletOptionsModal/WalletOptionsModal'

const WalletConnect = ({
  hiddeDisconnect = false,
}: {
  hiddeDisconnect?: boolean
}): JSX.Element => {
  const { data: account } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address })
  const { data: ensName } = useEnsName({ address: account?.address })
  const { disconnect } = useDisconnect()
  const [isModalOpen, setModalOpen] = useState(false)
  const [isAccountVisible, setAccountVisibility] = useState(false)

  useEffect(() => {
    if (account && isModalOpen) {
      setModalOpen(false)
    }
    if (account) {
      setAccountVisibility(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const handleOnConnect = (): void => {
    setAccountVisibility(true)
  }
  const handleDisconnect = (): void => {
    disconnect()
    setAccountVisibility(false)
  }

  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 4)}...${address.slice(address.length - 4)}`
  }

  return (
    <>
      {isAccountVisible && (
        <div className="flex justify-center flex-col">
          <div className="mb-4 text-center">
            {ensAvatar && <Image src={ensAvatar} alt="ENS Avatar" />}
            <div>
              {ensName
                ? `${ensName} (${truncateAddress(account.address)})`
                : truncateAddress(account.address)}
            </div>
            <div className="text-green-600">
              Connectado a {account?.connector?.name}
            </div>
          </div>
          {!hiddeDisconnect && (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 mx-2 rounded-full bg-blue-400"
              type="button"
            >
              Desconectar
            </button>
          )}
        </div>
      )}
      {!isAccountVisible && (
        <div className="flex justify-center">
          <button onClick={() => setModalOpen((prev) => !prev)} type="button">
            Conectar Wallet
          </button>
        </div>
      )}
      <WalletOptionsModal
        open={isModalOpen}
        setOpen={setModalOpen}
        onConnect={handleOnConnect}
      />
    </>
  )
}

export default WalletConnect
