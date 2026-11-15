import { logo, full, save } from '../assets/icons'
import { Button2 } from '../components'

const Tab1 = ({
	handleLogo,
	handleFull,
	isLogo,
	isFull,
	onExport,
}: {
	handleLogo: () => void
	handleFull: () => void
	isLogo: boolean
	isFull: boolean
	onExport: () => void
}) => {
	const handleClick = (ind: number) => {
		switch (ind) {
			case 1:
				handleLogo()
				break
			case 2:
				handleFull()
				break
			case 3:
				onExport()
				break
		}
	}

	return (
		<section className="ui-dock select-none animate-fade-rise">
			<div className="organic-dock flex items-center justify-around gap-1 px-2 py-1.5 w-full">
				<Button2 img={logo} active={isLogo} ind={1} handleClick={handleClick} />
				<Button2 img={full} active={isFull} ind={2} handleClick={handleClick} />
				<Button2 img={save} active={false} ind={3} handleClick={handleClick} />
			</div>
		</section>
	)
}

export default Tab1
