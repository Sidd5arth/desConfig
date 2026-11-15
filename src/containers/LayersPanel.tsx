import { Irgb } from '../types'

export type LayerId = 'fabric' | 'logo' | 'full'

const LayersPanel = ({
	color,
	isLogo,
	isFull,
	selected,
	onSelect,
	onToggleLogo,
	onToggleFull,
}: {
	color: Irgb
	isLogo: boolean
	isFull: boolean
	selected: LayerId
	onSelect: (id: LayerId) => void
	onToggleLogo: () => void
	onToggleFull: () => void
}) => {
	const row = (
		id: LayerId,
		label: string,
		visible: boolean,
		onToggle?: () => void,
		swatch?: boolean
	) => {
		const active = selected === id
		return (
			<button
				type="button"
				key={id}
				className={`layer-row ${active ? 'is-active' : ''}`}
				onClick={() => onSelect(id)}
			>
				<span
					className="layer-eye"
					title={visible ? 'Hide' : 'Show'}
					onClick={(e) => {
						e.stopPropagation()
						onToggle?.()
					}}
					role={onToggle ? 'button' : undefined}
				>
					{visible ? (
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
							<path
								d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
								stroke="currentColor"
								strokeWidth="1.8"
							/>
							<circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
						</svg>
					) : (
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
							<path
								d="M3 3l18 18M10.5 10.6A3 3 0 0012 15a3 3 0 002.4-1.2M9.9 5.1A10.5 10.5 0 0122 12s-2 4-5.5 6.1M6.1 6.1C4 7.8 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.2 3.6-.6"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
							/>
						</svg>
					)}
				</span>
				{swatch ? (
					<span
						className="layer-swatch"
						style={{
							backgroundColor: `rgb(${Math.round(color.r)}, ${Math.round(
								color.g
							)}, ${Math.round(color.b)})`,
						}}
					/>
				) : (
					<span className="layer-thumb" />
				)}
				<span className="layer-label">{label}</span>
			</button>
		)
	}

	return (
		<aside className="figma-panel figma-panel--left select-none">
			<div className="figma-panel__head">
				<p className="figma-panel__title">Layers</p>
			</div>
			<div className="figma-panel__body">
				<div className="layer-group">
					<div className="layer-row layer-row--root">
						<span className="layer-eye opacity-0 pointer-events-none" aria-hidden>
							·
						</span>
						<span className="layer-thumb layer-thumb--shirt" />
						<span className="layer-label font-semibold">T-shirt</span>
					</div>
					<div className="layer-children">
						{row('fabric', 'Fabric', true, undefined, true)}
						{row('logo', 'Logo', isLogo, onToggleLogo)}
						{row('full', 'Full print', isFull, onToggleFull)}
					</div>
				</div>
			</div>
		</aside>
	)
}

export default LayersPanel
