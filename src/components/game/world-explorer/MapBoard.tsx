import React, { memo, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { CONTINENTS, type ContinentData } from './continentData';
import countryMappingData from '../../../assets/country-by-continent.json';

const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

interface MapBoardProps {
  phase: 'LEARNING' | 'CHALLENGE' | 'GAMEOVER';
  activeLearningContinent?: ContinentData;
  feedbackContinentId?: string | null;
  foundContinents?: string[];
}

export const MapBoard: React.FC<MapBoardProps> = memo(
  ({ phase, activeLearningContinent, feedbackContinentId, foundContinents = [] }) => {
    // Memoize exact name matching for perfect 7 colors
    const getContinentColor = useMemo(() => {
      // Map country name to continent string
      const map = new Map<string, string>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (countryMappingData as any[]).forEach((item) => {
        map.set(item.country, item.continent);
      });

      // Handle common naming variations between packages
      map.set('United States of America', 'North America');
      map.set('Russian Federation', 'Asia'); // The majority is in Asia for bounding coloring purposes

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (geo: any) => {
        const countryName = geo.properties.name;
        const continentName = map.get(countryName) || map.get(countryName.split(',')[0]); // Fallbacks

        const found = CONTINENTS.find((c) => c.name === continentName || c.id === continentName);
        if (found) return found.color;

        // FALLBACK: Hybrid fallback for unmapped odd names, islands, or micro-nations (fixes yellow parts of Africa).
        // We safely compute closest Euclidean distance from visual continent center
        try {
          const centroid = geoCentroid(geo);
          let minDistance = Infinity;
          let closestInfo = CONTINENTS[0];
          for (const c of CONTINENTS) {
            const dist = Math.hypot(c.center[0] - centroid[0], c.center[1] - centroid[1]);
            if (dist < minDistance) {
              minDistance = dist;
              closestInfo = c;
            }
          }
          return closestInfo.color;
        } catch {
          return '#D4E157'; // fallback color for unmatched tiny islands
        }
      };
    }, []);

    return (
      <div className="w-full h-full relative flex items-center justify-center bg-[#E0F7FA] rounded-xl overflow-hidden shadow-inner border-4 border-white/50">
        <ComposableMap
          projection="geoEquirectangular"
          projectionConfig={{ scale: 130, center: [0, 10] }}
          style={{ width: '100%', height: '100%', outline: 'none' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              // Because the standard world-atlas library inexplicably removed Antarctica
              // from its 2.0 version to prevent Mercator projection stretching, we artificially
              // inject a simple synthetic GeoJSON Polygon representing the southern polar region!
              const antarcticaGeo = {
                type: 'Feature',
                properties: { name: 'Antarctica' },
                rsmKey: 'artificial-antarctica',
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [-180, -90],
                      [180, -90],
                      [180, -65],
                      [-180, -65],
                      [-180, -90],
                    ],
                  ],
                },
              };

              const fullMap = [...geographies, antarcticaGeo];

              return fullMap.map((geo) => {
                const continentColor = getContinentColor(geo);

                return (
                  <Geography
                    key={geo.rsmKey || geo.properties.name}
                    geography={geo}
                    style={{
                      default: {
                        fill: continentColor,
                        outline: 'none',
                        stroke: 'none',
                        strokeWidth: 0,
                      },
                      hover: { fill: continentColor, outline: 'none' },
                      pressed: { fill: continentColor, outline: 'none' },
                    }}
                  />
                );
              });
            }}
          </Geographies>

          {/* Draw Continent Markers/Numbers */}
          {CONTINENTS.map((cont) => {
            const isLearningActive =
              phase === 'LEARNING' && activeLearningContinent?.id === cont.id;
            const isSuccessFeedback = feedbackContinentId === cont.id;

            return (
              <Marker key={cont.id} coordinates={cont.center}>
                <g>
                  {/* Number Key Badge (Always visible, smaller size) */}
                  <circle
                    cx={0}
                    cy={0}
                    r={14}
                    fill="#FFF"
                    stroke={cont.color}
                    strokeWidth={2}
                    className="transition-all duration-300 pointer-events-none"
                    style={{
                      transform: isLearningActive || isSuccessFeedback ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                  <text
                    textAnchor="middle"
                    y={5}
                    className="font-fredoka font-black text-lg transition-all duration-300 pointer-events-none"
                    fill={cont.color}
                    style={{
                      transform: isLearningActive || isSuccessFeedback ? 'scale(1.3)' : 'scale(1)',
                    }}
                  >
                    {cont.numberKey}
                  </text>

                  {/* Name Label (Visible entirely in LEARNING phase, OR if continent was already found) */}
                  {(phase === 'LEARNING' || foundContinents.includes(cont.id)) && (
                    <text
                      textAnchor="middle"
                      y={isLearningActive || isSuccessFeedback ? 55 : 45}
                      className="font-fredoka font-black fill-black text-2xl drop-shadow-md transition-all duration-300 pointer-events-none"
                      style={{
                        opacity: isLearningActive ? 1 : 0.6,
                        transform: isLearningActive ? 'scale(1.2)' : 'scale(1)',
                        fill: foundContinents.includes(cont.id) ? '#333' : '#000',
                      }}
                    >
                      {cont.name}
                    </text>
                  )}
                </g>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>
    );
  }
);

MapBoard.displayName = 'MapBoard';
