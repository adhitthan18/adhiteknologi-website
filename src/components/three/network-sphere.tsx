"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Palette = {
  node: string;
  nodeAlt: string;
  line: string;
  shell: string;
  lineOpacity: number;
};

const NODE_COUNT = 130;
const RADIUS = 2.55;
const LINK_DISTANCE = 1.05;

/** Distribusi titik merata di permukaan bola (spiral Fibonacci). */
function fibonacciSphere(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push(
      new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius),
    );
  }
  return points;
}

/**
 * Jaringan node + garis penghubung: metafora perangkat IoT yang saling terhubung.
 * Semua geometri dibuat sekali di useMemo — tidak ada konstruktor geometri di dalam loop frame.
 */
export function NetworkSphere({
  palette,
  reducedMotion,
}: {
  palette: Palette;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const instances = useRef<THREE.InstancedMesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const nodes = useMemo(() => fibonacciSphere(NODE_COUNT, RADIUS), []);

  // Fase acak per node supaya denyutnya tidak seragam.
  const phases = useMemo(
    () => Float32Array.from({ length: NODE_COUNT }, (_, i) => (i * 12.9898) % (Math.PI * 2)),
    [],
  );

  const linePositions = useMemo(() => {
    const segments: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < LINK_DISTANCE) {
          segments.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z,
          );
        }
      }
    }
    return new Float32Array(segments);
  }, [nodes]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return geo;
  }, [linePositions]);

  const nodeColors = useMemo(() => {
    const primary = new THREE.Color(palette.node);
    const alt = new THREE.Color(palette.nodeAlt);
    const array = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      const c = i % 5 === 0 ? alt : primary;
      array[i * 3] = c.r;
      array[i * 3 + 1] = c.g;
      array[i * 3 + 2] = c.b;
    }
    return array;
  }, [palette.node, palette.nodeAlt]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Tempatkan instance sekali sebelum frame pertama; hanya skala yang berubah sesudahnya.
  useLayoutEffect(() => {
    if (!instances.current) return;
    for (let i = 0; i < NODE_COUNT; i++) {
      dummy.position.copy(nodes[i]);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      instances.current.setMatrixAt(i, dummy.matrix);
    }
    instances.current.instanceMatrix.needsUpdate = true;
  }, [nodes, dummy]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const mesh = instances.current;

    if (mesh) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const pulse = reducedMotion ? 1 : 0.75 + Math.sin(t * 1.6 + phases[i]) * 0.45;
        dummy.position.copy(nodes[i]);
        dummy.scale.setScalar(pulse);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    if (!group.current) return;

    if (reducedMotion) {
      group.current.rotation.set(-0.15, 0.6, 0.1);
      return;
    }

    group.current.rotation.y += delta * 0.11;
    // Parallax lembut mengikuti kursor (lerp, bukan snap).
    group.current.rotation.x += (pointer.y * 0.22 - group.current.rotation.x) * 0.04;
    group.current.position.x += (pointer.x * 0.3 - group.current.position.x) * 0.04;

    if (shell.current) shell.current.rotation.y -= delta * 0.05;
  });

  return (
    <group ref={group} rotation={[-0.15, 0, 0.1]}>
      <instancedMesh ref={instances} args={[undefined, undefined, NODE_COUNT]} frustumCulled={false}>
        <sphereGeometry args={[0.035, 10, 10]}>
          <instancedBufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
        </sphereGeometry>
        {/* MeshBasicMaterial mengabaikan cahaya — scene ini sengaja tanpa light sama sekali. */}
        <meshBasicMaterial vertexColors toneMapped={false} />
      </instancedMesh>

      <lineSegments geometry={lineGeometry} frustumCulled={false}>
        <lineBasicMaterial
          color={palette.line}
          transparent
          opacity={palette.lineOpacity}
          toneMapped={false}
        />
      </lineSegments>

      <mesh ref={shell}>
        <icosahedronGeometry args={[RADIUS * 1.32, 1]} />
        <meshBasicMaterial
          color={palette.shell}
          wireframe
          transparent
          opacity={0.16}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
