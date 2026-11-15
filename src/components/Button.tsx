const Button = ({
	img,
	active,
	ind,
	changeTab,
}: {
	img: string
	active: boolean
	ind: number
	changeTab: (ind: number) => void
}) => {
	return (
		<button
			type="button"
			className={`tool-btn ${active ? 'is-active' : ''}`}
			aria-pressed={active}
			onClick={() => changeTab(ind)}
		>
			<img className="tool-btn__icon" draggable={false} src={img} alt="" />
		</button>
	)
}

export default Button
