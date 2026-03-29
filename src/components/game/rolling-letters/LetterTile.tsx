import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { CELL_SIZE, gridToWorld } from './rollingLettersData';
import type { GridLetter } from './rollingLettersData';

interface LetterTileProps {
  row: number;
  col: number;
  gridSize: number;
  data: GridLetter;
  isCollected: boolean; // Tells it to turn green
}

function createTextTexture(char: string, color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.font = 'bold 150px Fredoka, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, 128, 140);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  // Ensure alpha is preserved
  texture.premultiplyAlpha = false;
  return texture;
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

  const textTexture = useMemo(
    () => createTextTexture(data.char, textColor),
    [data.char, textColor]
  );

  // We place it at y=0.01 to z-fight against the main large floor, but since we
  // manage the floor in BoardScene, we can just make this the actual floor.
  return (
    <group position={[x, 0.01, zWorld]}>
      {/* Rounded Box tile */}
      <RoundedBox
        args={[CELL_SIZE * 0.95, 0.04, CELL_SIZE * 0.95]}
        radius={0.1}
        smoothness={4}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color={plateColor}
          emissive={plateColor}
          emissiveIntensity={0.25}
          roughness={0.5}
        />
      </RoundedBox>

      {/* 2D Text drawn to a CanvasTexture and placed on a flat decal strictly hovering above the geometry */}
      <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CELL_SIZE * 0.7, CELL_SIZE * 0.7]} />
        <meshBasicMaterial
          map={textTexture}
          transparent
          opacity={1}
          depthWrite={false}
          color="#FFFFFF"
        />
      </mesh>
    </group>
  );
};
