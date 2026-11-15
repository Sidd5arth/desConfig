import { Html } from '@react-three/drei'

const Loader = () => {
	return (
		<Html center>
			<div className="flex flex-col items-center gap-3">
				<div className="loader-ring w-11 h-11" />
				<p className="text-[12px] font-semibold text-muted">Loading</p>
			</div>
		</Html>
	)
}

export default Loader
