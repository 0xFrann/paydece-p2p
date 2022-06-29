import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAddPointMutation, useGetPointsQuery } from '../services/points'

type TPointFormValues = {
  name: string
  address: string
  category: string
  whatsapp: string
  link: string
}

const PointViewPage: React.FC = () => {
  const { data: points, error, isLoading, refetch } = useGetPointsQuery()
  const [addPoint, { isLoading: isAdding, isSuccess }] = useAddPointMutation()

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
      category: data.category,
      location: {
        latLng: {
          lat: 0,
          lng: 0,
        },
        address: 'currentLocation',
      },
      contact: {
        whatsapp: Number(whatsappNumber) || null,
        link: data.link,
      },
    })
  }

  useEffect(() => {
    if (isSuccess) {
      resetForm()
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  return (
    <>
      <h1 className={TitleSyle}>Add Point</h1>
      {isAdding ? (
        <span>Adding new post</span>
      ) : (
        <form className={FormStyle} onSubmit={handleSubmit(onSubmit)}>
          <input
            className={`${InputStyle} ${errors.name ? ErrorStyle : ''}`}
            placeholder="Nombre del negocio"
            autoComplete="off"
            {...register('name', { required: true })}
          />
          <select
            className={`${SelectStyle} ${errors.category ? ErrorStyle : ''}`}
            placeholder="Categoría"
            {...register('category', { required: true })}
          >
            <option value={1} className="capitalize">
              {1}
            </option>
            <option value={2} className="capitalize">
              {2}
            </option>
          </select>
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
            Add Point
          </button>
        </form>
      )}

      <h1 className={TitleSyle}>Point List</h1>
      {error && <strong>Something went wrong</strong>}
      {isLoading && <strong>Loading</strong>}
      {points && (
        <ul>
          {points.map((d) => (
            <li key={d.id}>{d.name}</li>
          ))}
        </ul>
      )}
    </>
  )
}

export default PointViewPage

const TitleSyle = 'text-4xl'
const FormStyle = 'flex flex-col text-center w-full'
const InputStyle =
  'm-2 py-2 px-4 h-12 rounded-3xl outline-none focus:shadow-md border border-yellow-500'
const SelectStyle =
  'm-2 py-2 px-4 h-12 rounded-full outline-none focus:shadow-md bg-white border border-yellow-500'
const ButtonStyle =
  'm-2 h-12 px-6 rounded-full focus:outline-none bg-yellow-500 text-white border border-yellow-500'
const ErrorStyle = 'ring-red-500 ring-2'
