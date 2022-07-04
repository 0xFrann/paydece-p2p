import Image from 'next/image'

const Welcome = (): JSX.Element => {
  return (
    <div className="absolute z-50 left-0 top-0 h-screen w-full flex flex-col items-center justify-center brand-gradient-vertical">
      <Image
        src="./images/paydece-logo.svg"
        alt="PayDece Logo"
        className="w-2/3 animate-pulse"
      />
    </div>
  )
}

export default Welcome
