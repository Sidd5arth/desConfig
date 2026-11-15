import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'

import { Model } from '../model'
import { Header, LayersPanel, ToolsPanel } from '../containers'
import type { LayerId } from '../containers/LayersPanel'
import { ExportPanel } from '../components'
import { reader, doGsap } from '../helper'
import { Irgb } from '../types'

const Home = () => {
	const [isMobile, setIsMobile] = useState(false)
	const [color, setColor] = useState({ r: 34, g: 34, b: 34 })
	const [isLogo, setIsLogo] = useState(true)
	const [isFull, setIsFull] = useState(false)
	const [logoS, setLogoS] = useState(0)
	const [logoP, setLogoP] = useState(2)
	const [logo, setLogo] = useState('./logo.png')
	const [full, setFull] = useState('./full.jpg')
	const [file, setFile] = useState<File | null>(null)
	const [img, setImg] = useState<string | null>(null)
	const [exportOpen, setExportOpen] = useState(false)
	const [selectedLayer, setSelectedLayer] = useState<LayerId>('fabric')
	const [mobilePanel, setMobilePanel] = useState<'layers' | 'tools' | null>(null)

	const tref = useRef(null)

	useEffect(() => {
		if (file) {
			reader(file).then((result) => setImg(result))
		}
	}, [file])

	const changeColor = (rgb: Irgb) => {
		setColor({ r: rgb.r, g: rgb.g, b: rgb.b })
	}

	useGSAP(() => {
		doGsap(tref)
	})

	useEffect(() => {
		const checkScreen = () => setIsMobile(window.innerWidth < 768)
		checkScreen()
		window.addEventListener('resize', checkScreen)
		return () => window.removeEventListener('resize', checkScreen)
	}, [])

	const design = {
		color,
		logo,
		full,
		isLogo,
		isFull,
		logoP,
		logoS,
	}

	const selectLayer = (id: LayerId) => {
		setSelectedLayer(id)
		if (window.innerWidth < 768) setMobilePanel('tools')
	}

	return (
		<main className="studio-shell studio-shell--figma">
			<div className="figma-layout">
				<Header color={color} />

				<div
					className={`figma-side figma-side--left ${
						mobilePanel === 'layers' ? 'is-open' : ''
					}`}
				>
					<LayersPanel
						color={color}
						isLogo={isLogo}
						isFull={isFull}
						selected={selectedLayer}
						onSelect={selectLayer}
						onToggleLogo={() => setIsLogo((v) => !v)}
						onToggleFull={() => setIsFull((v) => !v)}
					/>
				</div>

				<section ref={tref} className="figma-canvas">
					<Model
						isMobile={isMobile}
						color={color}
						logo={logo}
						isLogo={isLogo}
						full={full}
						isFull={isFull}
						logoP={logoP}
						logoS={logoS}
					/>
				</section>

				<div
					className={`figma-side figma-side--right ${
						mobilePanel === 'tools' ? 'is-open' : ''
					}`}
				>
					<ToolsPanel
						layer={selectedLayer}
						color={color}
						changeColor={changeColor}
						logoS={logoS}
						logoP={logoP}
						handleLogoP={setLogoP}
						handleLogoS={setLogoS}
						setFile={setFile}
						img={img}
						setLogo={setLogo}
						setFull={setFull}
						enableLogo={() => {
							setIsLogo(true)
							setSelectedLayer('logo')
						}}
						enableFull={() => {
							setIsFull(true)
							setIsLogo(false)
							setSelectedLayer('full')
						}}
						onExport={() => setExportOpen(true)}
					/>
				</div>

				<nav className="figma-mobile-bar md:hidden">
					<button
						type="button"
						className={`figma-mobile-btn ${
							mobilePanel === 'layers' ? 'is-active' : ''
						}`}
						onClick={() =>
							setMobilePanel((p) => (p === 'layers' ? null : 'layers'))
						}
					>
						Layers
					</button>
					<button
						type="button"
						className={`figma-mobile-btn ${
							mobilePanel === 'tools' ? 'is-active' : ''
						}`}
						onClick={() =>
							setMobilePanel((p) => (p === 'tools' ? null : 'tools'))
						}
					>
						Tools
					</button>
				</nav>

				{mobilePanel && (
					<button
						type="button"
						className="figma-mobile-scrim md:hidden"
						aria-label="Close panel"
						onClick={() => setMobilePanel(null)}
					/>
				)}
			</div>

			<ExportPanel
				open={exportOpen}
				onClose={() => setExportOpen(false)}
				design={design}
			/>
		</main>
	)
}

export default Home
