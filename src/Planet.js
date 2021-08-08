import React, { Suspense, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import Random from 'canvas-sketch-util/random';
import { lerp, mapRange } from 'canvas-sketch-util/math';
import { useMusicStore } from './Music';
import './SilkyMaterial';

//http://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/

export function Planet({ distortionScale }) {
  const planet = useRef();
  const { size } = useThree();

  const musicMelodyRef = useRef(0);

  useEffect(
    () =>
      useMusicStore.subscribe(
        (melody) => (musicMelodyRef.current = melody),
        (state) => state.melody
      ),
    []
  );

  useFrame((state) => {
    if (planet.current) {
      planet.current.material.uniforms.u_resolution.value = [
        size.width,
        size.height,
      ];
      planet.current.material.uniforms.u_time.value =
        distortionScale * musicMelodyRef.current; // 5 - 10 -15

      const off = Random.noise1D(state.clock.elapsedTime, 0.25);

      const tOff = mapRange(off, -1, 1, 0, 1);
      planet.current.rotation.x = lerp(0.1, 0.8, tOff);
      planet.current.rotation.y = lerp(0.4, 1.2, tOff);
      planet.current.rotation.z = lerp(0.8, 1.6, tOff);
    }
  });

  return (
    <Suspense fallback={null}>
      <mesh ref={planet} scale={[10, 10, 10]}>
        <icosahedronBufferGeometry attach="geometry" args={[1, 60]} />
        {/* <icosahedronBufferGeometry attach="geometry" args={[1, 4]} /> */}
        <silkyMaterial flatShading attach="material" />
      </mesh>
    </Suspense>
  );
}
