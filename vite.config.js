import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env into process.env for local serverless functions
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      react(),
      tailwindcss(),
    {
      name: 'local-api-serverless-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url?.split('?')[0] || ''

          if (url === '/api/timer') {
            try {
              const { default: timerHandler } = await import('./api/timer.js')
              res.status = (code) => { res.statusCode = code; return res }
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              }

              if (req.method === 'POST') {
                let rawBody = ''
                req.on('data', (chunk) => { rawBody += chunk })
                req.on('end', async () => {
                  try {
                    req.body = rawBody ? JSON.parse(rawBody) : {}
                  } catch {
                    req.body = {}
                  }
                  await timerHandler(req, res)
                })
              } else {
                await timerHandler(req, res)
              }
              return
            } catch (err) {
              console.error('Local API /api/timer error:', err)
              return next()
            }
          }

          if (url === '/api/images') {
            try {
              const { default: imagesHandler } = await import('./api/images.js')
              res.status = (code) => { res.statusCode = code; return res }
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              }

              if (req.method === 'POST' || req.method === 'DELETE') {
                let rawBody = ''
                req.on('data', (chunk) => { rawBody += chunk })
                req.on('end', async () => {
                  try {
                    req.body = rawBody ? JSON.parse(rawBody) : {}
                  } catch {
                    req.body = {}
                  }
                  await imagesHandler(req, res)
                })
              } else {
                await imagesHandler(req, res)
              }
              return
            } catch (err) {
              console.error('Local API /api/images error:', err)
              return next()
            }
          }

          next()
        })
      },
    },
  ],
}
})
