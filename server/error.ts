export default defineNitroErrorHandler((error, event) => {
  setResponseHeader(event, 'Content-Type', 'application/json')
  setResponseStatus(event, error.cause.status || error.status)

  return send(event, JSON.stringify({
    ...error.cause,
    fatal: error.fatal,
    unhandled: error.unhandled,
  }))
});
