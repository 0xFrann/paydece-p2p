import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useGetPointByOwnerQuery } from '../../services/points'
import WalletConnect from '../WalletConnect/WalletConnect'

const HeaderMenuStyle =
  'absolute top-16 transition-all flex flex-col justify-between duration-300 z-50 bg-[color:var(--primary)] p-6 w-full text-white'
const MenuListStyle = 'py-5 px-2 space-y-4'
const MenuLinkStyle =
  'text-lg text-gray-100 hover:text-yellow-700 focus:text-yellow-900 active:text-yellow-900 transition-colors cursor-pointer focus:outline-none'

interface IHeaderMenuProps {
  visible?: boolean
  toggleVisible?: () => void
}

const HeaderMenu = ({
  visible = false,
  toggleVisible = () => {},
}: IHeaderMenuProps): React.ReactElement => {
  const router = useRouter()
  const goTo = (url: string): void => {
    router.push(url)
    toggleVisible()
  }
  const { data: account, refetch: refetchAccount } = useAccount()

  const { data: point, refetch: refetchPoint } = useGetPointByOwnerQuery(
    account?.address || ''
  )

  useEffect(() => {
    if (account?.address) {
      refetchPoint()
    } else {
      refetchAccount()
    }
  }, [account?.address])

  return (
    <div
      className={`${HeaderMenuStyle} ${
        visible ? 'opacity-100 left-0' : 'opacity-0 -left-full'
      }`}
    >
      <ul className={MenuListStyle}>
        <li>
          <button onClick={() => goTo('/')} className={MenuLinkStyle}>
            ▸ Mapa
          </button>
        </li>
        <li>
          <button onClick={() => goTo('/point')} className={MenuLinkStyle}>
            ▸ Agregar negocio
          </button>
        </li>
        {!!account?.address && !!point?.id && (
          <li>
            <button
              onClick={() => goTo(`/point/${point.id}`)}
              className={MenuLinkStyle}
            >
              ▸ Mi negocio
            </button>
          </li>
        )}
        {/* <li>
          <button onClick={() => goTo("/support")} className={MenuLinkStyle}>
            ▸ Dejar sugerencia
          </button>
        </li> */}
      </ul>
      <div
        className={`px-4 py-2 w-max mx-auto mt-6 ${
          !!account?.address
            ? ''
            : 'rounded-full bg-[color:var(--secondary)] text-white'
        }`}
      >
        <WalletConnect />
      </div>
    </div>
  )
}

export default HeaderMenu
