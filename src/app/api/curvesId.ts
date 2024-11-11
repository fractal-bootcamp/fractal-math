import { NextApiRequest, NextApiResponse } from "next";
import { WolframAPI } from "../../lib/wolfram";
import { PrismaClient } from "@prisma/client";
import { CurveResponse } from "../../types/curves";

const prisma = new PrismaClient();

const wolframeAPI = new WolframAPI(process.env.WOLFRAM_APP_ID!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ messgae: "method not allowed" });
  }
  const { id } = req.query;

  try {
    const curve = await prisma.curve.findUnique({
      where: {
        id: id as string,
      },
      include: {
        category: true,
      },
    });

    if (!curve) {
      return res.status(404).json({ messgae: "curve not found" });
    }

    // parse the JSON stored equations and parameters
    const equations = JSON.parse(curve.equations as string);
    const parameters = JSON.parse(curve.parameters as string);

    // fetch wolfram data
    const wolframData = await wolframeAPI.getCurveData(curve.wolframeId);

    // cache response
    res.setHeader("Cache-Control", "s-maxage-3600");

    // return formatted response
    return res.status(200).json({
      id: curve.id,
      name: curve.name,
      description: curve.description,
      wolframeId: curve.wolframeId,
      category: {
        id: curve.category.id,
        name: curve.category.name,
        description: curve.category.description,
      },
      equations,
      parameters,
      wolframData,
    });
  } catch (error) {
    console.error("Error fetching curve data:", error);
    return res.status(500).json({ message: "Error fetching curve data" });
  } finally {
    await prisma.$disconnect();
  }
}
