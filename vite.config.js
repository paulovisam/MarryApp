import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function withHttps(url) {
  if (!url) return ''
  const u = String(url).trim().replace(/\/$/, '')
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  return `https://${u}`
}

/** Domínio canónico (Open Graph, canonical). Override: VITE_SITE_URL na Vercel. */
const PRODUCTION_SITE = 'https://saraepaulo.com.br'

function weddingSiteUrl() {
  const fromEnv = withHttps(process.env.VITE_SITE_URL)
  if (fromEnv) return fromEnv

  if (process.env.VERCEL_ENV === 'production') {
    return PRODUCTION_SITE
  }

  // Preview / outros: URL deste deploy (evita VERCEL_PROJECT_PRODUCTION_URL, que é sempre o de produção)
  const deploy = withHttps(process.env.VERCEL_URL)
  if (deploy) return deploy

  return PRODUCTION_SITE
}

function htmlWeddingMeta() {
  return {
    name: 'html-wedding-meta',
    transformIndexHtml(html) {
      const base = weddingSiteUrl()
      let out = html
      if (base) {
        out = out.replace(/<!--WEDDING_SITE_URL-->\s*/g, '')
        out = out.replace(/\s*<!--\/WEDDING_SITE_URL-->/g, '')
        out = out.replaceAll('@@SITE_URL@@', base)
      } else {
        out = out.replace(/<!--WEDDING_SITE_URL-->[\s\S]*?<!--\/WEDDING_SITE_URL-->\s*/g, '')
        out = out.replaceAll('@@SITE_URL@@', '')
      }
      return out
    },
  }
}

export default defineConfig({
  plugins: [react(), htmlWeddingMeta()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

