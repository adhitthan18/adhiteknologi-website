"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll-progress";

type Palette = {
  left: string;
  right: string;
  gold: string;
  rim: string;
};

/**
 * Koordinat diambil apa adanya dari `logo/ati-marka-primer.svg` (viewBox 140×140).
 * SVG memakai sumbu Y ke bawah, Three.js ke atas — konversinya di `toShape()`.
 * Jangan mengubah angka di sini; kalau bentuk marka direvisi, salin ulang dari
 * brand kit seperti yang diminta README brand.
 */
const PATHS = {
  left: [
    [70, 14],
    [44, 118],
    [14, 118],
    [56, 14],
  ],
  right: [
    [84, 14],
    [126, 118],
    [94, 118],
    [64, 40],
  ],
  gold: [
    [34, 82],
    [118, 66],
    [114, 90],
    [30, 106],
  ],
} as const;

const VIEWBOX = 140;
const DEPTH = 16;

/** Ubah titik SVG menjadi Shape yang berpusat di titik asal, dengan Y dibalik. */
function toShape(points: readonly (readonly [number, number])[]) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], i) => {
    const cx = x - VIEWBOX / 2;
    const cy = VIEWBOX / 2 - y;
    if (i === 0) shape.moveTo(cx, cy);
    else shape.lineTo(cx, cy);
  });
  shape.closePath();
  return shape;
}

const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: DEPTH,
  bevelEnabled: true,
  bevelThickness: 1.6,
  bevelSize: 1.2,
  bevelSegments: 3,
  curveSegments: 1,
};

/**
 * Aturan merek melarang memutar atau memiringkan marka, jadi gerakannya dibatasi
 * ayunan kecil yang selalu kembali tegak — bukan rotasi penuh. Setel ke 0 untuk
 * marka yang benar-benar diam.
 */
const MAX_TILT = 0.16; // radian, ±9,2°

/** Arah pisah tiap prisma saat tampilan terurai. Sumbu Z memberi kesan kedalaman. */
const EXPLODE = {
  left: new THREE.Vector3(-14, 4, -10),
  right: new THREE.Vector3(14, 4, -10),
  gold: new THREE.Vector3(0, -10, 26),
} as const;

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * Geser tiap prisma menjauh dari pusat sebanding `amount` (0 = menyatu).
 * Didefinisikan di luar komponen karena tidak membutuhkan apa pun dari render —
 * fungsi yang menyentuh ref tapi dideklarasikan di badan komponen akan dianggap
 * berjalan pada fase render oleh aturan lint React.
 */
function applyExplode(
  meshes: { left: THREE.Mesh | null; right: THREE.Mesh | null; gold: THREE.Mesh | null },
  amount: number,
) {
  const eased = amount * amount; // lambat di awal, supaya awal scroll terasa halus

  const pairs: Array<[THREE.Mesh | null, THREE.Vector3, number]> = [
    [meshes.left, EXPLODE.left, 0],
    [meshes.right, EXPLODE.right, 0],
    // Bilah emas memang duduk 6 unit di depan agar tetap memotong huruf A.
    [meshes.gold, EXPLODE.gold, 6],
  ];

  for (const [mesh, dir, baseZ] of pairs) {
    if (!mesh) continue;
    mesh.position.set(dir.x * eased, dir.y * eased, baseZ + dir.z * eased);
    mesh.rotation.z = dir.x * 0.004 * eased;
  }
}

