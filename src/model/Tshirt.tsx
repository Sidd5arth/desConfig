import { useMemo } from 'react'
import { useGLTF, useTexture, Decal } from '@react-three/drei'
import * as THREE from 'three'

import modelGltf from '../assets/3d/tshirt.glb'
import { Irgb } from '../types'

const Tshirt = ({
	logo,
	full,
	color,
	logoP,
	logoS,
	isMobile,
	isFull,
	isLogo,
}: {
	logo: string
	full: string
	color: Irgb
	logoP: number
	logoS: number
	isMobile: boolean
	isFull: boolean
	isLogo: boolean
}) => {
	const { nodes } = useGLTF(modelGltf) as any
	const logoTex = useTexture(logo)
	const fullTex = useTexture(full)

	logoTex.colorSpace = THREE.SRGBColorSpace
	fullTex.colorSpace = THREE.SRGBColorSpace
	logoTex.anisotropy = 8
	fullTex.anisotropy = 8

	const fabricColor = useMemo(() => {
		const c = new THREE.Color()
		// Color picker values are sRGB — convert into Three's linear working space
		c.setRGB(color.r / 255, color.g / 255, color.b / 255, THREE.SRGBColorSpace)
		return c
	}, [color.r, color.g, color.b])

	const genP = () => {
		switch (logoP) {
			case 0:
				return -0.075
			case 1:
				return 0
			case 2:
				return 0.075
			default:
				return 0
		}
	}

	const genS = () => {
		switch (logoS) {
			case 0:
				return 0.09
			case 1:
				return 0.12
			case 2:
				return 0.17
			default:
				return 0.12
		}
	}

	return (
		<group scale={isMobile ? 5.2 : 8.5}>
			<mesh
				castShadow
				receiveShadow
				name="tshirt"
				geometry={nodes.tshirt.geometry}
				position={[0, isMobile ? 0.28 : 0.08, 0]}
				dispose={null}
			>
				<meshStandardMaterial
					color={fabricColor}
					roughness={0.78}
					metalness={0.02}
					envMapIntensity={0.35}
				/>
				{isFull && (
					<Decal position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1}>
						<meshStandardMaterial
							map={fullTex}
							roughness={0.85}
							metalness={0}
							polygonOffset
							polygonOffsetFactor={-1}
							transparent
						/>
					</Decal>
				)}
				{isLogo && (
					<Decal
						position={[genP(), 0.08, 0.13]}
						rotation={[0, 0, 0]}
						scale={genS()}
						map={logoTex}
						depthTest
					/>
				)}
			</mesh>
		</group>
	)
}

export default Tshirt
