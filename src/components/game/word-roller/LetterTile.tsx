import React from 'react';
import { Text } from '@react-three/drei';
import { CELL_SIZE, gridToWorld } from './wordRollerData';
import type { GridLetter } from './wordRollerData';

// Theme color constants for Three.js (WebGL cannot parse CSS variables directly)
const COLOR_FREESIA = '#f9d876';
const COLOR_SUCCESS = '#81C784';
const COLOR_TEXT_LIGHT = '#ffffff';
const COLOR_TEXT_DARK = '#1a1a1a';

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
  const plateColor = isCollected ? COLOR_SUCCESS : COLOR_FREESIA;
  const textColor = isCollected ? COLOR_TEXT_LIGHT : COLOR_TEXT_DARK;

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
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ "
      >
        {data.char}
      </Text>
    </group>
  );
};
