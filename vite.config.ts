import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	base: '/',
	plugins: [react()],
	assetsInclude: ['**/*.glb'],
	server: {
		proxy: {
			// Avoid browser CORS / Cloudflare quirks during Studio AI generation
			'/pollinations': {
				target: 'https://image.pollinations.ai',
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/pollinations/, ''),
				timeout: 120_000,
				proxyTimeout: 120_000,
			},
		},
	},
})
