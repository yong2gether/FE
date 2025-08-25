import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Y-Wave',
        short_name: 'Y-Wave',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1976d2',
        icons: [
          // PNG 아이콘이 준비되면 아래 두 항목을 실제 파일로 교체하세요
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          // 임시: favicon.ico를 아이콘으로도 활용 (일부 브라우저에서 허용)
          { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' }
        ]
      }
    })
  ],
})
