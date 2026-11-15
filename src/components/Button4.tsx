const Button4 = ({
	text,
	ind,
	active,
	handleClick,
}: {
	text: string
	ind: number
	active: boolean
	handleClick: (ind: number) => void
}) => {
	return (
		<button
			type="button"
			className={`action-btn ${active ? 'is-active' : ''}`}
			aria-pressed={active}
			onClick={() => handleClick(ind)}
		>
			{text}
		</button>
	)
}

export default Button4
