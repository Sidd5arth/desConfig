import { Irgb } from './Irgb'

export type LogoPos = 0 | 1 | 2
export type LogoSize = 0 | 1 | 2

export interface PrintDesignState {
	color: Irgb
	logo: string
	full: string
	isLogo: boolean
	isFull: boolean
	logoP: number
	logoS: number
}

export interface FlatPlacement {
	/** Center X of logo as 0–1 across front panel */
	xNorm: number
	/** Center Y of logo as 0–1 down front panel */
	yNorm: number
	/** Logo width as fraction of front panel width */
	wNorm: number
	labelPos: 'L' | 'M' | 'R'
	labelSize: 'S' | 'M' | 'L'
}
