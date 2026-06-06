import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { CELL_SIZE, gridToWorld } from './wordRollerData';
import type { GridLetter } from './wordRollerData';

// Theme color constants for Three.js (WebGL cannot parse CSS variables directly)
export const COLOR_FREESIA = '#f9d876'; // Brand Freesia Yellow
export const COLOR_SUCCESS = '#98b66e'; // Brand Kelly Green
export const COLOR_TEXT_LIGHT = '#ffffff';
export const COLOR_TEXT_DARK = '#1a1a1a';

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
    // Draw the letter centered with Fredoka font (loaded in index.html)
    ctx.font = 'bold 160px Fredoka, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, 128, 132); // Slightly offset vertically for optimal visual centering
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
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
  const plateColor = isCollected ? COLOR_SUCCESS : COLOR_FREESIA;
  const textColor = isCollected ? COLOR_TEXT_LIGHT : COLOR_TEXT_DARK;

  const textTexture = useMemo(
    () => createTextTexture(data.char, textColor),
    [data.char, textColor]
  );

  // Clean up WebGL texture resource on component unmount / update
  useEffect(() => {
    return () => {
      textTexture.dispose();
    };
  }, [textTexture]);

  return (
    <group position={[x, 0.01, zWorld]}>
      {/* Box tile - Basic material so colors are flat and match CSS exactly */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[CELL_SIZE * 0.95, 0.02, CELL_SIZE * 0.95]} />
        <meshBasicMaterial color={plateColor} toneMapped={false} />
      </mesh>

      {/* 2D Text drawn to a CanvasTexture and placed on a flat plane strictly hovering above the geometry */}
      <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CELL_SIZE * 0.7, CELL_SIZE * 0.7]} />
        <meshBasicMaterial
          map={textTexture}
          transparent
          opacity={1}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
