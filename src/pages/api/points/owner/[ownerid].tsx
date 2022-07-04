import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../../services/db'
import { TPoint } from '../../../../types'

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TPoint>
): Promise<void> => {
  const { ownerid } = req.query

  try {
    const points = await db.collection('points').orderBy('created').get()
    const pointsData = points.docs.map(
      (data) =>
        ({
          id: data.id,
          ...data.data(),
        } as TPoint)
    )
    const pointByOwner = pointsData.filter((p) => p.owner == ownerid)[0]
    if (typeof pointByOwner === undefined) throw new Error('No point found')
    res.status(200).json(pointByOwner)
  } catch (e) {
    res.status(400).end(e.message)
  }
}
