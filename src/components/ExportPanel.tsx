import { useEffect, useState } from 'react'

import { canvasDownloader } from '../helper'
import {
	buildFlatLayoutCanvas,
	exportFlatLayout,
	exportFrontPrintPlate,
	exportPrintPack,
	exportPrintReadyGraphic,
	getFlatPlacement,
} from '../helper/printExporter'
import { PrintDesignState } from '../types/Iprint'
import { close } from '../assets/icons'

const ExportPanel = ({
	open,
	onClose,
	design,
}: {
	open: boolean
	onClose: () => void
	design: PrintDesignState
}) => {
	const [preview, setPreview] = useState<string | null>(null)
	const [busy, setBusy] = useState(false)
	const [status, setStatus] = useState('')
	const placement = getFlatPlacement(design.logoP, design.logoS)

	useEffect(() => {
		if (!open) return
		let alive = true
		setPreview(null)
		setStatus('Composing flat layout…')
		buildFlatLayoutCanvas(design)
			.then((canvas) => {
				if (!alive) return
				setPreview(canvas.toDataURL('image/png'))
				setStatus('')
			})
			.catch(() => {
				if (!alive) return
				setStatus('Could not build preview')
			})
		return () => {
			alive = false
		}
	}, [
		open,
		design.color.r,
		design.color.g,
		design.color.b,
		design.logo,
		design.full,
		design.isLogo,
		design.isFull,
		design.logoP,
		design.logoS,
	])

	if (!open) return null

	const run = async (fn: () => Promise<unknown>, label: string) => {
		setBusy(true)
		setStatus(label)
		try {
			await fn()
			setStatus('Saved')
		} catch {
			setStatus('Export failed')
		} finally {
			setBusy(false)
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
			<button
				type="button"
				className="absolute inset-0 bg-black/40"
				aria-label="Close export"
				onClick={onClose}
			/>
			<div className="relative z-10 w-full sm:max-w-4xl max-h-[min(92dvh,900px)] overflow-y-auto overscroll-contain animate-fade-rise bg-canvas border border-hairline rounded-t-air-xl sm:rounded-air-xl shadow-air">
				<div className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-5 pb-3">
					<div className="min-w-0">
						<p className="soft-label mb-1">Export</p>
						<h2 className="brand-mark">Print-ready pieces</h2>
						<p className="mt-2 text-[14px] text-muted max-w-xl leading-relaxed">
							Flat pre-stitch cloth with garment color and texture placement.
						</p>
					</div>
					<button
						type="button"
						className="icon-btn shrink-0"
						onClick={onClose}
						aria-label="Close"
					>
						<img src={close} alt="" />
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-4 px-4 sm:px-6 pb-6">
					<div className="rounded-air overflow-hidden bg-surface-soft border border-hairline min-h-[180px] flex items-center justify-center">
						{preview ? (
							<img
								src={preview}
								alt="Flat print layout preview"
								className="w-full h-auto object-contain max-h-[40vh] md:max-h-[52vh]"
							/>
						) : (
							<p className="soft-label py-16">{status || 'Loading…'}</p>
						)}
					</div>

					<div className="flex flex-col gap-2.5">
						<div className="rounded-air bg-surface-soft border border-hairline px-4 py-3">
							<p className="soft-label mb-2">On the garment</p>
							<div className="flex items-center gap-2 mb-2">
								<span
									className="fabric-swatch"
									style={{
										backgroundColor: `rgb(${Math.round(design.color.r)}, ${Math.round(
											design.color.g
										)}, ${Math.round(design.color.b)})`,
									}}
								/>
								<span className="text-[13px] text-body">
									RGB {Math.round(design.color.r)}, {Math.round(design.color.g)},{' '}
									{Math.round(design.color.b)}
								</span>
							</div>
							<ul className="text-[13px] text-body space-y-1">
								<li>
									Logo {design.isLogo ? 'on' : 'off'} · {placement.labelPos} /{' '}
									{placement.labelSize}
								</li>
								<li>Full texture {design.isFull ? 'on' : 'off'}</li>
							</ul>
						</div>

						<button
							type="button"
							disabled={busy}
							className="air-btn-primary disabled:opacity-50"
							onClick={() =>
								run(() => exportFlatLayout(design), 'Saving flat layout…')
							}
						>
							Flat shirt layout
						</button>
						<button
							type="button"
							disabled={busy}
							className="air-btn-secondary disabled:opacity-50"
							onClick={() =>
								run(
									() => exportFrontPrintPlate(design),
									'Saving front print plate…'
								)
							}
						>
							Front print plate
						</button>
						<button
							type="button"
							disabled={busy}
							className="air-btn-secondary disabled:opacity-50"
							onClick={() =>
								run(
									() => exportPrintReadyGraphic(design),
									'Saving print graphic…'
								)
							}
						>
							Print-ready graphic
						</button>
						<button
							type="button"
							disabled={busy}
							className="air-btn-primary disabled:opacity-50"
							onClick={() => run(() => exportPrintPack(design), 'Saving pack…')}
						>
							Download all
						</button>
						<button
							type="button"
							disabled={busy}
							className="h-12 rounded-lg text-[14px] font-medium text-muted hover:text-ink transition-colors disabled:opacity-50"
							onClick={() => {
								canvasDownloader()
								setStatus('3D snapshot saved')
							}}
						>
							3D view snapshot
						</button>

						{status && (
							<p className="text-[12px] font-semibold text-ink pt-1">
								{status}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ExportPanel
