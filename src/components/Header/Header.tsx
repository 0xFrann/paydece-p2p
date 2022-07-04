import { useState } from 'react'
import CloseIcon from '../../assets/close-icon.svg'
import MenuIcon from '../../assets/menu-icon.svg'
import HeaderMenu from './HeaderMenu'

const MenuButtonStyle =
  'text-gray-100 flex items-center cursor-pointer focus:outline-none'
const MenuIconStyle = 'fill-current text-gray-100'

const Header = () => {
  const [isMenuVisible, setMenuVisible] = useState(false)
  const toggleMenuVisible = () => setMenuVisible((prev) => !prev)

  return (
    <>
      <header className="relative flex justify-between items-center py-4 px-6 w-full brand-gradient-horizontal">
        <img src="/images/paydece-logo.svg" alt="PayDece Logo" width={160} />
        <button onClick={toggleMenuVisible} className={MenuButtonStyle}>
          {isMenuVisible ? (
            <CloseIcon width={20} height={20} className={MenuIconStyle} />
          ) : (
            <MenuIcon width={20} height={20} className={MenuIconStyle} />
          )}
        </button>
      </header>
      <HeaderMenu visible={isMenuVisible} toggleVisible={toggleMenuVisible} />
    </>
  )
}

export default Header
