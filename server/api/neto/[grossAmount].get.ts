import { grossToNet, detailedSalary } from 'brutoneto'
import { toNumber } from '../../utils'

export default defineEventHandler((event) => {
  const grossAmount = getRouterParam(event, 'grossAmount')

  const parsedGrossAmount = toNumber(grossAmount)

  if (!parsedGrossAmount) {
    throw createError({
      statusCode: 400,
      message: 'Invalid gross amount',
    })
  }

  const net = grossToNet(parsedGrossAmount, { place: 'sveta-nedelja-samobor' })

  return {
    gross: parsedGrossAmount,
    net,
    currency: 'EUR',
  }
})
