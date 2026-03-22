import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Stars, PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const FONT_ORBITRON = "/fonts/orbitron-latin-700.woff2";
const FONT_JETBRAINS = "/fonts/jetbrains-mono-latin-400.woff2";

export type HeroSceneProps = {
  /** 0 = top of hero section, 1 = bottom of scroll range — updated from parent, read in useFrame */
  scrollProgressRef: React.RefObject<number>;
};

type ShapeKind = "octahedron" | "icosahedron" | "torus";

const SHAPE_CONFIGS: Array<{
  kind: ShapeKind;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
}> = [
  { kind: "octahedron", position: [-4, 2, -3], rotation: [0.5, 0, 0], scale: 0.4, color: "#00f5ff" },
  { kind: "icosahedron", position: [4.5, -1, -2], rotation: [0, 0.3, 0], scale: 0.35, color: "#a855f7" },
  { kind: "torus", position: [-3, -2, -1], rotation: [0.2, 0.5, 0], scale: 0.3, color: "#f472b6" },
  { kind: "octahedron", position: [3, 2.5, -4], rotation: [0, 0, 0.5], scale: 0.25, color: "#38bdf8" },
];

function useDisposableGeometries() {
  const geos = useMemo(() => {
    const octahedron = new THREE.OctahedronGeometry(1, 0);
    const icosahedron = new THREE.IcosahedronGeometry(1, 0);
    const torus = new THREE.TorusGeometry(1, 0.3, 8, 16);
    return { octahedron, icosahedron, torus };
  }, []);

  useEffect(
    () => () => {
      geos.octahedron.dispose();
      geos.icosahedron.dispose();
      geos.torus.dispose();
    },
    [geos],
  );

  return geos;
}

/** Single useFrame drives camera, particles, shapes, and hero text group (scroll evolution) */
function HeroSceneRig({
  scrollProgressRef,
  particlesRef,
  shapeRefs,
  textGroupRef,
  particleCount,
}: {
  scrollProgressRef: React.RefObject<number>;
  particlesRef: React.RefObject<THREE.Points | null>;
  shapeRefs: React.RefObject<(THREE.Mesh | null)[]>;
  textGroupRef: React.RefObject<THREE.Group | null>;
  particleCount: number;
}) {
  const { camera } = useThree();
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [particleCount]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = Math.min(1, Math.max(0, scrollProgressRef.current ?? 0));

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 0.5, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, state.pointer.y * 0.3 + 0.5, 0.02);
    const breath = Math.sin(t * 0.3) * 0.3;
    const scrollPull = p * 5.5;
    camera.position.z = 8 + breath + scrollPull;
    camera.lookAt(0, 0, 0);

    const pts = particlesRef.current;
    if (pts) {
      pts.rotation.y = t * 0.02;
      pts.rotation.x = Math.sin(t * 0.01) * 0.1;
    }

    const meshes = shapeRefs.current;
    SHAPE_CONFIGS.forEach((cfg, i) => {
      const mesh = meshes[i];
      if (!mesh) return;
      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.005;
      const baseY = cfg.position[1];
      mesh.position.y = baseY + Math.sin(t + cfg.position[0]) * 0.12;
    });

    const tg = textGroupRef.current;
    if (tg) {
      const s = THREE.MathUtils.lerp(1, 0.72, p);
      tg.scale.setScalar(s);
      tg.position.z = THREE.MathUtils.lerp(0, -1.2, p);
    }
  });

  return (
    <points ref={particlesRef} key={particleCount}>
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

function NeonText3D() {
  return (
    <>
      <Text
        font={FONT_ORBITRON}
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
        font={FONT_JETBRAINS}
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
    </>
  );
}

type QualityTier = "high" | "medium" | "low";

function SceneInner({
  scrollProgressRef,
  tier,
}: {
  scrollProgressRef: React.RefObject<number>;
  tier: QualityTier;
}) {
  const particlesRef = useRef<THREE.Points | null>(null);
  const shapeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const textGroupRef = useRef<THREE.Group | null>(null);
  const geos = useDisposableGeometries();

  const particleCount = tier === "low" ? 80 : tier === "medium" ? 120 : 150;
  const starsCount = tier === "low" ? 250 : tier === "medium" ? 500 : 1000;
  const bloomOn = tier !== "low";
  const bloomIntensity = tier === "high" ? 1.2 : 0.75;

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#00f5ff" />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#a855f7" />

      <HeroSceneRig
        scrollProgressRef={scrollProgressRef}
        particlesRef={particlesRef}
        shapeRefs={shapeRefs}
        textGroupRef={textGroupRef}
        particleCount={particleCount}
      />

      <group ref={textGroupRef}>
        <NeonText3D />
      </group>

      <Stars radius={50} depth={30} count={starsCount} factor={2} saturation={0.5} fade speed={0.5} />

      {SHAPE_CONFIGS.map((cfg, i) => {
        const geo =
          cfg.kind === "octahedron"
            ? geos.octahedron
            : cfg.kind === "icosahedron"
              ? geos.icosahedron
              : geos.torus;
        return (
          <mesh
            key={i}
            ref={(el) => {
              shapeRefs.current[i] = el;
            }}
            geometry={geo}
            position={cfg.position}
            rotation={cfg.rotation}
            scale={cfg.scale}
          >
            <meshBasicMaterial color={cfg.color} wireframe transparent opacity={0.3} />
          </mesh>
        );
      })}

      {bloomOn && (
        <EffectComposer>
          <Bloom
            intensity={bloomIntensity}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

/** Performance + quality tier — lifts load when FPS recovers */
function AdaptiveScene({
  scrollProgressRef,
}: {
  scrollProgressRef: React.RefObject<number>;
}) {
  const [tier, setTier] = useState<QualityTier>("high");

  return (
    <>
      <PerformanceMonitor
        flipflops={4}
        factor={1}
        onDecline={() => setTier((t) => (t === "high" ? "medium" : "low"))}
        onIncline={() => setTier((t) => (t === "low" ? "medium" : "high"))}
      />
      <AdaptiveDpr pixelated />
      <SceneInner scrollProgressRef={scrollProgressRef} tier={tier} />
    </>
  );
}

export function HeroScene({ scrollProgressRef }: HeroSceneProps) {
  const maxDpr = 1.5;

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.5, 8], fov: 50 }}
        dpr={[1, maxDpr]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <AdaptiveScene scrollProgressRef={scrollProgressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
