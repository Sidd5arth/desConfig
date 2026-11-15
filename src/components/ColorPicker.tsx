import { SketchPicker } from 'react-color'
import { Irgb } from '../types'

const ColorPicker = ({
	color,
	changeColor,
}: {
	color: Irgb
	changeColor: (rgb: Irgb) => void
}) => {
	return (
		<div className="px-2 pb-3">
			<SketchPicker
				styles={{
					default: {
						picker: {
							background: '#ffffff',
							boxShadow: 'none',
							width: '100%',
							padding: '4px 8px 8px',
						},
					},
				}}
				color={color}
				disableAlpha
				presetColors={[
					'#222222',
					'#ffffff',
					'#b8ff1a',
					'#9ae600',
					'#6a6a6a',
					'#3f3f3f',
					'#f7f7f7',
					'#428bff',
					'#c13515',
					'#717171',
				]}
				onChange={(next) => {
					changeColor({
						r: next.rgb.r,
						g: next.rgb.g,
						b: next.rgb.b,
					})
				}}
			/>
		</div>
	)
}

export default ColorPicker
