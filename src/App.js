import * as THREE from 'three';
import React, { useState, useCallback, useRef, Suspense } from 'react';
import { Canvas, extend } from '@react-three/fiber';

import './styles.css';
import * as meshline from './MeshLine';
import { Effects } from './Effects';
import { Music, MusicProvider } from './Music';
import { Scene } from './Scene';

extend(meshline);

export function App() {
  const [down, set] = useState(false);
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
      <Scene mouse={mouse} isMobile={isMobile} />
      <Effects down={down} />
    </Canvas>
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
