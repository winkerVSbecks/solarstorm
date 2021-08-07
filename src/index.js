import * as THREE from 'three';
import ReactDOM from 'react-dom';
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  Suspense,
} from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import './styles.css';
import { Effects } from './Effects';
import { Sparks } from './Sparks';
import { Sand } from './Sand';
import { Particles } from './Particles';
import { Number } from './Number';
import { Planet } from './Planet';
import { Music, MusicProvider } from './Music';

extend({ OrbitControls });
const Controls = (props) => {
  const { gl, camera } = useThree();
  const ref = useRef();
  useFrame(() => ref.current.update());
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

function App() {
  const [hovered, hover] = useState(false);
  const [down, set] = useState(false);
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    document.body.style.cursor = hovered
      ? 'pointer'
      : "url('https://raw.githubusercontent.com/chenglou/react-motion/master/demos/demo8-draggable-list/cursor.png') 39 39, auto";
  }, [hovered]);

  return (
    <Canvas
      pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
      camera={{ fov: 100, position: [0, 0, 35] }}
      onMouseMove={onMouseMove}
      onMouseUp={() => set(false)}
      onMouseDown={() => set(true)}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color('#020207'));
      }}>
      <Music />
      <axesHelper />
      <Controls />
      <fog attach="fog" args={['white', 50, 190]} />
      <pointLight distance={100} intensity={4} color="white" />
      {/* comet */}
      <Planet mouse={mouse} hover={hover} />
      <Particles count={isMobile ? 5000 : 10000} mouse={mouse} />
      <Sand
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
      <Effects down={down} />
    </Canvas>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

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
