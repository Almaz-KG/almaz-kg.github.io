import { useEffect, useRef } from "react";
import { startNodeField } from "@/utils/nodeField";
import { prefersReducedMotion } from "@/utils/motion";

/** Canvas host for the drifting node/edge network. Sits out entirely when motion is reduced. */
export function NodeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;
    return startNodeField(canvas);
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full opacity-60" />;
}
