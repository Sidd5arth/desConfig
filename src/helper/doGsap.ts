import gsap from 'gsap'
import { MutableRefObject } from 'react'

const timeline = gsap.timeline()

const doGsap = (tref: MutableRefObject<null>) => {
	timeline.from(
		tref.current,
		{
			y: '8%',
			opacity: 0,
			duration: 1.6,
			ease: 'power2.out',
		},
		0
	)
}

export default doGsap
