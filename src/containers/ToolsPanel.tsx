import { Dispatch, useState } from 'react'

import { ColorPicker, FilePicker, AiPicker, Button3 } from '../components'
import { Irgb } from '../types'
import { LayerId } from './LayersPanel'

type ToolTab = 'inspect' | 'upload' | 'ai'

const ToolsPanel = ({
	layer,
	color,
	changeColor,
	logoS,
	logoP,
	handleLogoP,
	handleLogoS,
	setFile,
	img,
	setLogo,
	setFull,
	enableLogo,
	enableFull,
	onExport,
}: {
	layer: LayerId
	color: Irgb
	changeColor: (rgb: Irgb) => void
	logoS: number
	logoP: number
	handleLogoP: (ind: number) => void
	handleLogoS: (ind: number) => void
	setFile: Dispatch<File | null>
	img: string | null
	setLogo: Dispatch<string>
	setFull: Dispatch<string>
	enableLogo: () => void
	enableFull: () => void
	onExport: () => void
}) => {
	const [toolTab, setToolTab] = useState<ToolTab>('inspect')
	const [enLogo, setEnLogo] = useState(false)
	const [enFull, setEnFull] = useState(false)

	const title =
		layer === 'fabric' ? 'Fabric' : layer === 'logo' ? 'Logo' : 'Full print'

	return (
		<aside className="figma-panel figma-panel--right select-none">
			<div className="figma-panel__head">
				<p className="figma-panel__title">{title}</p>
			</div>

			<div className="figma-tabs">
				{(
					[
						['inspect', 'Design'],
						['upload', 'Upload'],
						['ai', 'AI'],
					] as const
				).map(([id, label]) => (
					<button
						key={id}
						type="button"
						className={`figma-tab ${toolTab === id ? 'is-active' : ''}`}
						onClick={() => setToolTab(id)}
					>
						{label}
					</button>
				))}
			</div>

			<div className="figma-panel__body figma-panel__body--tools">
				{toolTab === 'inspect' && (
					<>
						{layer === 'fabric' && (
							<section className="tool-section">
								<p className="tool-section__label">Fill</p>
								<div className="flex items-center gap-2 mb-3 px-1">
									<span
										className="fabric-swatch !w-6 !h-6"
										style={{
											backgroundColor: `rgb(${Math.round(color.r)}, ${Math.round(
												color.g
											)}, ${Math.round(color.b)})`,
										}}
									/>
									<span className="text-[12px] text-muted">
										RGB {Math.round(color.r)}, {Math.round(color.g)},{' '}
										{Math.round(color.b)}
									</span>
								</div>
								<ColorPicker color={color} changeColor={changeColor} />
							</section>
						)}

						{layer === 'logo' && (
							<>
								<section className="tool-section">
									<p className="tool-section__label">Position</p>
									<div className="flex gap-1.5 px-1">
										{(['L', 'M', 'R'] as const).map((t, i) => (
											<Button3
												key={t}
												active={logoP === i}
												ind={i}
												text={t}
												handleClick={handleLogoP}
											/>
										))}
									</div>
								</section>
								<section className="tool-section">
									<p className="tool-section__label">Size</p>
									<div className="flex gap-1.5 px-1">
										{(['S', 'M', 'L'] as const).map((t, i) => (
											<Button3
												key={t}
												active={logoS === i}
												ind={i + 3}
												text={t}
												handleClick={(ind) => handleLogoS(ind - 3)}
											/>
										))}
									</div>
								</section>
								<p className="px-3 text-[12px] text-muted leading-relaxed">
									Upload or generate art in the Upload / AI tabs, then place it
									here.
								</p>
							</>
						)}

						{layer === 'full' && (
							<p className="px-3 py-2 text-[13px] text-muted leading-relaxed">
								Full-print covers the shirt body. Use Upload or AI to set the
								texture.
							</p>
						)}
					</>
				)}

				{toolTab === 'upload' && (
					<section className="tool-section !px-0">
						<p className="tool-section__label px-3">File</p>
						<FilePicker
							img={img}
							setLogo={setLogo}
							setFull={setFull}
							setFile={setFile}
							enLogo={enLogo}
							setEnLogo={(v) => {
								const next = typeof v === 'function' ? v(enLogo) : v
								setEnLogo(next)
								if (next) enableLogo()
							}}
							enFull={enFull}
							setEnFull={(v) => {
								const next = typeof v === 'function' ? v(enFull) : v
								setEnFull(next)
								if (next) enableFull()
							}}
						/>
					</section>
				)}

				{toolTab === 'ai' && (
					<section className="tool-section !px-0">
						<AiPicker
							setLogo={setLogo}
							setFull={setFull}
							onAppliedLogo={enableLogo}
							onAppliedFull={enableFull}
						/>
					</section>
				)}
			</div>

			<div className="figma-panel__foot">
				<button type="button" className="air-btn-primary w-full" onClick={onExport}>
					Export
				</button>
			</div>
		</aside>
	)
}

export default ToolsPanel
