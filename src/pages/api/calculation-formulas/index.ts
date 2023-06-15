import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { calculationFormulaValidationSchema } from 'validationSchema/calculation-formulas';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCalculationFormulas();
    case 'POST':
      return createCalculationFormula();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCalculationFormulas() {
    const data = await prisma.calculation_formula
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'calculation_formula'));
    return res.status(200).json(data);
  }

  async function createCalculationFormula() {
    await calculationFormulaValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.calculated_result?.length > 0) {
      const create_calculated_result = body.calculated_result;
      body.calculated_result = {
        create: create_calculated_result,
      };
    } else {
      delete body.calculated_result;
    }
    const data = await prisma.calculation_formula.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
