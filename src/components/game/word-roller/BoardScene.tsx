import React from 'react';
import { Physics, RigidBody } from '@react-three/rapier';
import { Ball } from './Ball';
import { LetterTile } from './LetterTile';
import { CELL_SIZE, WALL_HEIGHT } from './wordRollerData';
import type { RollingStageConfig, GridLetter } from './wordRollerData';

interface BoardSceneProps {
  boardGrid: GridLetter[][];
  config: RollingStageConfig;
  lettersFoundCount: number;
  pressedKeys: React.MutableRefObject<Set<string>>;
  onBallPosition: (row: number, col: number) => void;
}

export const BoardScene: React.FC<BoardSceneProps> = ({
  boardGrid,
  config,
  lettersFoundCount,
  pressedKeys,
  onBallPosition,
}) => {
  const { gridSize } = config;
  const boardWidth = gridSize * CELL_SIZE;
  const wallThickness = 0.5;
  const hOffset = boardWidth / 2 + wallThickness / 2;

  const bounds = [
    {
      pos: [0, WALL_HEIGHT / 2, -hOffset],
      size: [boardWidth + wallThickness * 2, WALL_HEIGHT, wallThickness],
    },
    {
      pos: [0, WALL_HEIGHT / 2, hOffset],
      size: [boardWidth + wallThickness * 2, WALL_HEIGHT, wallThickness],
    },
    { pos: [-hOffset, WALL_HEIGHT / 2, 0], size: [wallThickness, WALL_HEIGHT, boardWidth] },
    { pos: [hOffset, WALL_HEIGHT / 2, 0], size: [wallThickness, WALL_HEIGHT, boardWidth] },
  ];

  return (
    <Physics gravity={[0, -9.81, 0]}>
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[5, 10, 3]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[boardWidth + 5, boardWidth + 5]} />
          <meshStandardMaterial visible={false} />
        </mesh>
      </RigidBody>

      {bounds.map((w, idx) => (
        <RigidBody
          key={`boundary-${idx}`}
          type="fixed"
          position={w.pos as [number, number, number]}
        >
          <mesh visible={true}>
            <boxGeometry args={w.size as [number, number, number]} />
            <meshStandardMaterial color="#6E9445" />
          </mesh>
        </RigidBody>
      ))}

      {boardGrid.map((rowArr, rowIdx) =>
        rowArr.map((cell, colIdx) => (
          <LetterTile
            key={`${rowIdx}-${colIdx}-${cell.char}`}
            row={rowIdx}
            col={colIdx}
            gridSize={gridSize}
            data={cell}
            isCollected={cell.isTarget && cell.orderIndex < lettersFoundCount}
          />
        ))
      )}

      <Ball gridSize={gridSize} pressedKeys={pressedKeys} onPositionChange={onBallPosition} />
    </Physics>
  );
};
