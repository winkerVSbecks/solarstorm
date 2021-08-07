import { OrbitControls, CameraShake } from '@react-three/drei';

import { Sparks } from './Sparks';
import { SparkStorm } from './SparkStorm';
import { SpaceDust } from './SpaceDust';
import { Planet } from './Planet';

export function Scene({ mouse, isMobile }) {
  return (
    <>
      <OrbitControls makeDefault />
      <CameraShake
        yawFrequency={0.05 * 10}
        rollFrequency={0.2 * 2}
        pitchFrequency={0.1 * 2}
      />
      <pointLight distance={100} intensity={4} color="white" />
      {/* spaceship */}
      <Planet />
      <SpaceDust count={isMobile ? 5000 : 10000} mouse={mouse} />
      <SparkStorm
        count={500}
        mouse={mouse}
        colors={[
          '#fbe555',
          '#fb9224',
          '#f45905',
          '#be8abf',
          '#ffeed0',
          '#feff89',
        ]}
      />
      <Sparks
        count={20}
        mouse={mouse}
        colors={[
          '#c06995',
          '#de77c7',
          '#df86df',
          '#d998ee',
          '#ceadf4',
          '#c6bff9',
        ]}
      />
    </>
  );
}

/**
 * Audio
 * https://threejs.org/docs/#api/en/audio/Audio
 * https://github.com/mrdoob/three.js/blob/master/examples/webaudio_visualizer.html
 *
 * Malevolent Illusion
 * ⸺
 * Malevolent Mauve #c06995
 * Pink Orchid #de77c7
 * Frail Fuchsia #df86df
 * Dream Vapor #d998ee
 * Violet Heaven #ceadf4
 * Purple Illusion #c6bff9
 * ⸺
 * URL:
 * https://farbvelo.elastiq.ch/? * s=eyJzIjoiMTAxNTcwMDEyZDNkZCIsImEiOjYsImNnIjo0LCJoZyI6dHJ1ZSwiaGIiOnRydWUsImhvI * jpmYWxzZSwiaHQiOmZhbHNlLCJiIjpmYWxzZSwicCI6MC4xNzUsIm1kIjo2MCwiY20iOiJsYWIiLCJm * IjoiU2ltcGxleCBOb2lzZSIsImMiOiJoc2x1diJ9
 *
 * // '#A2CCB6',
 * // '#FCEEB5',
 * // '#EE786E',
 * // '#e0feff',
 * // 'lightpink',
 * // 'lightblue',
 */
