import React, { Suspense, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import Random from 'canvas-sketch-util/random';
import { lerp, mapRange } from 'canvas-sketch-util/math';
import Text from './Text';

Random.setSeed('solar storm');

export function Number({ mouse }) {
  const ref = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  useFrame((state, delta) => {
    if (ref.current) {
      const off = Random.noise1D(
        state.clock.elapsedTime - state.clock.startTime,
        0.25
      );

      const tOff = mapRange(off, -1, 1, 0, 1);
      ref.current.rotation.x = lerp(0.1, 0.8, tOff);
      ref.current.rotation.y = lerp(0.4, 1.2, tOff);

      // ref.current.position.x = lerp(
      //   ref.current.position.x,
      //   mouse.current[0] / aspect / 10,
      //   0.1
      // );
      // ref.current.rotation.x = lerp(
      //   ref.current.rotation.x,
      //   0 + mouse.current[1] / aspect / 50,
      //   0.1
      // );
      // ref.current.rotation.y = 0.8;
    }
  });

  return (
    <Suspense fallback={null}>
      <group ref={ref}>
        <Text size={10}>4</Text>
      </group>
    </Suspense>
  );
}
