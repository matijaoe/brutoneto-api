import { getPlacesTaxes } from '@brutoneto/core'

export default defineEventHandler(() => {
  return getPlacesTaxes()
})
