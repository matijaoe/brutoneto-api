// https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'server',
  errorHandler: '~/error',
  experimental: {
    openAPI: true,
  },
})
