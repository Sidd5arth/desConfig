import { FlatPlacement, PrintDesignState } from '../types/Iprint'

const POS_LABEL = ['L', 'M', 'R'] as const
const SIZE_LABEL = ['S', 'M', 'L'] as const

/** Maps 3D logoP / logoS onto a flat front-body print space. */
export const getFlatPlacement = (logoP: number, logoS: number): FlatPlacement => {
	const xByPos = [0.32, 0.5, 0.68]
	const wBySize = [0.16, 0.22, 0.3]
	const p = Math.min(2, Math.max(0, logoP))
	const s = Math.min(2, Math.max(0, logoS))

	return {
		xNorm: xByPos[p],
		yNorm: 0.3,
		wNorm: wBySize[s],
		labelPos: POS_LABEL[p],
		labelSize: SIZE_LABEL[s],
	}
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
		img.src = src
	})

const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
	const link = document.createElement('a')
	link.href = canvas.toDataURL('image/png')
	link.download = filename
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

const rgb = (color: PrintDesignState['color']) =>
	`rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`

const drawRoundedRect = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number
) => {
	const radius = Math.min(r, w / 2, h / 2)
	ctx.beginPath()
	ctx.moveTo(x + radius, y)
	ctx.arcTo(x + w, y, x + w, y + h, radius)
	ctx.arcTo(x + w, y + h, x, y + h, radius)
	ctx.arcTo(x, y + h, x, y, radius)
	ctx.arcTo(x, y, x + w, y, radius)
	ctx.closePath()
}

/** Classic T-shirt front/back body silhouette (flat pattern style). */
const pathBodyPiece = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	neckDeep = true
) => {
	const neckW = w * 0.28
	const neckD = neckDeep ? h * 0.08 : h * 0.045
	const shoulderDrop = h * 0.06
	const armhole = w * 0.12

	ctx.beginPath()
	ctx.moveTo(x + w * 0.5 - neckW / 2, y + shoulderDrop)
	ctx.quadraticCurveTo(
		x + w * 0.5,
		y + shoulderDrop + neckD,
		x + w * 0.5 + neckW / 2,
		y + shoulderDrop
	)
	ctx.lineTo(x + w - armhole, y + shoulderDrop)
	ctx.quadraticCurveTo(x + w - armhole * 0.2, y + h * 0.22, x + w, y + h * 0.28)
	ctx.lineTo(x + w, y + h)
	ctx.lineTo(x, y + h)
	ctx.lineTo(x, y + h * 0.28)
	ctx.quadraticCurveTo(x + armhole * 0.2, y + h * 0.22, x + armhole, y + shoulderDrop)
	ctx.closePath()
}

const drawBodyPiece = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	fill: string,
	neckDeep = true
) => {
	pathBodyPiece(ctx, x, y, w, h, neckDeep)
	ctx.fillStyle = fill
	ctx.fill()
	ctx.strokeStyle = 'rgba(42,40,36,0.55)'
	ctx.lineWidth = 2
	ctx.stroke()
}

const fillBodyTexture = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	img: HTMLImageElement,
	neckDeep = true
) => {
	ctx.save()
	pathBodyPiece(ctx, x, y, w, h, neckDeep)
	ctx.clip()
	ctx.drawImage(img, x, y, w, h)
	ctx.restore()
	pathBodyPiece(ctx, x, y, w, h, neckDeep)
	ctx.strokeStyle = 'rgba(42,40,36,0.55)'
	ctx.lineWidth = 2
	ctx.stroke()
}

const drawSleevePiece = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	fill: string
) => {
	ctx.beginPath()
	ctx.moveTo(x + w * 0.15, y)
	ctx.quadraticCurveTo(x + w * 0.5, y - h * 0.08, x + w * 0.85, y)
	ctx.lineTo(x + w, y + h * 0.55)
	ctx.quadraticCurveTo(x + w * 0.5, y + h * 1.05, x, y + h * 0.55)
	ctx.closePath()
	ctx.fillStyle = fill
	ctx.fill()
	ctx.strokeStyle = 'rgba(42,40,36,0.55)'
	ctx.lineWidth = 2
	ctx.stroke()
}

