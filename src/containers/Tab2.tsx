import { Dispatch, useEffect, useState } from 'react'

import { colors, file, bot, close } from '../assets/icons'
import { Button, ColorPicker, FilePicker, AiPicker } from '../components'
import { Irgb } from '../types'

const Tab2 = ({
	changeColor,
	color,
	setFile,
	img,
	setLogo,
	setFull,
	enableLogo,
	enableFull,
}: {
	changeColor: (rgb: Irgb) => void
	color: Irgb
	setFile: Dispatch<File | null>
	img: string | null
	setLogo: Dispatch<string>
	setFull: Dispatch<string>
	enableLogo: () => void
	enableFull: () => void
}) => {
	const [tab, setTab] = useState(0)
	const [enLogo, setEnLogo] = useState(false)
	const [enFull, setEnFull] = useState(false)

	const changeTab = (ind: number) => {
		if (tab === ind) setTab(0)
		else setTab(ind)
	}

	useEffect(() => {
		if (tab === 0) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setTab(0)
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [tab])

	const titles = ['', 'Fabric color', 'Texture', 'Studio AI']

	return (
		<section className="ui-tools relative select-none animate-fade-rise">
			<div className="organic-rail gap-1.5 py-2 px-1.5">
				<p className="soft-label px-1 hidden md:block">Tools</p>
				<div className="flex md:flex-col gap-1.5">
					<Button
						img={colors}
						active={tab === 1}
						ind={1}
						changeTab={changeTab}
					/>
					<Button img={file} active={tab === 2} ind={2} changeTab={changeTab} />
					<Button img={bot} active={tab === 3} ind={3} changeTab={changeTab} />
				</div>
			</div>

			{tab !== 0 && (
				<>
					<button
						type="button"
						className="fixed inset-0 z-[35] bg-black/25"
						aria-label="Close panel"
						onClick={() => setTab(0)}
					/>
					<div
						role="dialog"
						aria-modal="true"
						aria-label={titles[tab]}
						className={`tool-panel fixed z-[40] flex flex-col shadow-air ${
							tab === 3 ? 'sm:!w-[min(92vw,340px)]' : ''
						}`}
					>
						<div className="flex items-center justify-between px-3 pt-3 pb-2 shrink-0 border-b border-hairline-soft">
							<div className="flex items-center gap-2 min-w-0">
								{tab === 1 && (
									<span
										className="fabric-swatch"
										style={{
											backgroundColor: `rgb(${Math.round(color.r)}, ${Math.round(
												color.g
											)}, ${Math.round(color.b)})`,
										}}
									/>
								)}
								<p className="text-[14px] font-semibold text-ink truncate">
									{titles[tab]}
								</p>
							</div>
							<button
								type="button"
								className="icon-btn"
								onClick={() => setTab(0)}
								aria-label="Close panel"
							>
								<img src={close} alt="" />
							</button>
						</div>

						<div className="tool-panel__body overflow-y-auto overscroll-contain">
							{tab === 1 && (
								<>
									<p className="px-3 pt-2 pb-2 text-[13px] text-muted">
										Updates the 3D shirt live
									</p>
									<ColorPicker color={color} changeColor={changeColor} />
								</>
							)}
							{tab === 2 && (
								<div className="pt-2">
									<FilePicker
										img={img}
										setLogo={setLogo}
										setFull={setFull}
										setFile={setFile}
										enLogo={enLogo}
										setEnLogo={setEnLogo}
										enFull={enFull}
										setEnFull={setEnFull}
									/>
								</div>
							)}
							{tab === 3 && (
								<div className="pt-2">
									<AiPicker
										setLogo={setLogo}
										setFull={setFull}
										onAppliedLogo={enableLogo}
										onAppliedFull={enableFull}
									/>
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</section>
	)
}

export default Tab2
