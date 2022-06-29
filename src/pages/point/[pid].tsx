import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAccount } from 'wagmi'
import PlacesAutocomplete from '../../components/PlacesAutocomplete'
import {
  useGetPointByIdQuery,
  useUpdatePointMutation,
} from '../../services/points'
import { TLocation, TPoint, TPointFormValues } from '../../types'

const EditPointPage: React.FC = () => {
  const router = useRouter()
  const { pid } = router.query

  const {
    data: point,
    error: pointError,
    isLoading: pointIsLoading,
    refetch: pointRefetch,
  } = useGetPointByIdQuery(String(pid))
  const [updatePoint, { isLoading: isUpdating, isSuccess }] =
    useUpdatePointMutation()
  const { data: account } = useAccount()

  const [location, selectLocation] = useState<TLocation>()

  const setDefaultValues = (values: TPoint): TPointFormValues => {
    return {
      name: values?.name || '',
      address: values?.location?.address || '',
      whatsapp: String(values?.contact?.whatsapp) || '',
      link: values?.contact?.link || '',
    }
  }

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    defaultValues: setDefaultValues(point),
  })

  const onSubmit: SubmitHandler<TPointFormValues> = (data) => {
    const whatsappNumber = String(data.whatsapp || '').replace(/\D+/g, '')

    updatePoint({
      id: point.id,
      name: data.name,
      owner: point.owner,
      location: { ...location },
      contact: {
        whatsapp: Number(whatsappNumber) || null,
        link: data.link,
      },
    }).then(() => {
      pointRefetch()
      resetForm()
    })
  }

  useEffect(() => {
    if (point?.id) {
      resetForm(setDefaultValues(point))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point])

  if (point && account && account.address !== point.owner) {
    return <h1 className={TitleSyle}>You are not the owner of this point</h1>
  }

  return (
    <>
      <h1 className={TitleSyle}>Edit Point</h1>
      {isUpdating || pointIsLoading ? (
        <span>Loading point</span>
      ) : (
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
            defaultValue={point?.location?.address}
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
            Edit Point
          </button>
        </form>
      )}
    </>
  )
}

export default EditPointPage

const TitleSyle = 'text-4xl'
const FormStyle = 'flex flex-col text-center w-full'
const InputStyle =
  'm-2 py-2 px-4 h-12 rounded-3xl outline-none focus:shadow-md border border-yellow-500'
const SelectStyle =
  'm-2 py-2 px-4 h-12 rounded-full outline-none focus:shadow-md bg-white border border-yellow-500'
const ButtonStyle =
  'm-2 h-12 px-6 rounded-full focus:outline-none bg-yellow-500 text-white border border-yellow-500'
const ErrorStyle = 'ring-red-500 ring-2'
