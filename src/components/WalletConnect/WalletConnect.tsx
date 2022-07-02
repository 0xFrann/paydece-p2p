import { useEffect, useState } from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import WalletOptionsModal from '../WalletOptionsModal/WalletOptionsModal'

const WalletConnect = () => {
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

  const handleOnConnect = (address: string) => {
    alert(address)
    setAccountVisibility(true)
  }
  const handleDisconnect = () => {
    disconnect()
    setAccountVisibility(false)
  }

  return (
    <>
    {isAccountVisible && (
          <div className="flex justify-center flex-col">
            <div className="mb-4 text-center">
              {ensAvatar && <img src={ensAvatar} alt="ENS Avatar" />}
              <div>
                {ensName ? `${ensName} (${account.address})` : account.address}
              </div>
              <div className="text-green-600">
                Connected to {account?.connector?.name}
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 mx-2 rounded-full bg-blue-400"
            >
              Disconnect
            </button>
          </div>
        )}
        {!isAccountVisible && (
          <div className="flex justify-center">
            <button onClick={() => setModalOpen((prev) => !prev)}>
              Connect Wallet
            </button>
          </div>
        )}
        <WalletOptionsModal
          open={isModalOpen}
          setOpen={setModalOpen}
          onConnect={handleOnConnect}
        />
    </>  
    )}
  )
}

export default WalletConnect