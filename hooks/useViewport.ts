"use client";

import { useEffect, useState } from "react";

interface Viewport {
  width: number;
  height: number;
}

export function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return viewport;
}
