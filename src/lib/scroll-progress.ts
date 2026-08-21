/**
 * Jembatan antara GSAP ScrollTrigger dan render loop Three.js.
 *
 * Sengaja berupa objek biasa, bukan React state: nilainya berubah tiap frame saat
 * pengguna menggulir, dan memicu re-render React sesering itu akan membuang
 * kerja percuma. ScrollTrigger menulis, useFrame membaca.
 */
export const heroScroll = { progress: 0 };
