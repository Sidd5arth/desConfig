import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

import { Tshirt } from './'
import { Loader } from '../containers'
import { Irgb } from '../types'

const Model = ({
	isMobile,
	color,
	logo,
	isLogo,
	full,
	isFull,
	logoP,
	logoS,
}: {
	isMobile: boolean
	color: Irgb
	logo: string
	isLogo: boolean
	isFull: boolean
	logoS: number
	logoP: number
	full: string
}) => {
	return (
		<Canvas
			shadows
			gl={{
				preserveDrawingBuffer: true,
				antialias: true,
				alpha: true,
				outputColorSpace: THREE.SRGBColorSpace,
			}}
			camera={{
				fov: 28,
				position: [0, 4.5, 18],
			}}
		>
			<Suspense fallback={<Loader />}>
				<ambientLight intensity={0.5} color="#ffffff" />
				<hemisphereLight intensity={0.35} color="#ffffff" groundColor="#dddddd" />
				<directionalLight
					position={[5, 8, 4]}
					intensity={1.2}
					color="#ffffff"
					castShadow
				/>
				<directionalLight position={[-4, 2, -3]} intensity={0.3} color="#f7f7f7" />
				<Environment preset="warehouse" intensity={0.18} />
				<Tshirt
					logo={logo}
					full={full}
					color={color}
					logoP={logoP}
					logoS={logoS}
					isMobile={isMobile}
					isFull={isFull}
					isLogo={isLogo}
				/>
				<ContactShadows
					position={[0, isMobile ? -0.15 : -0.5, 0]}
					opacity={0.2}
					scale={14}
					blur={2.8}
					far={5}
					color="#222222"
				/>
				<OrbitControls
					target={[0, isMobile ? 0.75 : 0.35, 0]}
					maxDistance={28}
					minDistance={9}
					maxPolarAngle={Math.PI / 1.9}
					minPolarAngle={Math.PI / 4}
					enablePan={false}
				/>
			</Suspense>
		</Canvas>
	)
}

export default Model
