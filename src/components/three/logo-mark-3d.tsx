"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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
 * Marka PT Adhi Teknologi Indonesia sebagai tiga prisma terekstrusi.
 *
 * Catatan soal aturan merek: brand kit melarang memutar atau memiringkan marka.
 * Karena itu gerakannya sengaja dibatasi — ayunan kecil di bawah 10° yang selalu
 * kembali ke posisi tegak, bukan rotasi penuh, sehingga marka tetap terbaca benar
 * di setiap frame. Setel MAX_TILT ke 0 bila ingin benar-benar diam.
 */
const MAX_TILT = 0.16; // radian, ±9,2°

export function LogoMark3D({
  palette,
  reducedMotion,
}: {
  palette: Palette;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { pointer, viewport } = useThree();

  const geometries = useMemo(() => {
    const build = (pts: readonly (readonly [number, number])[]) => {
      const geo = new THREE.ExtrudeGeometry(toShape(pts), EXTRUDE);
      // Pusatkan pada sumbu Z agar prisma berputar terhadap tengah tebalnya,
      // bukan terhadap permukaan depan.
      geo.translate(0, 0, -DEPTH / 2);
      return geo;
    };
    return {
      left: build(PATHS.left),
      right: build(PATHS.right),
      gold: build(PATHS.gold),
    };
  }, []);

  // ExtrudeGeometry mengalokasikan buffer di GPU; lepaskan saat komponen dilepas.
  useLayoutEffect(() => {
    const list = Object.values(geometries);
    return () => list.forEach((g) => g.dispose());
  }, [geometries]);

  // Marka diletakkan di sisi kanan agar tidak menutupi judul yang rata kiri.
  // Di viewport sempit ia mengecil dan bergeser ke tengah-atas.
  const { scale, offsetX } = useMemo(() => {
    const narrow = viewport.width < 7;
    return {
      scale: (narrow ? 0.026 : 0.036) * 1,
      offsetX: narrow ? 0 : viewport.width * 0.24,
    };
  }, [viewport.width]);

  useFrame((state, delta) => {
    if (!group.current || !inner.current) return;
    const t = state.clock.getElapsedTime();

    if (reducedMotion) {
      // Keadaan akhir langsung, tanpa gerakan sama sekali.
      inner.current.rotation.set(-0.12, -0.34, 0);
      inner.current.position.y = 0;
      group.current.position.x = offsetX;
      return;
    }

    // Ayunan terbatas — selalu kembali tegak, tidak pernah berputar penuh.
    inner.current.rotation.y = Math.sin(t * 0.42) * MAX_TILT - 0.28;
    inner.current.rotation.x = Math.sin(t * 0.31) * 0.06 - 0.1;

    // Mengambang pelan agar tidak terasa mati.
    inner.current.position.y = Math.sin(t * 0.55) * 0.12;

    // Parallax kursor: lerp, bukan snap.
    const targetX = offsetX + pointer.x * 0.35;
    const targetRotX = inner.current.rotation.x + pointer.y * 0.08;
    group.current.position.x += (targetX - group.current.position.x) * 0.045;
    inner.current.rotation.x += (targetRotX - inner.current.rotation.x) * 0.05;

    void delta;
  });

  return (
    <>
      {/* Scene ini memakai material ber-cahaya, jadi lampunya memang diperlukan —
          berbeda dengan scene sebelumnya yang seluruhnya MeshBasicMaterial.
          Tidak ada bayangan: selain mahal, brand kit melarang bayangan pada marka. */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 8]} intensity={2.4} />
      <directionalLight position={[-6, -2, -4]} intensity={1.1} color={palette.rim} />

      <group ref={group} position={[offsetX, 0, 0]}>
        <group ref={inner} scale={scale} rotation={[-0.1, -0.28, 0]}>
          <mesh geometry={geometries.left}>
            <meshStandardMaterial color={palette.left} metalness={0.28} roughness={0.38} />
          </mesh>
          <mesh geometry={geometries.right}>
            <meshStandardMaterial color={palette.right} metalness={0.28} roughness={0.34} />
          </mesh>
          {/* Bilah emas sedikit lebih maju agar tetap memotong huruf A seperti
              pada marka dua dimensi, dan lebih metalik supaya menangkap cahaya. */}
          <mesh geometry={geometries.gold} position={[0, 0, 6]}>
            <meshStandardMaterial color={palette.gold} metalness={0.72} roughness={0.22} />
          </mesh>
        </group>
      </group>
    </>
  );
}
