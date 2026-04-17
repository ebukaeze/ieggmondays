"use client";

import { Canvas } from "@react-three/fiber";
import ParticleField from "./ParticleField";

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ParticleField />
    </Canvas>
  );
}
