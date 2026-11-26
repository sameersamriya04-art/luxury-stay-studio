// Device / preference detection used to scale effects up or down.
const mm = (q) => typeof window !== "undefined" && window.matchMedia && window.matchMedia(q).matches;

export const prefersReducedMotion = () => mm("(prefers-reduced-motion: reduce)");
export const isFinePointer = () => mm("(pointer: fine)") && mm("(hover: hover)");
export const isMobile = () => mm("(max-width: 1023px)");

let webgl;
export function webglSupported() {
  if (webgl !== undefined) return webgl;
  try {
    const c = document.createElement("canvas");
    webgl = !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    webgl = false;
  }
  return webgl;
}

// Rough low-power heuristic: few CPU cores, little memory, or data-saver on.
export function isLowPower() {
  const n = navigator;
  const cores = n.hardwareConcurrency || 4;
  const mem = n.deviceMemory || 4;
  const saveData = n.connection && n.connection.saveData;
  return saveData || cores <= 3 || mem <= 2;
}

// 3D is used when WebGL works, motion is allowed and the device isn't weak.
export const use3D = () => webglSupported() && !prefersReducedMotion() && !isLowPower();
