import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import Random from 'canvas-sketch-util/random';
import { lerp, mapRange } from 'canvas-sketch-util/math';
import { useMusicStore } from './useMusicStore';
import './SilkyMaterial';

//http://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/

export function Planet({ distortionScale }) {
  const planet = useRef();
  const { size } = useThree();

  const distortFactor = useMusicStore((state) => state.distortFactor);

  const melody = useRef(0);
  useEffect(
    () =>
      useMusicStore.subscribe(
        (value) => {
          melody.current = value;
        },
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
      planet.current.material.uniforms.u_music.value =
        distortionScale * melody.current;

      planet.current.material.uniforms.u_time.value = state.clock.elapsedTime;
      planet.current.material.uniforms.u_distort.value = distortFactor;

      const off = Random.noise1D(state.clock.elapsedTime, 0.25);

      const tOff = mapRange(off, -1, 1, 0, 1);
      planet.current.rotation.x = lerp(0.1, 0.8, tOff);
      planet.current.rotation.y = lerp(0.4, 1.2, tOff);
      planet.current.rotation.z = lerp(0.8, 1.6, tOff);
    }
  });

  return (
    <mesh ref={planet} scale={[10, 10, 10]}>
      <icosahedronBufferGeometry args={[1, 60]} />
      <silkyMaterial />
    </mesh>
  );
}
