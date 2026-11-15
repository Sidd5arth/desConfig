import { Dispatch, FormEvent, useEffect, useRef, useState } from 'react'

import { generateAiGraphic, SUGGESTED_PROMPTS } from '../helper/aiImage'

const AiPicker = ({
	setLogo,
	setFull,
	onAppliedLogo,
	onAppliedFull,
}: {
	setLogo: Dispatch<string>
	setFull: Dispatch<string>
	onAppliedLogo: () => void
	onAppliedFull: () => void
}) => {
	const [prompt, setPrompt] = useState(SUGGESTED_PROMPTS[0])
	const [preview, setPreview] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [status, setStatus] = useState('')
	const [elapsed, setElapsed] = useState(0)
	const previewRef = useRef<string | null>(null)

	useEffect(() => {
		return () => {
			if (previewRef.current?.startsWith('blob:')) {
				URL.revokeObjectURL(previewRef.current)
			}
		}
	}, [])

	useEffect(() => {
		if (!loading) {
			setElapsed(0)
			return
		}
		const id = window.setInterval(() => setElapsed((s) => s + 1), 1000)
		return () => window.clearInterval(id)
	}, [loading])

	const setPreviewSafe = (next: string | null) => {
		if (previewRef.current?.startsWith('blob:') && previewRef.current !== next) {
			URL.revokeObjectURL(previewRef.current)
		}
		previewRef.current = next
		setPreview(next)
	}

	const generate = async (e?: FormEvent) => {
		e?.preventDefault()
		if (!prompt.trim() || loading) return
		setLoading(true)
		setError('')
		setStatus('Generating — often takes 20–60s…')
		try {
			const url = await generateAiGraphic(prompt)
			setPreviewSafe(url)
			setStatus('Ready to apply')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Generation failed')
			setStatus('')
		} finally {
			setLoading(false)
		}
	}

	const applyLogo = () => {
		if (!preview) return
		setLogo(preview)
		onAppliedLogo()
		setStatus('Applied as logo')
	}

	const applyFull = () => {
		if (!preview) return
		setFull(preview)
		onAppliedFull()
		setStatus('Applied as full print')
	}

	return (
		<form className="flex flex-col gap-3 px-3 pb-4" onSubmit={generate}>
			<p className="text-[13px] text-muted leading-relaxed">
				Free Pollinations AI. Generation can take up to a minute on the free
				tier.
			</p>

			<textarea
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				rows={3}
				maxLength={280}
				placeholder="Describe a graphic for the shirt…"
				disabled={loading}
				className="w-full resize-none rounded-air border border-hairline bg-surface-soft px-3 py-2 text-[13px] text-ink placeholder:text-muted-soft focus:outline-none focus:border-ink disabled:opacity-60"
			/>

			<div className="flex flex-wrap gap-1.5">
				{SUGGESTED_PROMPTS.slice(0, 3).map((idea) => (
					<button
						key={idea}
						type="button"
						disabled={loading}
						className="rounded-full border border-hairline px-2 py-1 text-[10px] font-semibold text-muted hover:text-ink hover:bg-surface-soft transition-colors text-left disabled:opacity-50"
						onClick={() => setPrompt(idea)}
					>
						{idea.split(',')[0]}
					</button>
				))}
			</div>

			<button
				type="submit"
				disabled={loading || !prompt.trim()}
				className="air-btn-primary w-full disabled:opacity-60"
			>
				{loading ? `Generating… ${elapsed}s` : 'Generate graphic'}
			</button>

			{error && (
				<p className="text-[12px] font-semibold text-ink">{error}</p>
			)}
			{!error && status && (
				<p className="text-[12px] font-semibold text-muted">{status}</p>
			)}

			<div className="rounded-air border border-hairline bg-surface-soft overflow-hidden min-h-[140px] flex items-center justify-center relative">
				{loading && (
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-soft/90 z-10">
						<div className="loader-ring w-9 h-9" />
						<p className="text-[12px] font-semibold text-ink">
							Creating graphic… {elapsed}s
						</p>
						<p className="text-[11px] text-muted px-4 text-center">
							Free API is slow — keep this panel open
						</p>
					</div>
				)}
				{preview ? (
					<img
						src={preview}
						alt="AI generated graphic"
						className="max-h-[160px] w-full object-contain"
						draggable={false}
					/>
				) : (
					!loading && (
						<p className="text-[12px] text-muted-soft px-4 text-center py-8">
							Preview appears here
						</p>
					)
				)}
			</div>

			<div className="flex gap-2">
				<button
					type="button"
					disabled={!preview || loading}
					className="action-btn flex-1 !m-0 !w-auto disabled:opacity-40"
					onClick={applyLogo}
				>
					Use as logo
				</button>
				<button
					type="button"
					disabled={!preview || loading}
					className="action-btn flex-1 !m-0 !w-auto disabled:opacity-40"
					onClick={applyFull}
				>
					Use as full
				</button>
			</div>
		</form>
	)
}

export default AiPicker
