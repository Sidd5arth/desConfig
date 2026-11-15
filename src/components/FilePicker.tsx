import { Dispatch } from 'react'

import { Button4 } from '.'

const FilePicker = ({
	img,
	setLogo,
	setFull,
	setFile,
	enLogo,
	setEnLogo,
	enFull,
	setEnFull,
}: {
	img: string | null
	setLogo: Dispatch<string>
	setFull: Dispatch<string>
	setFile: Dispatch<File>
	enLogo: boolean
	setEnLogo: Dispatch<boolean>
	enFull: boolean
	setEnFull: Dispatch<boolean>
}) => {
	const handleClick = (ind: number) => {
		if (!img) return
		switch (ind) {
			case 1:
				if (!enLogo) setLogo(img)
				else setLogo('./logo.png')
				setEnLogo(!enLogo)
				break
			case 2:
				if (!enFull) setFull(img)
				else setFull('./full.jpg')
				setEnFull(!enFull)
				break
		}
	}

	const reset = () => {
		setEnFull(false)
		setEnLogo(false)
	}

	return (
		<section className="flex flex-col items-center px-3 pb-4">
			<input
				id="file-upload"
				type="file"
				accept="image/*"
				className="w-full text-[12px] text-muted file:mr-2 file:rounded-full file:border file:border-hairline file:bg-surface-soft file:px-3 file:py-1.5 file:text-ink file:text-[12px] file:font-medium file:hover:bg-surface-strong"
				onChange={(e) => {
					reset()
					const f = e.target.files?.[0]
					if (f) setFile(f)
				}}
			/>
			<div className="flex justify-center overflow-hidden h-[150px] sm:h-[180px] w-full mt-3 mb-2 rounded-air bg-surface-soft border border-hairline-soft">
				{img ? (
					<img
						src={img}
						alt="Uploaded texture"
						className="max-h-full max-w-[140px] object-contain"
						draggable={false}
					/>
				) : (
					<p className="self-center text-[13px] text-muted-soft">No file yet</p>
				)}
			</div>
			<p className="soft-label mb-1">Apply to garment</p>
			<div className="flex flex-wrap justify-center">
				<Button4 text="Logo" ind={1} active={enLogo} handleClick={handleClick} />
				<Button4 text="Full" ind={2} active={enFull} handleClick={handleClick} />
			</div>
		</section>
	)
}

export default FilePicker
