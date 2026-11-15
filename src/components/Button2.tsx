const Button2 = ({
	img,
	active,
	ind,
	handleClick,
}: {
	img: string
	active: boolean
	ind: number
	handleClick: (ind: number) => void
}) => {
	return (
		<button
			type="button"
			className={`tool-btn ${active ? 'is-active' : ''}`}
			aria-pressed={active}
			onClick={() => handleClick(ind)}
		>
			<img className="tool-btn__icon" draggable={false} src={img} alt="" />
		</button>
	)
}

export default Button2
