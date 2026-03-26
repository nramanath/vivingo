import React from 'react';
import { Physics, RigidBody } from '@react-three/rapier';
import { Ball } from './Ball';
import { CELL_SIZE, WALL_HEIGHT, gridToWorld } from './mazeData';
import type { StageConfig } from './mazeData';

interface MazeSceneProps {
  mazeGrid: number[][];
  stageConfig: StageConfig;
  pressedKeys: React.MutableRefObject<Set<string>>;
  onBallPosition: (row: number, col: number) => void;
}

const WALL_COLOR = '#6E9445';
const WALL_TOP_COLOR = '#98b66e';
const ENTRY_COLOR = '#c5e5a5';
const EXIT_COLOR = '#f9d876';
const PATH_COLOR = '#FFF8E7';

export const MazeScene: React.FC<MazeSceneProps> = ({
  mazeGrid,
  stageConfig,
  pressedKeys,
  onBallPosition,
}) => {
  const { gridRows, gridCols, entryRow, exitRow } = stageConfig;

  const walls: React.ReactNode[] = [];
  const paths: React.ReactNode[] = [];

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const [x, , z] = gridToWorld(row, col, gridRows, gridCols);

      if (mazeGrid[row][col] === 1) {
        walls.push(
          <RigidBody key={`wall-${row}-${col}`} type="fixed" position={[x, 0, z]}>
            <mesh castShadow receiveShadow position={[0, WALL_HEIGHT / 2, 0]}>
              <boxGeometry args={[CELL_SIZE * 0.98, WALL_HEIGHT, CELL_SIZE * 0.98]} />
              <meshStandardMaterial color={WALL_COLOR} />
            </mesh>
            {/* lighter top cap */}
            <mesh position={[0, WALL_HEIGHT + 0.01, 0]}>
              <boxGeometry args={[CELL_SIZE * 0.98, 0.02, CELL_SIZE * 0.98]} />
              <meshStandardMaterial color={WALL_TOP_COLOR} />
            </mesh>
          </RigidBody>
        );
      } else {
        paths.push(
          <mesh key={`path-${row}-${col}`} position={[x, 0.01, z]} receiveShadow>
            <boxGeometry args={[CELL_SIZE * 0.95, 0.02, CELL_SIZE * 0.95]} />
            <meshStandardMaterial color={PATH_COLOR} />
          </mesh>
        );
      }
    }
  }

  const [entryX, , entryZ] = gridToWorld(entryRow, -1, gridRows, gridCols);
  const [exitX, , exitZ] = gridToWorld(exitRow, gridCols, gridRows, gridCols);

  return (
    <Physics gravity={[0, -9.81, 0]}>
      {/* Lighting */}
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[5, 10, 3]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 8, -5]} intensity={0.3} />

      {/* Invisible floor plane — keeps ball from falling, no visual */}
      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[gridCols * CELL_SIZE + 8, gridRows * CELL_SIZE + 8]} />
          <meshStandardMaterial visible={false} />
        </mesh>
      </RigidBody>

      {/* Maze walls (with colliders) */}
      {walls}

      {/* Path tiles (visual only) */}
      {paths}

      {/* Entry pad */}
      <mesh position={[entryX, 0.02, entryZ]}>
        <boxGeometry args={[CELL_SIZE * 0.9, 0.04, CELL_SIZE * 0.9]} />
        <meshStandardMaterial color={ENTRY_COLOR} emissive={ENTRY_COLOR} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[entryX - 0.35, 0.06, entryZ]}>
        <boxGeometry args={[0.15, 0.06, 0.6]} />
        <meshStandardMaterial color={ENTRY_COLOR} />
      </mesh>

      {/* Exit pad */}
      <mesh position={[exitX, 0.02, exitZ]}>
        <boxGeometry args={[CELL_SIZE * 0.9, 0.04, CELL_SIZE * 0.9]} />
        <meshStandardMaterial color={EXIT_COLOR} emissive={EXIT_COLOR} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[exitX + 0.35, 0.06, exitZ]}>
        <boxGeometry args={[0.15, 0.06, 0.6]} />
        <meshStandardMaterial color={EXIT_COLOR} />
      </mesh>

      {/* Physics ball */}
      <Ball
        gridRows={gridRows}
        gridCols={gridCols}
        pressedKeys={pressedKeys}
        onPositionChange={onBallPosition}
      />
    </Physics>
  );
};
