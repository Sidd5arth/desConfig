import type { Config } from 'tailwindcss'

const config: Config = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				rausch: '#b8ff1a',
				'rausch-active': '#9ae600',
				'rausch-soft': '#e5ff99',
				ink: '#222222',
				body: '#3f3f3f',
				muted: '#6a6a6a',
				'muted-soft': '#929292',
				hairline: '#dddddd',
				'hairline-soft': '#ebebeb',
				canvas: '#ffffff',
				surface: {
					soft: '#f7f7f7',
					card: '#ffffff',
					strong: '#f2f2f2',
				},
			},
			fontFamily: {
				sans: [
					'Inter',
					'Circular',
					'-apple-system',
					'system-ui',
					'Roboto',
					'Helvetica Neue',
					'sans-serif',
				],
			},
			borderRadius: {
				air: '14px',
				'air-lg': '20px',
				'air-xl': '32px',
			},
			boxShadow: {
				air: '0 6px 16px rgba(0,0,0,0.12)',
				'air-sm': '0 2px 8px rgba(0,0,0,0.08)',
			},
			backgroundImage: {
				atelier: 'linear-gradient(180deg, #ffffff 0%, #f7f7f7 55%, #f2f2f2 100%)',
			},
			keyframes: {
				'fade-rise': {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				'fade-rise': 'fade-rise 0.45s ease-out both',
			},
		},
	},
	plugins: [],
}

export default config
