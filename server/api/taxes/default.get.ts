import { RATE } from 'brutoneto'

export default defineEventHandler(() => {
  return {
    place: null,
    taxRateLow: RATE.TAX_LOW_BRACKET,
    taxRateHigh: RATE.TAX_HIGH_BRACKET,
  }
})
