import React from 'react';
import { Text } from '@react-three/drei';
import { CELL_SIZE, gridToWorld } from './wordRollerData';
import type { GridLetter } from './wordRollerData';

interface LetterTileProps {
  row: number;
  col: number;
  gridSize: number;
  data: GridLetter;
  isCollected: boolean; // Tells it to turn green
}

export const LetterTile: React.FC<LetterTileProps> = ({
  row,
  col,
  gridSize,
  data,
  isCollected,
}) => {
  const [x, , zWorld] = gridToWorld(row, col, gridSize);

  // Floor plate colors
  const plateColor = isCollected ? '#81C784' : '#f9d876';
  const textColor = isCollected ? '#ffffff' : '#000000';

  return (
    <group position={[x, 0.01, zWorld]}>
      {/* Box tile */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[CELL_SIZE * 0.95, 0.02, CELL_SIZE * 0.95]} />
        <meshStandardMaterial color={plateColor} emissive={plateColor} emissiveIntensity={0.2} />
      </mesh>

      {/* 2D Text laid flat explicitly floating above */}
      <Text
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={CELL_SIZE * 0.5}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Fredoka-Bold.ttf"
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ "
      >
        {data.char}
      </Text>
    </group>
  );
};
