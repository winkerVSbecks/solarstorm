import { Suspense } from 'react';
import shallow from 'zustand/shallow';
import { OrbitControls, CameraShake } from '@react-three/drei';
import { Sparks } from './Sparks';
import { SparkStorm } from './SparkStorm';
import { SpaceDust } from './SpaceDust';
import { Planet } from './Planet';
import { SpaceShip } from './SpaceShip';
import { useMusicStore } from './useMusicStore';

const appStateSelector = (state) => ({
  sparkStorm: state.sparkStorm,
  planetDistortion: state.planetDistortion,
  spaceshipDistortion: state.spaceshipDistortion,
  beep: state.beep,
  planetDistortionMax: state.planetDistortionMax,
});

/**
 * URL:
 * https://farbvelo.elastiq.ch/?s=eyJzIjoiMTAxNTcwMDEyZDNkZCIsImEiOjYsImNnIjo0LCJoZyI6dHJ1ZSwiaGIiOnRydWUsImhvIjpmYWxzZSwiaHQiOmZhbHNlLCJiIjpmYWxzZSwicCI6MC4xNzUsIm1kIjo2MCwiY20iOiJsYWIiLCJmIjoiU2ltcGxleCBOb2lzZSIsImMiOiJoc2x1diJ9
 *
 * // '#A2CCB6',
 * // '#FCEEB5',
 * // '#EE786E',
 * // '#e0feff',
 * // 'lightpink',
 * // 'lightblue',
 */

const colors = {
  malevolentIllusion: [
    '#c06995',
    '#de77c7',
    '#df86df',
    '#d998ee',
    '#ceadf4',
    '#c6bff9',
  ],
  sunnyRainbow: [
    '#fbe555',
    '#fb9224',
    '#f45905',
    '#be8abf',
    '#ffeed0',
    '#feff89',
  ],
};

export function Scene({ init = false, mouse, isMobile }) {
  const {
    sparkStorm,
    planetDistortion,
    spaceshipDistortion,
    beep,
    planetDistortionMax,
  } = useMusicStore(appStateSelector, shallow);

  return (
    <Suspense fallback={null}>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableRotate={false}
        enableZoom={false}
      />
      <CameraShake
        yawFrequency={0.05 * (sparkStorm ? 10 : 1)}
        rollFrequency={0.2 * (sparkStorm ? 2 : 1)}
        pitchFrequency={0.1 * (sparkStorm ? 2 : 1)}
      />
      <pointLight distance={100} intensity={4} color="white" />
      {init && <SpaceShip />}
      <Planet
        distortionScale={planetDistortionMax ? 15 : planetDistortion ? 10 : 5}
      />
      <SpaceDust count={isMobile ? 5000 : 10000} mouse={mouse} />
      <Sparks count={20} mouse={mouse} colors={colors.malevolentIllusion} />
      {sparkStorm && (
        <SparkStorm count={500} mouse={mouse} colors={colors.sunnyRainbow} />
      )}
    </Suspense>
  );
}
