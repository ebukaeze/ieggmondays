"use client";

import { Canvas } from "@react-three/fiber";
import { cn } from "@/lib/utils";

interface WebGLBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export default function WebGLBackground({ className, children }: WebGLBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 -z-10", className)}>
      <Canvas>{children}</Canvas>
    </div>
  );
}
