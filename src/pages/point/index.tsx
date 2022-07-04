import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAccount } from 'wagmi'
import Header from '../../components/Header/Header'
import PlacesAutocomplete from '../../components/PlacesAutocomplete'
import WalletConnect from '../../components/WalletConnect/WalletConnect'
import { useAddPointMutation } from '../../services/points'
import { TLocation } from '../../types'

const TitleSyle = 'text-4xl text-center font-bold text-[color:var(--primary)]'
const FormStyle = 'flex flex-col text-center w-full mt-6'
const InputStyle =
  'm-2 py-2 px-4 h-12 rounded-3xl outline-none focus:shadow-md border border-[color:var(--primary)]'
const ButtonStyle =
  'm-2 h-12 px-6 rounded-full focus:outline-none bg-[color:var(--primary)] text-white border border-[color:var(--primary)]'
const ErrorStyle = 'ring-red-500 ring-2'

type TPointFormValues = {
  name: string
  address: string
  category: string
  whatsapp: string
  link: string
}

const NewPointPage = (): JSX.Element => {
  const [addPoint, { isLoading: isAdding, isSuccess }] = useAddPointMutation()
  const { data: account } = useAccount()
  const [isFormVisible, setFormVisibility] = useState(!!account?.address)

  const [location, selectLocation] = useState<TLocation>()

  useEffect(() => {
    let timeout
    if (account?.address) {
      timeout = setTimeout(() => {
        setFormVisibility(true)
      }, 2000)
    } else {
      setFormVisibility(false)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [account?.address])

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm()

  const onSubmit: SubmitHandler<TPointFormValues> = (data) => {
    const whatsappNumber = String(data.whatsapp || '').replace(/\D+/g, '')
    addPoint({
      name: data.name,
      owner: account.address,
      location: { ...location },
      contact: {
        whatsapp: Number(whatsappNumber) || null,
        link: data.link,
      },
    })
  }

  useEffect(() => {
    if (isSuccess) {
      resetForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  return (
    <main className="h-screen relative">
      <div className="mb-6">
        <Header />
      </div>
      <h1 className={TitleSyle}>Nuevo Point</h1>
      {!isFormVisible && (
        <>
          <div className="text-xl text-center mt-4">
            Conéctate para agregar un nuevo point
          </div>
          <div
            className={`px-6 py-4 w-max mx-auto mt-4 ${
              account?.address
                ? ''
                : 'rounded-full bg-[color:var(--secondary)] text-white'
            }`}
          >
            <WalletConnect hiddeDisconnect />
          </div>
        </>
      )}
      {isAdding ? (
        <span>Agregando nuevo Point</span>
      ) : (
        isFormVisible && (
          <form className={FormStyle} onSubmit={handleSubmit(onSubmit)}>
            <input
              className={`${InputStyle} ${errors.name ? ErrorStyle : ''}`}
              placeholder="Nombre del negocio"
              autoComplete="off"
              {...register('name', { required: true })}
            />
            <PlacesAutocomplete
              onSelect={selectLocation}
              className={errors.address ? ErrorStyle : ''}
              {...register('address', { required: true })}
            />
            <input
              className={`${InputStyle} ${errors.whatsapp ? ErrorStyle : ''}`}
              placeholder="WhatsApp: 351 123 123"
              type="number"
              autoComplete="off"
              {...register('whatsapp', {
                required: false,
                pattern: /^\d{10}$/,
              })}
            />
            <input
              className={`${InputStyle} ${errors.link ? ErrorStyle : ''}`}
              placeholder="Link de web o red social"
              autoComplete="off"
              {...register('link', {
                required: false,
              })}
            />
            <button className={ButtonStyle} type="submit">
              Agregar Point
            </button>
          </form>
        )
      )}
    </main>
  )
}

export default NewPointPage
