import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../services/db'
import { TPoint } from '../../../types'

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TPoint[]>
): Promise<void> => {
  try {
    const points = await db.collection('points').orderBy('created').get()
    const pointsData = points.docs.map(
      (data) =>
        ({
          id: data.id,
          ...data.data(),
        } as TPoint)
    )
    res.status(200).json([...pointsData])
  } catch (e) {
    res.status(400).end()
  }
}
