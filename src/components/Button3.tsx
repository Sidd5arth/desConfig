const Button3 = ({
	active,
	ind,
	text,
	handleClick,
}: {
	active: boolean
	ind: number
	text: string
	handleClick: (ind: number) => void
}) => {
	return (
		<button
			type="button"
			className={`tool-btn text-[14px] ${active ? 'is-active' : ''}`}
			aria-pressed={active}
			onClick={() => handleClick(ind)}
		>
			{text}
		</button>
	)
}

export default Button3
