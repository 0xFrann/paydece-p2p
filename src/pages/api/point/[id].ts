import { NextApiRequest, NextApiResponse } from "next";
import { TPoint } from "../../../types";
import db from "../../../utils/db";

interface IPointRequest extends NextApiRequest {
  query: {
    id: string;
  };
  body: TPoint;
}

export default async (
  req: IPointRequest,
  res: NextApiResponse
): Promise<void> => {
  const { id } = req.query;

  try {
    if (req.method === "PUT") {
      await db
        .collection("points")
        .doc(id)
        .update({
          ...req.body,
          updated: new Date().toISOString()
        });
      res.status(200).json({ message: "Point modified" });
    } else if (req.method === "GET") {
      const doc = await db.collection("points").doc(id).get();
      if (!doc.exists) {
        res.status(404).json({ message: "Point doesn't exists" });
      } else {
        res.status(200).json({ id: doc.id, ...doc.data() });
      }
    } else if (req.method === "DELETE") {
      await db.collection("points").doc(id).delete();
      res.status(200).json({ message: "Point deleted" });
    }
  } catch (e) {
    res.status(400).end();
  }
};
