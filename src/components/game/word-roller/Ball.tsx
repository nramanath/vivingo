import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { CELL_SIZE } from './wordRollerData';

interface BallProps {
  gridSize: number;
  pressedKeys: React.MutableRefObject<Set<string>>;
  onPositionChange: (row: number, col: number) => void;
}

const BALL_RADIUS = CELL_SIZE * 0.25; // Smaller relative to cell for a 3x3 open board
const IMPULSE_FORCE = 0.25;
const MAX_VELOCITY = 4.5;

// We reuse the striped texture idea
const createStripedTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#C8E6C9';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#4CAF50';
  for (let y = 0; y < 256; y += 64) {
    ctx.fillRect(0, y, 256, 20);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
};

export const Ball: React.FC<BallProps> = ({ gridSize, pressedKeys, onPositionChange }) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const tex = useMemo(() => createStripedTexture(), []);

  useFrame(() => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    const keys = pressedKeys.current;
    let fx = 0;
    let fz = 0;

    if (keys.has('ArrowUp') || keys.has('KeyW')) fz -= IMPULSE_FORCE;
    if (keys.has('ArrowDown') || keys.has('KeyS')) fz += IMPULSE_FORCE;
    if (keys.has('ArrowLeft') || keys.has('KeyA')) fx -= IMPULSE_FORCE;
    if (keys.has('ArrowRight') || keys.has('KeyD')) fx += IMPULSE_FORCE;

    if (fx !== 0 || fz !== 0) {
      const vel = rb.linvel();
      const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
      if (speed < MAX_VELOCITY) {
        rb.applyImpulse({ x: fx, y: 0, z: fz }, true);
      }
    }

    const vel = rb.linvel();
    if (Math.abs(vel.y) > 0.01) {
      rb.setLinvel({ x: vel.x, y: 0, z: vel.z }, true);
    }

    const pos = rb.translation();
    const col = Math.round(pos.x / CELL_SIZE + gridSize / 2 - 0.5);
    const row = Math.round(pos.z / CELL_SIZE + gridSize / 2 - 0.5);

    // Only broadcast valid inside-grid positions
    if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
      onPositionChange(row, col);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, BALL_RADIUS, 0]} // Spawn in center
      colliders="ball"
      restitution={0.1}
      friction={0.8}
      linearDamping={2.5}
      angularDamping={1.0}
    >
      <mesh castShadow>
        <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
        <meshStandardMaterial map={tex} metalness={0.2} roughness={0.5} />
      </mesh>
    </RigidBody>
  );
};
