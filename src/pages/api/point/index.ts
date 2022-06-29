import { NextApiRequest, NextApiResponse } from 'next'
import { TPoint } from '../../../types'
import db from '../../../utils/db'

interface IPointCreation extends NextApiRequest {
  body: Omit<TPoint, 'id'>
}

export default async (
  req: IPointCreation,
  res: NextApiResponse
): Promise<void> => {
  try {
    const { name, location } = req.body
    const points = await db.collection('points').get()
    const pointsData = points.docs.map((points) => points.data())

    if (
      pointsData.some(
        (point) =>
          point.name === name && point.location.address === location.address
      )
    ) {
      res.status(409).json({
        message: 'Point already exists',
      })
    } else {
      const { id } = await db.collection('points').add({
        ...req.body,
        created: new Date().toISOString(),
      })
      res.status(200).json({ id })
    }
  } catch (e) {
    res.status(400).end()
  }
}