const drawCropMarks = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number
) => {
	const len = 18
	const gap = 8
	ctx.strokeStyle = 'rgba(42,40,36,0.7)'
	ctx.lineWidth = 1.5
	const corners = [
		[x, y, -1, -1],
		[x + w, y, 1, -1],
		[x, y + h, -1, 1],
		[x + w, y + h, 1, 1],
	] as const
	for (const [cx, cy, sx, sy] of corners) {
		ctx.beginPath()
		ctx.moveTo(cx + sx * gap, cy)
		ctx.lineTo(cx + sx * (gap + len), cy)
		ctx.moveTo(cx, cy + sy * gap)
		ctx.lineTo(cx, cy + sy * (gap + len))
		ctx.stroke()
	}
}

const drawGrainline = (
	ctx: CanvasRenderingContext2D,
	cx: number,
	y1: number,
	y2: number
) => {
	ctx.strokeStyle = 'rgba(42,40,36,0.35)'
	ctx.lineWidth = 1
	ctx.setLineDash([6, 5])
	ctx.beginPath()
	ctx.moveTo(cx, y1)
	ctx.lineTo(cx, y2)
	ctx.stroke()
	ctx.setLineDash([])
	ctx.fillStyle = 'rgba(42,40,36,0.45)'
	ctx.beginPath()
	ctx.moveTo(cx, y1)
	ctx.lineTo(cx - 5, y1 + 10)
	ctx.lineTo(cx + 5, y1 + 10)
	ctx.closePath()
	ctx.fill()
	ctx.beginPath()
	ctx.moveTo(cx, y2)
	ctx.lineTo(cx - 5, y2 - 10)
	ctx.lineTo(cx + 5, y2 - 10)
	ctx.closePath()
	ctx.fill()
}

const drawPlacementGuide = (
	ctx: CanvasRenderingContext2D,
	pieceX: number,
	pieceY: number,
	pieceW: number,
	pieceH: number,
	placement: FlatPlacement
) => {
	const cx = pieceX + pieceW * placement.xNorm
	const cy = pieceY + pieceH * placement.yNorm
	const lw = pieceW * placement.wNorm
	const lh = lw

	ctx.save()
	ctx.strokeStyle = 'rgba(94,111,85,0.85)'
	ctx.lineWidth = 1.5
	ctx.setLineDash([5, 4])
	ctx.strokeRect(cx - lw / 2, cy - lh / 2, lw, lh)
	ctx.setLineDash([])

	ctx.beginPath()
	ctx.moveTo(cx - 8, cy)
	ctx.lineTo(cx + 8, cy)
	ctx.moveTo(cx, cy - 8)
	ctx.lineTo(cx, cy + 8)
	ctx.stroke()

	ctx.fillStyle = 'rgba(42,40,36,0.7)'
	ctx.font = '500 13px Outfit, sans-serif'
	ctx.fillText(
		`print zone · ${placement.labelPos}/${placement.labelSize}`,
		cx - lw / 2,
		cy - lh / 2 - 8
	)
	ctx.restore()

	return { cx, cy, lw, lh }
}

