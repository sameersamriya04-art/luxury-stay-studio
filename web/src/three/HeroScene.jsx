import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* ------------------------------------------------------------------
   Hero 3D scene
   - Backdrop: the villa image on a plane with a depth-parallax shader
   - Floating gold architectural frames (metallic, environment reflections)
   - Gold dust particles
   - Camera responds to the mouse and flies through the central frame on scroll
   ------------------------------------------------------------------ */

const backdropVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const backdropFrag = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uMouse;
  uniform float uProgress;
  uniform float uReveal;
  uniform float uPlaneAspect;
  uniform float uImgAspect;
  varying vec2 vUv;

  vec2 cover(vec2 uv) {
    vec2 s = uPlaneAspect > uImgAspect ? vec2(1.0, uImgAspect / uPlaneAspect) : vec2(uPlaneAspect / uImgAspect, 1.0);
    return (uv - 0.5) * s + 0.5;
  }
  void main() {
    vec2 uv = vUv;
    float zoom = 1.0 - 0.07 * uProgress - 0.06 * (1.0 - uReveal);
    uv = (uv - 0.5) * zoom + 0.5;
    // Pseudo depth: the foreground (bottom of frame) moves more than the horizon
    float depth = mix(0.15, 1.0, smoothstep(0.1, 0.95, 1.0 - uv.y));
    uv += uMouse * vec2(0.014, 0.01) * depth;
    uv.y += uProgress * 0.05 * depth;
    vec3 col = texture2D(uTex, clamp(cover(uv), 0.001, 0.999)).rgb;
    // Gentle cinematic grade
    float l = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(l), col, 0.9) * vec3(1.03, 0.99, 0.93);
    float v = smoothstep(1.25, 0.2, length((vUv - 0.5) * vec2(1.25, 1.0)));
    col *= mix(0.32, 1.0, v);
    col *= (1.0 - 0.6 * uProgress) * uReveal;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function Backdrop({ src, mouse, progress, onReady }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const { camera, size } = useThree();
  const mat = useRef();
  const dist = 10;

  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
  }, [tex]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uMouse: { value: new THREE.Vector2() },
      uProgress: { value: 0 },
      uReveal: { value: 0 },
      uPlaneAspect: { value: 1 },
      uImgAspect: { value: tex.image.width / tex.image.height },
    }),
    [tex]
  );

  // Plane big enough to cover the view (with margin for camera movement)
  const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist * 1.3;
  const w = h * (size.width / size.height);
  uniforms.uPlaneAspect.value = w / h;

  useEffect(() => { onReady && onReady(); }, [onReady]);

  useFrame((_, dt) => {
    const u = mat.current.uniforms;
    u.uMouse.value.lerp(mouse.current, 1 - Math.pow(0.001, dt));
    u.uProgress.value = THREE.MathUtils.lerp(u.uProgress.value, progress.current, 1 - Math.pow(0.0005, dt));
    u.uReveal.value = Math.min(1, u.uReveal.value + dt * 0.6);
  });

  return (
    <mesh position={[0, 0, 6 - dist]}>
      <planeGeometry args={[w, h]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={backdropVert} fragmentShader={backdropFrag} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function frameGeometry(w, h, t) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -h / 2); shape.lineTo(w / 2, -h / 2); shape.lineTo(w / 2, h / 2); shape.lineTo(-w / 2, h / 2); shape.closePath();
  const hole = new THREE.Path();
  hole.moveTo(-w / 2 + t, -h / 2 + t); hole.lineTo(-w / 2 + t, h / 2 - t); hole.lineTo(w / 2 - t, h / 2 - t); hole.lineTo(w / 2 - t, -h / 2 + t); hole.closePath();
  shape.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3 });
  g.center();
  return g;
}

function Frames({ mobile }) {
  const group = useRef();
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#c6a46a", metalness: 1, roughness: 0.26, envMapIntensity: 1.1 }),
    []
  );
  const frames = useMemo(() => {
    const all = [
      { w: 3.5, h: 2.15, t: 0.035, p: [0, -0.05, 1.7], r: [0, 0, 0], s: 0.0 },
      { w: 1.25, h: 1.7, t: 0.03, p: [-2.9, 0.55, 0.2], r: [0.05, 0.5, 0.06], s: 1.3 },
      { w: 1.5, h: 1.0, t: 0.028, p: [3.0, -0.75, -0.4], r: [-0.08, -0.55, -0.05], s: 2.1 },
      { w: 0.8, h: 1.15, t: 0.022, p: [1.9, 1.35, -1.6], r: [0.12, -0.3, 0.1], s: 3.2 },
    ];
    return (mobile ? all.slice(0, 2).map((f, i) => (i === 1 ? { ...f, p: [-0.9, 1.6, 0.3], w: 0.9, h: 1.2 } : { ...f, w: 2.3, h: 3.2 })) : all).map(
      (f) => ({ ...f, geo: frameGeometry(f.w, f.h, f.t) })
    );
  }, [mobile]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current.children.forEach((m, i) => {
      const f = frames[i];
      m.position.y = f.p[1] + Math.sin(t * 0.45 + f.s) * 0.06;
      m.rotation.y = f.r[1] + Math.sin(t * 0.25 + f.s) * 0.05;
      m.rotation.x = f.r[0] + Math.cos(t * 0.3 + f.s) * 0.03;
    });
  });

  return (
    <group ref={group}>
      {frames.map((f, i) => (
        <mesh key={i} geometry={f.geo} material={material} position={f.p} rotation={f.r} />
      ))}
    </group>
  );
}

function Dust({ count }) {
  const ref = useRef();
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = Math.random() * 6 - 3;
      speeds[i] = 0.03 + Math.random() * 0.08;
    }
    return { positions, speeds };
  }, [count]);

  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,240,210,1)");
    grd.addColorStop(0.35, "rgba(220,195,148,0.55)");
    grd.addColorStop(1, "rgba(198,164,106,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useFrame((_, dt) => {
    const a = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = a.array[i * 3 + 1] + speeds[i] * dt;
      if (y > 3.5) y = -3.5;
      a.array[i * 3 + 1] = y;
      a.array[i * 3] += Math.sin(y * 2 + i) * 0.0008;
    }
    a.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial map={texture} size={0.07} sizeAttenuation transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => { env.dispose(); pmrem.dispose(); scene.environment = null; };
  }, [gl, scene]);
  return null;
}

function CameraRig({ mouse, progress }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, -3), []);
  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.002, dt);
    const p = progress.current;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.45, k);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current.y * 0.25, k);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6 - p * 4.8, k);
    camera.lookAt(target);
  });
  return null;
}

export default function HeroScene({ mouse, progress, active, mobile, onReady }) {
  const src = window.innerWidth > 960 ? "assets/images/web/hero-cliffside-1920.webp" : "assets/images/web/hero-cliffside-960.webp";
  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 35, position: [0, 0, 6], near: 0.1, far: 50 }}
      gl={{ antialias: !mobile, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.setClearColor("#111111"); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }}
    >
      <Environment />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#ffe2b0" />
      <directionalLight position={[-4, -1, 2]} intensity={0.5} color="#9fb4d0" />
      <Suspense fallback={null}>
        <Backdrop src={src} mouse={mouse} progress={progress} onReady={onReady} />
      </Suspense>
      <Frames mobile={mobile} />
      <Dust count={mobile ? 260 : 700} />
      <CameraRig mouse={mouse} progress={progress} />
    </Canvas>
  );
}
