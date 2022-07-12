import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { MultiSelect } from 'react-multi-select-component'
import { useAccount } from 'wagmi'
import Header from '../../components/Header/Header'
import PlacesAutocomplete from '../../components/PlacesAutocomplete'
import WalletConnect from '../../components/WalletConnect/WalletConnect'
import { useAddPointMutation } from '../../services/points'
import {
  ECoins,
  EFiat,
  EPaymentMethod,
  TLocation,
  TPointFormValues,
} from '../../types'

const TitleSyle = 'text-4xl text-center font-bold text-[color:var(--primary)]'
const FormStyle = 'flex flex-col text-center w-full mt-6'
const InputStyle =
  'm-2 py-2 px-4 h-12 rounded-3xl outline-none focus:shadow-md border border-[color:var(--primary)]'
const CheckboxStyle =
  'm-2 py-2 px-4 h-3 rounded-3xl outline-none focus:shadow-md border border-[color:var(--primary)]'
const ButtonStyle =
  'm-2 h-12 px-6 rounded-full focus:outline-none bg-[color:var(--primary)] text-white border border-[color:var(--primary)]'
const ErrorStyle = 'ring-red-500 ring-2'

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

  const setDefaultValues = (): TPointFormValues => {
    return {
      name: '',
      address: '',
      whatsappNumber: null,
      telegramUser: '',
      description: '',
      coins: [],
      fiat: [],
      exchangeMin: null,
      exchangeMax: null,
      shipping: false,
      paymentMethods: [],
    }
  }

  const {
    register,
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    defaultValues: setDefaultValues(),
  })

  const onSubmit: SubmitHandler<TPointFormValues> = (data) => {
    addPoint({
      name: data.name,
      owner: account.address,
      location: { ...location },
      whatsappNumber: data.whatsappNumber,
      telegramUser: data.telegramUser?.replace('@', ''),
      description: data.description,
      coins: data.coins,
      fiat: data.fiat,
      exchangeMin: data.exchangeMin,
      exchangeMax: data.exchangeMax,
      shipping: data.shipping,
      paymentMethods: data.paymentMethods,
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
              placeholder="Nombre"
              autoComplete="off"
              {...register('name', { required: true, maxLength: 16 })}
            />
            <textarea
              className={`${InputStyle} ${
                errors.description ? ErrorStyle : ''
              }`}
              placeholder="Descripción"
              autoComplete="off"
              {...register('description', { required: false, maxLength: 60 })}
            />
            <PlacesAutocomplete
              onSelect={selectLocation}
              className={errors.address ? ErrorStyle : ''}
              {...register('address', { required: true })}
            />
            <input
              className={`${InputStyle} ${
                errors.whatsappNumber ? ErrorStyle : ''
              }`}
              placeholder="WhatsApp: 123 123 1234"
              type="number"
              autoComplete="off"
              {...register('whatsappNumber', {
                required: false,
                pattern: /^\d{10}$/,
              })}
            />
            <input
              className={`${InputStyle} ${
                errors.telegramUser ? ErrorStyle : ''
              }`}
              placeholder="Telegram: @usuario"
              autoComplete="off"
              {...register('telegramUser', {
                required: false,
              })}
            />
            <Controller
              control={control}
              name="coins"
              render={({ field: { onChange, value } }) => (
                <MultiSelect
                  options={[
                    ...Object.keys(ECoins).map(
                      (coin): { value: string; label: string } => {
                        return {
                          label: coin,
                          value: coin,
                        }
                      }
                    ),
                  ]}
                  value={[
                    ...value.map((coin): { value: string; label: string } => {
                      return {
                        label: coin,
                        value: coin,
                      }
                    }),
                  ]}
                  onChange={(newVal) => onChange(newVal?.map((v) => v.value))}
                  labelledBy="coins"
                  overrideStrings={{
                    allItemsAreSelected: 'Todas',
                    clearSelected: 'Borrar selección',
                    selectAll: 'Seleccionar todas',
                    selectSomeItems: 'Cryptos',
                  }}
                  disableSearch
                  className="multiselect"
                />
              )}
            />
            <Controller
              control={control}
              name="fiat"
              render={({ field: { onChange, value } }) => (
                <MultiSelect
                  options={[
                    ...Object.keys(EFiat).map(
                      (coin): { value: string; label: string } => {
                        return {
                          label: coin,
                          value: coin,
                        }
                      }
                    ),
                  ]}
                  value={[
                    ...value.map((coin): { value: string; label: string } => {
                      return {
                        label: coin,
                        value: coin,
                      }
                    }),
                  ]}
                  onChange={(newVal) => onChange(newVal?.map((v) => v.value))}
                  labelledBy="fiat"
                  overrideStrings={{
                    allItemsAreSelected: 'Todas',
                    clearSelected: 'Borrar selección',
                    selectAll: 'Seleccionar todas',
                    selectSomeItems: 'Monedas',
                  }}
                  disableSearch
                  className="multiselect"
                />
              )}
            />
            <input
              className={`${InputStyle} ${
                errors.exchangeMin ? ErrorStyle : ''
              }`}
              placeholder="Min: $USD"
              type="number"
              autoComplete="off"
              {...register('exchangeMin', {
                required: false,
              })}
            />
            <input
              className={`${InputStyle} ${
                errors.exchangeMax ? ErrorStyle : ''
              }`}
              placeholder="Max: $USD"
              type="number"
              autoComplete="off"
              {...register('exchangeMax', {
                required: false,
              })}
            />
            <div className="flex">
              <input
                className={`${CheckboxStyle} ${
                  errors.shipping ? ErrorStyle : ''
                }`}
                placeholder="Envios"
                type="checkbox"
                autoComplete="off"
                {...register('shipping', {
                  required: false,
                })}
              />
              <span>Realizo envíos</span>
            </div>
            <Controller
              control={control}
              name="paymentMethods"
              render={({ field: { onChange, value } }) => (
                <MultiSelect
                  options={[
                    ...Object.keys(EPaymentMethod).map(
                      (coin): { value: string; label: string } => {
                        return {
                          label: coin,
                          value: coin,
                        }
                      }
                    ),
                  ]}
                  value={[
                    ...value.map((coin): { value: string; label: string } => {
                      return {
                        label: coin,
                        value: coin,
                      }
                    }),
                  ]}
                  onChange={(newVal) => onChange(newVal?.map((v) => v.value))}
                  labelledBy="paymentMethods"
                  overrideStrings={{
                    allItemsAreSelected: 'Todos',
                    clearSelected: 'Borrar selección',
                    selectAll: 'Seleccionar todos',
                    selectSomeItems: 'Métodos de pago',
                  }}
                  disableSearch
                  className="multiselect"
                />
              )}
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
