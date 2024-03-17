import type {
  GrossToNetConfig,
} from 'brutoneto'
import {
  MAX_PERSONAL_ALLOWANCE_COEFFICIENT,
  MIN_PERSONAL_ALLOWANCE_COEFFICIENT,
  THIRD_PILLAR_NON_TAXABLE_LIMIT,
  detailedSalary,
  grossToNet,
  isValidPlace,
} from 'brutoneto'
import { z } from 'zod'

const ParamsSchema = z.object({
  gross: z.number({ coerce: true }).positive(),
})

const QuerySchema = z.object({
  place: z
    .string()
    .refine(isValidPlace, {
      message: 'Invalid place',
    })
    .optional(),
  ltax: z.number({ coerce: true }).min(0).max(0.99).optional(),
  htax: z.number({ coerce: true }).min(0).max(0.99).optional(),
  coeff: z
    .number({ coerce: true })
    .min(MIN_PERSONAL_ALLOWANCE_COEFFICIENT)
    .max(MAX_PERSONAL_ALLOWANCE_COEFFICIENT)
    .optional(),
  third_pillar: z
    .number({ coerce: true })
    .min(0)
    .max(THIRD_PILLAR_NON_TAXABLE_LIMIT, {
      message: `Maximum allowed non-taxable monthly third pillar contribution is €${THIRD_PILLAR_NON_TAXABLE_LIMIT}`,
    })
    .optional(),
  detailed: z.boolean({ coerce: true }).optional(),
})

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, ParamsSchema.safeParse)

  if (params.success === false) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid gross amount',
      message: extractZodErrorMessage(params.error),
    })
  }

  const { gross } = params.data

  const query = await getValidatedQuery(event, QuerySchema.safeParse)

  if (query.success === false) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameter(s)',
      message: extractZodErrorMessage(query.error),
    })
  }

  const { place, ltax, htax, coeff, third_pillar, detailed } = query.data

  const grossToNetConfig: GrossToNetConfig = {
    place,
    taxRateLow: ltax,
    taxRateHigh: htax,
    personalAllowanceCoefficient: coeff,
    thirdPillarContribution: third_pillar,
  }

  if (detailed) {
    const res = detailedSalary(gross, grossToNetConfig)
    return {
      ...res,
      currency: 'EUR',
    }
  }

  const net = grossToNet(gross, grossToNetConfig)

  return {
    gross,
    net,
    currency: 'EUR',
  }
})
