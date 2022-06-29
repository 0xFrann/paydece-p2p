import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TPoint } from '../types'

export const pointsAPI = createApi({
  reducerPath: 'pointsAPI',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.API_URI }),
  endpoints: (builder) => ({
    getPoints: builder.query<TPoint[], void>({
      query: () => 'api/points/',
    }),
    addPoint: builder.mutation<TPoint, Omit<TPoint, 'id'>>({
      query: (body: Omit<TPoint, 'id'>) => ({
        url: 'api/point',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useGetPointsQuery, useAddPointMutation } = pointsAPI
