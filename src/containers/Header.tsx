import { Irgb } from '../types'

const Header = ({ color }: { color: Irgb }) => {
	return (
		<header className="figma-topbar select-none">
			<div className="flex items-center gap-3 min-w-0">
				<span
					className="fabric-swatch"
					style={{
						backgroundColor: `rgb(${Math.round(color.r)}, ${Math.round(
							color.g
						)}, ${Math.round(color.b)})`,
					}}
					aria-label="Current fabric color"
				/>
				<div className="min-w-0">
					<p className="text-[11px] font-semibold text-muted leading-none mb-0.5">
						Organic View
					</p>
					<h1 className="text-[16px] md:text-[18px] font-semibold text-ink truncate leading-tight">
						Design your shirt
					</h1>
				</div>
			</div>
			<p className="text-[12px] text-muted font-medium shrink-0 hidden sm:block">
				sidd5arth
			</p>
		</header>
	)
}

export default Header
