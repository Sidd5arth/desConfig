/** Free open image API — Pollinations (no API key). */
const REMOTE_BASE = 'https://image.pollinations.ai/prompt'
const DEV_BASE = '/pollinations/prompt'

const baseUrl = () =>
	import.meta.env.DEV ? DEV_BASE : REMOTE_BASE

export const buildAiImageUrl = (prompt: string, seed?: number) => {
	const clean = prompt.trim().replace(/\s+/g, ' ')
	const encoded = encodeURIComponent(clean)
	const params = new URLSearchParams({
		width: '768',
		height: '768',
		nologo: 'true',
		safe: 'true',
		seed: String(seed ?? Math.floor(Math.random() * 1_000_000)),
	})
	return `${baseUrl()}/${encoded}?${params.toString()}`
}

const blobFromImageElement = (url: string): Promise<string> =>
	new Promise((resolve, reject) => {
		const img = new Image()
		img.crossOrigin = 'anonymous'
		const timer = window.setTimeout(() => {
			reject(new Error('Timed out after 90s — wait a bit and try again'))
		}, 90_000)

		img.onload = () => {
			window.clearTimeout(timer)
			try {
				const canvas = document.createElement('canvas')
				canvas.width = img.naturalWidth || 768
				canvas.height = img.naturalHeight || 768
				const ctx = canvas.getContext('2d')
				if (!ctx) {
					resolve(url)
					return
				}
				ctx.drawImage(img, 0, 0)
				canvas.toBlob(
					(blob) => {
						if (blob) resolve(URL.createObjectURL(blob))
						else resolve(url)
					},
					'image/png'
				)
			} catch {
				resolve(url)
			}
		}

		img.onerror = () => {
			window.clearTimeout(timer)
			reject(new Error('AI service did not return an image'))
		}

		img.src = url
	})

const blobFromFetch = async (url: string): Promise<string> => {
	const controller = new AbortController()
	const timer = window.setTimeout(() => controller.abort(), 90_000)
	try {
		const res = await fetch(url, {
			method: 'GET',
			signal: controller.signal,
		})
		if (!res.ok) {
			throw new Error(
				res.status === 402
					? 'Free rate limit hit — wait about a minute and try again'
					: `Generation failed (${res.status})`
			)
		}
		const blob = await res.blob()
		if (!blob.type.startsWith('image/') && blob.size < 1000) {
			throw new Error('Response was not an image — try another prompt')
		}
		return URL.createObjectURL(blob)
	} finally {
		window.clearTimeout(timer)
	}
}

/** Generate graphic via Pollinations; returns a blob: or https URL. */
export const generateAiGraphic = async (
	prompt: string,
	seed?: number
): Promise<string> => {
	const url = buildAiImageUrl(prompt, seed)

	try {
		return await blobFromFetch(url)
	} catch (fetchErr) {
		// Fallback: load via <img> (works when fetch is flaky)
		try {
			return await blobFromImageElement(url)
		} catch {
			throw fetchErr instanceof Error
				? fetchErr
				: new Error('Could not generate image')
		}
	}
}

export const SUGGESTED_PROMPTS = [
	'minimal geometric logo, black line art on white, t-shirt print',
	'botanical leaf pattern, soft green, seamless textile print',
	'retro wave sunset graphic, bold shapes, apparel design',
	'cute line-art cat mascot, simple, high contrast',
	'abstract watercolor splash, organic shapes, fashion print',
]
