import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TPoint } from '../types'

export const pointsAPI = createApi({
  reducerPath: 'pointsAPI',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.API_URI }),
  endpoints: (builder) => ({
    getPoints: builder.query<TPoint[], void>({
      query: () => '/api/points/',
    }),
    getPointById: builder.query<TPoint, TPoint['id']>({
      query: (id) => `/api/point/${id}`,
    }),
    addPoint: builder.mutation<
      TPoint,
      Omit<TPoint, 'id' | 'created' | 'updated'>
    >({
      query: (body: Omit<TPoint, 'id' | 'created' | 'updated'>) => ({
        url: '/api/point',
        method: 'POST',
        body,
      }),
    }),
    updatePoint: builder.mutation<TPoint, Omit<TPoint, 'created' | 'updated'>>({
      query: (body: Omit<TPoint, 'created' | 'updated'>) => ({
        url: `/api/point/${body.id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
})

export const {
  useGetPointsQuery,
  useGetPointByIdQuery,
  useAddPointMutation,
  useUpdatePointMutation,
} = pointsAPI
