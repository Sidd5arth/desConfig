import { Button3 } from '../components'

const Tab3 = ({
	logoS,
	logoP,
	handleLogoP,
	handleLogoS,
}: {
	logoS: number
	logoP: number
	handleLogoP: (ind: number) => void
	handleLogoS: (ind: number) => void
}) => {
	const handleClick = (ind: number) => {
		switch (ind) {
			case 0:
			case 1:
			case 2:
				handleLogoP(ind)
				break
			case 3:
				handleLogoS(0)
				break
			case 4:
				handleLogoS(1)
				break
			case 5:
				handleLogoS(2)
				break
		}
	}

	return (
		<section className="ui-mark select-none animate-fade-rise">
			<div className="organic-rail gap-1 py-2 px-1.5">
				<p className="text-[14px] font-semibold text-ink px-1">Logo</p>
				<div className="flex md:flex-col items-center gap-1.5">
					<span className="soft-label px-1">Pos</span>
					<div className="flex md:flex-col gap-1">
						<Button3
							active={logoP === 0}
							ind={0}
							text="L"
							handleClick={handleClick}
						/>
						<Button3
							active={logoP === 1}
							ind={1}
							text="M"
							handleClick={handleClick}
						/>
						<Button3
							active={logoP === 2}
							ind={2}
							text="R"
							handleClick={handleClick}
						/>
					</div>
					<span className="soft-label px-1 md:mt-1">Size</span>
					<div className="flex md:flex-col gap-1">
						<Button3
							active={logoS === 0}
							ind={3}
							text="S"
							handleClick={handleClick}
						/>
						<Button3
							active={logoS === 1}
							ind={4}
							text="M"
							handleClick={handleClick}
						/>
						<Button3
							active={logoS === 2}
							ind={5}
							text="L"
							handleClick={handleClick}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Tab3
