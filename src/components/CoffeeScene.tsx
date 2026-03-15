import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface BeanProps {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  speed: number
}

function CoffeeBean({ position, rotation, scale, speed }: BeanProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * speed * 0.4
    meshRef.current.rotation.x += delta * speed * 0.15
  })

  return (
    <Float
      speed={speed}
      rotationIntensity={0.3}
      floatIntensity={0.8}
      floatingRange={[-0.15, 0.15]}
    >
      <mesh ref={meshRef} position={position} rotation={rotation} scale={[1, 0.55, 0.7]}>
        <sphereGeometry args={[0.18 * scale, 16, 12]} />
        <meshStandardMaterial color="#3d1f0f" roughness={0.6} metalness={0.05} />
      </mesh>
    </Float>
  )
}

function BeanField() {
  const beans = useMemo(() => {
    // Seeded PRNG for deterministic layout
    let seed = 42
    const rand = () => {
      seed = (seed * 16807 + 0) % 2147483647
      return (seed - 1) / 2147483646
    }

    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      position: [
        (rand() - 0.5) * 8,
        (rand() - 0.5) * 5,
        (rand() - 0.5) * 4,
      ] as [number, number, number],
      rotation: [
        rand() * Math.PI,
        rand() * Math.PI,
        rand() * Math.PI,
      ] as [number, number, number],
      scale: 0.7 + rand() * 0.8,
      speed: 0.3 + rand() * 0.7,
    }))
  }, [])

  return (
    <>
      <pointLight position={[3, 3, 2]} color="#c49a3c" intensity={4} />
      <pointLight position={[-2, -2, 3]} color="#c4622d" intensity={2} />
      <ambientLight color="#3d1f0f" intensity={1.5} />
      {beans.map((bean) => (
        <CoffeeBean key={bean.id} {...bean} />
      ))}
    </>
  )
}

export default function CoffeeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
      gl={{ alpha: true }}
      dpr={[1, 1.5]}
    >
      <BeanField />
    </Canvas>
  )
}
