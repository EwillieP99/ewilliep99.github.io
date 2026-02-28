// @ts-nocheck — R3F JSX intrinsics are not typed in JSX.IntrinsicElements
import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/** Floating particles that drift around the scene */
function FloatingParticles({ count = 200 }) {
  const mesh = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00f5ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/** Wireframe geometric shapes floating in space */
function FloatingShape({ position, rotation, scale, color, shape }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  shape: "octahedron" | "icosahedron" | "torus";
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.001;
  });

  const geometry = {
    octahedron: <octahedronGeometry args={[1, 0]} />,
    icosahedron: <icosahedronGeometry args={[1, 0]} />,
    torus: <torusGeometry args={[1, 0.3, 8, 16]} />,
  };

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        {geometry[shape]}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

/** Camera that subtly follows mouse position */
function CameraRig() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 0.5, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, state.pointer.y * 0.3 + 0.5, 0.02);
    camera.lookAt(0, 0, 0);
    // Subtle breathing motion
    camera.position.z = 8 + Math.sin(t * 0.3) * 0.3;
  });

  return null;
}

/** Neon text in 3D space */
function NeonText() {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4}>
      <Text
        font="https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6xpmIyXjU1pg.woff2"
        fontSize={0.8}
        color="#00f5ff"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.8, 0]}
        letterSpacing={0.15}
      >
        ETHAN PECORA
        <meshBasicMaterial color="#00f5ff" toneMapped={false} />
      </Text>
      <Text
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2"
        fontSize={0.18}
        color="#a855f7"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
        letterSpacing={0.3}
      >
        NEON OPERATOR
        <meshBasicMaterial color="#a855f7" toneMapped={false} />
      </Text>
    </Float>
  );
}

/** Main 3D hero scene component — lazy-loaded in the Hero section */
export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.5, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#00f5ff" />
          <pointLight position={[-5, -3, 3]} intensity={0.3} color="#a855f7" />

          <CameraRig />
          <NeonText />
          <FloatingParticles count={150} />
          <Stars radius={50} depth={30} count={1000} factor={2} saturation={0.5} fade speed={0.5} />

          {/* Floating wireframe shapes */}
          <FloatingShape position={[-4, 2, -3]} rotation={[0.5, 0, 0]} scale={0.4} color="#00f5ff" shape="octahedron" />
          <FloatingShape position={[4.5, -1, -2]} rotation={[0, 0.3, 0]} scale={0.35} color="#a855f7" shape="icosahedron" />
          <FloatingShape position={[-3, -2, -1]} rotation={[0.2, 0.5, 0]} scale={0.3} color="#f472b6" shape="torus" />
          <FloatingShape position={[3, 2.5, -4]} rotation={[0, 0, 0.5]} scale={0.25} color="#38bdf8" shape="octahedron" />

          {/* Post-processing bloom for neon glow */}
          <EffectComposer>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
