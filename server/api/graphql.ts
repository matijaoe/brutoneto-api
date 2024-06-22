import { yogaServer } from '~/graphql'

export default defineEventHandler(async (event) => {
  return await yogaServer.handleNodeRequest(event.node.req, event.node.res)
})