export const buildFlatLayoutCanvas = async (
	design: PrintDesignState
): Promise<HTMLCanvasElement> => {
	const W = 3600
	const H = 2700
	const canvas = document.createElement('canvas')
	canvas.width = W
	canvas.height = H
	const ctx = canvas.getContext('2d')!

	// Paper / studio ground — Claude canvas
	ctx.fillStyle = '#FAF9F5'
	ctx.fillRect(0, 0, W, H)

	// Header
	ctx.fillStyle = '#141413'
	ctx.font = '400 54px Lora, Georgia, serif'
	ctx.fillText('Organic View · Flat Print Layout', 120, 110)
	ctx.font = '400 28px Poppins, Arial, sans-serif'
	ctx.fillStyle = '#3d3d3a'
	ctx.fillText(
		'Pre-stitch cloth representation · where each graphic pixel will land',
		120,
		160
	)
	ctx.fillText(`by sidd5arth · ${new Date().toISOString().slice(0, 10)}`, 120, 200)

	const fabric = rgb(design.color)
	const placement = getFlatPlacement(design.logoP, design.logoS)

	// Piece geometry (print sheet coordinates)
	const front = { x: 180, y: 280, w: 980, h: 1280 }
	const back = { x: 1280, y: 280, w: 980, h: 1280 }
	const sleeveL = { x: 2400, y: 320, w: 520, h: 520 }
	const sleeveR = { x: 2400, y: 980, w: 520, h: 520 }

	drawCropMarks(ctx, front.x - 20, front.y - 20, front.w + 40, front.h + 40)
	drawCropMarks(ctx, back.x - 20, back.y - 20, back.w + 40, back.h + 40)

	drawBodyPiece(ctx, front.x, front.y, front.w, front.h, fabric, true)
	drawBodyPiece(ctx, back.x, back.y, back.w, back.h, fabric, false)
	drawSleevePiece(ctx, sleeveL.x, sleeveL.y, sleeveL.w, sleeveL.h, fabric)
	drawSleevePiece(ctx, sleeveR.x, sleeveR.y, sleeveR.w, sleeveR.h, fabric)

	drawGrainline(ctx, front.x + front.w / 2, front.y + 160, front.y + front.h - 80)
	drawGrainline(ctx, back.x + back.w / 2, back.y + 140, back.y + back.h - 80)

	// Labels
	ctx.fillStyle = '#141413'
	ctx.font = '500 32px Poppins, Arial, sans-serif'
	ctx.fillText('FRONT BODY', front.x, front.y - 36)
	ctx.fillText('BACK BODY', back.x, back.y - 36)
	ctx.font = '400 24px Poppins, Arial, sans-serif'
	ctx.fillText('LEFT SLEEVE', sleeveL.x, sleeveL.y - 24)
	ctx.fillText('RIGHT SLEEVE', sleeveR.x, sleeveR.y - 24)

	// Full texture over front (print-all-over representation)
	if (design.isFull) {
		try {
			const fullImg = await loadImage(design.full)
			fillBodyTexture(ctx, front.x, front.y, front.w, front.h, fullImg, true)
		} catch {
			/* keep solid fabric if texture fails */
		}
	}

	const zone = drawPlacementGuide(
		ctx,
		front.x,
		front.y,
		front.w,
		front.h,
		placement
	)

	if (design.isLogo) {
		try {
			const logoImg = await loadImage(design.logo)
			const aspect = logoImg.height / Math.max(1, logoImg.width)
			const lh = zone.lw * aspect
			ctx.drawImage(
				logoImg,
				zone.cx - zone.lw / 2,
				zone.cy - lh / 2,
				zone.lw,
				lh
			)
		} catch {
			ctx.fillStyle = 'rgba(94,111,85,0.25)'
			ctx.fillRect(zone.cx - zone.lw / 2, zone.cy - zone.lh / 2, zone.lw, zone.lh)
		}
	}

	// Spec panel
	const specX = 2400
	const specY = 1680
	drawRoundedRect(ctx, specX, specY, 980, 780, 16)
	ctx.fillStyle = '#ffffff'
	ctx.fill()
	ctx.strokeStyle = '#c2c0b6'
	ctx.lineWidth = 2
	ctx.stroke()

	ctx.fillStyle = '#141413'
	ctx.font = '400 34px Lora, Georgia, serif'
	ctx.fillText('Print placement sheet', specX + 40, specY + 60)

	const lines = [
		`Fabric fill: ${fabric}`,
		`Logo: ${design.isLogo ? 'ON' : 'OFF'} · Pos ${placement.labelPos} · Size ${placement.labelSize}`,
		`Full texture: ${design.isFull ? 'ON' : 'OFF'}`,
		`Logo center X: ${(placement.xNorm * 100).toFixed(1)}% of front width`,
		`Logo center Y: ${(placement.yNorm * 100).toFixed(1)}% of front height`,
		`Logo width: ${(placement.wNorm * 100).toFixed(1)}% of front width`,
		'',
		'This sheet is the unstitched cloth view:',
		'print graphics on FRONT BODY before sewing',
		'sleeves / back stay blank unless textured.',
		'',
		'Use with DTG / screen / heat-press artwork.',
	]

	ctx.font = '400 24px Poppins, Arial, sans-serif'
	ctx.fillStyle = '#3d3d3a'
	lines.forEach((line, i) => {
		ctx.fillText(line, specX + 40, specY + 120 + i * 42)
	})

	// Pixel grid hint under front logo zone
	ctx.font = '400 18px Poppins, Arial, sans-serif'
	ctx.fillStyle = '#73726c'
	ctx.fillText(
		'Each pixel in the print zone maps 1:1 to the front panel artwork.',
		front.x,
		front.y + front.h + 48
	)

	return canvas
}

