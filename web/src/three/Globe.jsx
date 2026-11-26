import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import landDots from "../data/land-dots.json";

const R = 1.6;
const toVec = (lat, lon, r = R) => {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};

const dotTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d");
  g.beginPath(); g.arc(16, 16, 14, 0, Math.PI * 2); g.fillStyle = "#fff"; g.fill();
  const t = new THREE.CanvasTexture(c);
  return t;
};

// Dark sphere with a champagne-gold fresnel rim
const sphereMat = () =>
  new THREE.ShaderMaterial({
    uniforms: { uRim: { value: new THREE.Color("#c6a46a") }, uBase: { value: new THREE.Color("#121110") } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uRim; uniform vec3 uBase; varying vec3 vN; varying vec3 vV;
      void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.6); gl_FragColor = vec4(mix(uBase, uRim, f*0.85), 1.0); }`,
  });

function Arc({ from, to, active }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const lift = 1 + from.distanceTo(to) * 0.28;
    mid.setLength(R * lift);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
  }, [from, to]);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.material.opacity = active ? 0.35 + Math.sin(clock.elapsedTime * 2) * 0.15 : 0;
  });
  return (
    <line ref={ref} geometry={geo}>
      <lineBasicMaterial color="#dcc394" transparent opacity={0} depthWrite={false} />
    </line>
  );
}

function Marker({ pos, active }) {
  const ring = useRef();
  const dot = useRef();
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);
  useFrame(({ clock }, dt) => {
    const t = (clock.elapsedTime * 0.8) % 1;
    const s = active ? 1 + t * 2.6 : 1 + t * 1.2;
    ring.current.scale.setScalar(s);
    ring.current.material.opacity = (1 - t) * (active ? 0.9 : 0.35);
    const target = active ? 1.8 : 1;
    dot.current.scale.setScalar(THREE.MathUtils.lerp(dot.current.scale.x, target, 1 - Math.pow(0.001, dt)));
  });
  return (
    <group position={pos} quaternion={q}>
      <mesh ref={dot}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial color="#f1d9a8" toneMapped={false} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.04, 0.05, 40]} />
        <meshBasicMaterial color="#c6a46a" transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function World({ markets, active, pointer }) {
  const group = useRef();
  const dots = useMemo(() => {
    const arr = new Float32Array((landDots.length / 2) * 3);
    for (let i = 0; i < landDots.length; i += 2) {
      const v = toVec(landDots[i], landDots[i + 1], R * 1.002);
      arr.set([v.x, v.y, v.z], (i / 2) * 3);
    }
    return arr;
  }, []);
  const tex = useMemo(dotTexture, []);
  const mat = useMemo(sphereMat, []);
  const positions = useMemo(() => markets.map((m) => toVec(m.lat, m.lon, R * 1.01)), [markets]);

  // Rotate the globe (north always up) so the active market faces the viewer, slightly above centre
  const target = useMemo(() => new THREE.Quaternion(), []);
  const qy = useMemo(() => new THREE.Quaternion(), []);
  const qx = useMemo(() => new THREE.Quaternion(), []);
  const tilt = useMemo(() => new THREE.Quaternion(), []);
  const Y = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const X = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  useFrame((_, dt) => {
    const d = positions[active];
    const yaw = Math.atan2(d.x, d.z);              // angle around the vertical axis
    const pitch = Math.asin(d.y / d.length());       // latitude
    qy.setFromAxisAngle(Y, -yaw);
    qx.setFromAxisAngle(X, pitch - 0.3);
    target.copy(qx).multiply(qy);
    tilt.setFromEuler(new THREE.Euler(pointer.current.y * 0.12, pointer.current.x * 0.2, 0));
    target.premultiply(tilt);
    group.current.quaternion.slerp(target, 1 - Math.pow(0.04, dt));
  });

  return (
    <group ref={group}>
      <mesh material={mat}>
        <sphereGeometry args={[R, 64, 64]} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={dots} count={dots.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial map={tex} color="#d8bb86" size={0.05} sizeAttenuation transparent opacity={0.8} alphaTest={0.2} depthWrite={false} toneMapped={false} />
      </points>
      {positions.map((p, i) => <Marker key={markets[i].name} pos={p} active={i === active} />)}
      {positions.map((p, i) => (i === active ? null : <Arc key={"a" + i} from={positions[active]} to={p} active />))}
    </group>
  );
}

export default function Globe({ markets, active, pointer, running, mobile }) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      frameloop={running ? "always" : "never"}
      camera={{ fov: 32, position: [0, 0, 6.2] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <World markets={markets} active={active} pointer={pointer} />
    </Canvas>
  );
}
