import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { gridToWorld, CELL_SIZE } from './mazeData';

/** Props for the physics-driven ball component. */
interface BallProps {
  gridRows: number;
  gridCols: number;
  /** Ref to the set of currently held key codes, read each frame for impulse calculation. */
  pressedKeys: React.MutableRefObject<Set<string>>;
  /** Called every frame with the ball's current grid cell for win/stage detection. */
  onPositionChange: (row: number, col: number) => void;
}

const BALL_RADIUS = CELL_SIZE * 0.35;
const IMPULSE_FORCE = 0.18;
const MAX_VELOCITY = 3.5;

const createStripedTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#98b66e';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#6E9445';
  for (let y = 0; y < 256; y += 64) {
    ctx.fillRect(0, y, 256, 20);
  }

  ctx.fillStyle = '#c5e5a5';
  for (let x = 0; x < 256; x += 64) {
    ctx.fillRect(x, 0, 10, 256);
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(128, 40, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f9d876';
  ctx.beginPath();
  ctx.arc(128, 200, 18, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
};

/**
 * Physics-driven ball using React Three Rapier.
 * Applies impulse forces from held keys for free-flowing movement.
 * Reads world position each frame to report grid cell for win detection.
 */
export const Ball: React.FC<BallProps> = ({
  gridRows,
  gridCols,
  pressedKeys,
  onPositionChange,
}) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const stripedTexture = useMemo(() => createStripedTexture(), []);

  // Spawn point: one cell to the left of the maze's left border
  const [startX, , startZ] = gridToWorld(1, -1, gridRows, gridCols);

  useFrame(() => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    // --- Apply impulse from held keys ---
    const keys = pressedKeys.current;
    let fx = 0;
    let fz = 0;

    if (keys.has('ArrowUp') || keys.has('KeyW')) fz -= IMPULSE_FORCE;
    if (keys.has('ArrowDown') || keys.has('KeyS')) fz += IMPULSE_FORCE;
    if (keys.has('ArrowLeft') || keys.has('KeyA')) fx -= IMPULSE_FORCE;
    if (keys.has('ArrowRight') || keys.has('KeyD')) fx += IMPULSE_FORCE;

    if (fx !== 0 || fz !== 0) {
      // Clamp velocity so ball doesn't go too fast
      const vel = rb.linvel();
      const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
      if (speed < MAX_VELOCITY) {
        rb.applyImpulse({ x: fx, y: 0, z: fz }, true);
      }
    }

    // --- Keep ball on the XZ plane (no bouncing up) ---
    const vel = rb.linvel();
    if (Math.abs(vel.y) > 0.01) {
      rb.setLinvel({ x: vel.x, y: 0, z: vel.z }, true);
    }

    // --- Report grid position for win detection ---
    const pos = rb.translation();
    const col = Math.round(pos.x / CELL_SIZE + gridCols / 2 - 0.5);
    const row = Math.round(pos.z / CELL_SIZE + gridRows / 2 - 0.5);
    onPositionChange(row, col);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[startX, BALL_RADIUS, startZ]}
      colliders="ball"
      restitution={0.1}
      friction={0.8}
      linearDamping={2.5}
      angularDamping={1.0}
    >
      <mesh castShadow>
        <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
        <meshStandardMaterial map={stripedTexture} metalness={0.2} roughness={0.5} />
      </mesh>
    </RigidBody>
  );
};
