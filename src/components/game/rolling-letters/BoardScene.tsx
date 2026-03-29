import React from 'react';
import { Physics, RigidBody } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import { Ball } from './Ball';
import { LetterTile } from './LetterTile';
import { CELL_SIZE, WALL_HEIGHT } from './rollingLettersData';
import type { RollingStageConfig, GridLetter } from './rollingLettersData';

interface BoardSceneProps {
  boardGrid: GridLetter[][];
  config: RollingStageConfig;
  lettersFoundCount: number;
  pressedKeys: React.MutableRefObject<Set<string>>;
  onBallPosition: (row: number, col: number) => void;
}

const WALL_COLOR = '#6E9445';

export const BoardScene: React.FC<BoardSceneProps> = ({
  boardGrid,
  config,
  lettersFoundCount,
  pressedKeys,
  onBallPosition,
}) => {
  const { gridSize } = config;

  // The total width of the board is gridSize * CELL_SIZE
  const boardWidth = gridSize * CELL_SIZE;

  // Outer walls geometry and positions
  const wallThickness = 0.5;
  const hOffset = boardWidth / 2 + wallThickness / 2;

  // 4 bounding walls
  const bounds = [
    {
      pos: [0, WALL_HEIGHT / 2, -hOffset],
      size: [boardWidth + wallThickness * 2, WALL_HEIGHT, wallThickness],
    }, // top
    {
      pos: [0, WALL_HEIGHT / 2, hOffset],
      size: [boardWidth + wallThickness * 2, WALL_HEIGHT, wallThickness],
    }, // bottom
    { pos: [-hOffset, WALL_HEIGHT / 2, 0], size: [wallThickness, WALL_HEIGHT, boardWidth] }, // left
    { pos: [hOffset, WALL_HEIGHT / 2, 0], size: [wallThickness, WALL_HEIGHT, boardWidth] }, // right
  ];

  return (
    <Physics gravity={[0, -9.81, 0]}>
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 10, 3]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Invisible physics floor plane for ball bouncing */}
      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[boardWidth + 5, boardWidth + 5]} />
          <meshStandardMaterial visible={false} />
        </mesh>
      </RigidBody>

      {/* Perimeter Bounding Walls styled beautifully with Rounded corners */}
      {bounds.map((w, idx) => (
        <RigidBody
          key={`boundary-${idx}`}
          type="fixed"
          position={w.pos as [number, number, number]}
        >
          <RoundedBox
            args={w.size as [number, number, number]}
            radius={0.15}
            smoothness={4}
            receiveShadow
            castShadow
          >
            <meshStandardMaterial color={WALL_COLOR} roughness={0.7} />
          </RoundedBox>
        </RigidBody>
      ))}

      {/* Grid Letters */}
      {boardGrid.map((rowArr, rowIdx) =>
        rowArr.map((cell, colIdx) => (
          <LetterTile
            key={`${rowIdx}-${colIdx}-${cell.char}`}
            row={rowIdx}
            col={colIdx}
            gridSize={gridSize}
            data={cell}
            // If the cell is a target and its orderIndex is strictly less than lettersFoundCount, it's green!
            isCollected={cell.isTarget && cell.orderIndex < lettersFoundCount}
          />
        ))
      )}

      <Ball gridSize={gridSize} pressedKeys={pressedKeys} onPositionChange={onBallPosition} />
    </Physics>
  );
};