export function LogoMark3D({
  palette,
  reducedMotion,
}: {
  palette: Palette;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const goldRef = useRef<THREE.Mesh>(null);

  // Kemajuan animasi rakit saat halaman dibuka, 0 → 1.
  const assemble = useRef(0);
  const { pointer, size } = useThree();

  const geometries = useMemo(() => {
    const build = (pts: readonly (readonly [number, number])[]) => {
      const geo = new THREE.ExtrudeGeometry(toShape(pts), EXTRUDE);
      // Pusatkan pada sumbu Z agar prisma berputar terhadap tengah tebalnya.
      geo.translate(0, 0, -DEPTH / 2);
      return geo;
    };
    return { left: build(PATHS.left), right: build(PATHS.right), gold: build(PATHS.gold) };
  }, []);

  useLayoutEffect(() => {
    const list = Object.values(geometries);
    return () => list.forEach((g) => g.dispose());
  }, [geometries]);

  /**
   * Patokan lebar memakai piksel, bukan world unit. World unit ikut berubah saat
   * bentuk kotak canvas berubah — di mobile kotaknya pendek dan lebar, sehingga
   * pengukuran world unit justru mengira layarnya besar.
   * 1024 px menyamai breakpoint `lg` yang dipakai layout hero.
   */
  const isNarrow = size.width < 1024;
  const scale = isNarrow ? 0.04 : 0.036;

  useFrame((state, delta) => {
    const g = group.current;
    const i = inner.current;
    if (!g || !i) return;

    const t = state.clock.getElapsedTime();

    // Marka di sisi kanan pada desktop agar tidak menutupi judul yang rata kiri.
    // Di mobile ia punya blok sendiri di bawah teks, jadi cukup di tengah.
    const baseX = isNarrow ? 0 : state.viewport.width * 0.24;

    if (reducedMotion) {
      assemble.current = 1;
      i.rotation.set(-0.12, -0.34, 0);
      i.position.y = 0;
      g.position.x = baseX;
      applyExplode({ left: leftRef.current, right: rightRef.current, gold: goldRef.current }, 0);
      return;
    }

    // Rakit sekali di awal, lalu tidak diulang.
    if (assemble.current < 1) {
      assemble.current = Math.min(1, assemble.current + delta * 0.75);
    }
    const a = easeOutCubic(assemble.current);

    // Terurai mengikuti scroll, dan kembali menyatu saat digulir naik.
    applyExplode(
      { left: leftRef.current, right: rightRef.current, gold: goldRef.current },
      heroScroll.progress,
    );

    // Ayunan terbatas — selalu kembali tegak.
    i.rotation.y = Math.sin(t * 0.42) * MAX_TILT - 0.28 * a;
    i.position.y = Math.sin(t * 0.55) * 0.12 * a;

    // Parallax kursor: lerp, bukan snap.
    const targetX = baseX + pointer.x * 0.35;
    g.position.x += (targetX - g.position.x) * 0.045;

    const targetRotX = -0.1 + pointer.y * 0.1 + Math.sin(t * 0.31) * 0.05;
    i.rotation.x += (targetRotX - i.rotation.x) * 0.05;

    // Selama merakit, marka datang dari belakang sambil membesar.
    i.scale.setScalar(scale * (0.72 + 0.28 * a));
    g.position.z = -6 * (1 - a);
  });

  return (
    <>
      {/* Lightformer memberi pantulan yang membuat emas terbaca metalik. Semuanya
          dibangkitkan di dalam scene — tidak ada HDR yang diunduh dari luar. */}
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.4} position={[3, 4, 6]} scale={[8, 8, 1]} />
        <Lightformer form="rect" intensity={1.2} color={palette.rim} position={[-6, -2, -4]} scale={[6, 6, 1]} />
        <Lightformer form="circle" intensity={1.6} position={[0, 6, 2]} scale={4} />
      </Environment>

      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 8]} intensity={1.8} />
      <directionalLight position={[-6, -2, -4]} intensity={0.8} color={palette.rim} />

      <group ref={group}>
        <group ref={inner} rotation={[-0.1, -0.28, 0]}>
          <mesh ref={leftRef} geometry={geometries.left}>
            <meshStandardMaterial
              color={palette.left}
              metalness={0.45}
              roughness={0.3}
              envMapIntensity={0.7}
            />
          </mesh>
          <mesh ref={rightRef} geometry={geometries.right}>
            <meshStandardMaterial
              color={palette.right}
              metalness={0.45}
              roughness={0.28}
              envMapIntensity={0.8}
            />
          </mesh>
          <mesh ref={goldRef} geometry={geometries.gold} position={[0, 0, 6]}>
            <meshStandardMaterial
              color={palette.gold}
              metalness={0.9}
              roughness={0.18}
              envMapIntensity={1.4}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}