/** Front panel only — print plate with graphic exactly where it lands. */
export const buildFrontPrintPlateCanvas = async (
	design: PrintDesignState
): Promise<HTMLCanvasElement> => {
	const W = 2400
	const H = 3000
	const canvas = document.createElement('canvas')
	canvas.width = W
	canvas.height = H
	const ctx = canvas.getContext('2d')!
	const fabric = rgb(design.color)
	const placement = getFlatPlacement(design.logoP, design.logoS)

	ctx.fillStyle = '#FFFFFF'
	ctx.fillRect(0, 0, W, H)

	const pad = 120
	const piece = { x: pad, y: pad + 80, w: W - pad * 2, h: H - pad * 2 - 160 }

	ctx.fillStyle = '#2A2824'
	ctx.font = '600 42px Fraunces, Georgia, serif'
	ctx.fillText('FRONT BODY · Print plate', pad, 90)
	ctx.font = '400 22px Outfit, sans-serif'
	ctx.fillStyle = 'rgba(42,40,36,0.6)'
	ctx.fillText(
		`Organic View · pos ${placement.labelPos} · size ${placement.labelSize}`,
		pad,
		130
	)

	drawCropMarks(ctx, piece.x, piece.y, piece.w, piece.h)
	drawBodyPiece(ctx, piece.x, piece.y, piece.w, piece.h, fabric, true)

	if (design.isFull) {
		try {
			const fullImg = await loadImage(design.full)
			fillBodyTexture(ctx, piece.x, piece.y, piece.w, piece.h, fullImg, true)
		} catch {
			/* ignore */
		}
	}

	const zone = drawPlacementGuide(
		ctx,
		piece.x,
		piece.y,
		piece.w,
		piece.h,
		placement
	)

	if (design.isLogo) {
		try {
			const logoImg = await loadImage(design.logo)
			const aspect = logoImg.height / Math.max(1, logoImg.width)
			const lh = zone.lw * aspect
			ctx.drawImage(
				logoImg,
				zone.cx - zone.lw / 2,
				zone.cy - lh / 2,
				zone.lw,
				lh
			)
		} catch {
			/* ignore */
		}
	}

	return canvas
}

/** Isolated print-ready graphic at high resolution (transparent PNG). */
export const buildPrintReadyGraphicCanvas = async (
	design: PrintDesignState
): Promise<HTMLCanvasElement> => {
	const size = 2048
	const canvas = document.createElement('canvas')
	canvas.width = size
	canvas.height = size
	const ctx = canvas.getContext('2d')!
	ctx.clearRect(0, 0, size, size)

	const source = design.isLogo ? design.logo : design.isFull ? design.full : null
	if (!source) {
		ctx.fillStyle = 'rgba(42,40,36,0.08)'
		ctx.fillRect(0, 0, size, size)
		ctx.fillStyle = '#2A2824'
		ctx.font = '500 36px Outfit, sans-serif'
		ctx.textAlign = 'center'
		ctx.fillText('No graphic enabled', size / 2, size / 2)
		return canvas
	}

	const img = await loadImage(source)
	const pad = 64
	const maxW = size - pad * 2
	const maxH = size - pad * 2
	const scale = Math.min(maxW / img.width, maxH / img.height)
	const w = img.width * scale
	const h = img.height * scale
	ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)

	return canvas
}

export const exportFlatLayout = async (design: PrintDesignState) => {
	const canvas = await buildFlatLayoutCanvas(design)
	downloadCanvas(canvas, 'organic-view-flat-layout.png')
	return canvas
}

export const exportFrontPrintPlate = async (design: PrintDesignState) => {
	const canvas = await buildFrontPrintPlateCanvas(design)
	downloadCanvas(canvas, 'organic-view-front-print-plate.png')
	return canvas
}

export const exportPrintReadyGraphic = async (design: PrintDesignState) => {
	const canvas = await buildPrintReadyGraphicCanvas(design)
	downloadCanvas(canvas, 'organic-view-print-graphic.png')
	return canvas
}

export const exportPrintPack = async (design: PrintDesignState) => {
	await exportFlatLayout(design)
	await exportFrontPrintPlate(design)
	await exportPrintReadyGraphic(design)
}
