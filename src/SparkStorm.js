import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import Random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import {
  createAttractor,
  updateAttractor,
  dadrasAttractor,
  aizawaAttractor,
  arneodoAttractor,
  dequanAttractor,
  lorenzAttractor,
  lorenzMod2Attractor,
} from './attractor';

const simulation = () =>
  Random.pick([
    dadrasAttractor,
    aizawaAttractor,
    arneodoAttractor,
    dequanAttractor,
    lorenzAttractor,
    lorenzMod2Attractor,
  ]);

function Fatline({ radius, simulation, width, color }) {
  const line = useRef();

  useFrame(() => {
    if (line.current) {
      const nextPosition = updateAttractor(
        currentPosition,
        radius,
        simulation,
        0.005
      );

      line.current.advance(nextPosition);
    }
  });

  const [positions, currentPosition] = useMemo(() => createAttractor(5), []);

  return (
    <mesh>
      <meshLine ref={line} attach="geometry" points={positions} />
      <meshLineMaterial
        attach="material"
        transparent
        lineWidth={width}
        color={color}
      />
    </mesh>
  );
}

export function SparkStorm({ mouse, count, colors, radius = 10 }) {
  const lines = useMemo(
    () =>
      new Array(count).fill().map(() => {
        return {
          color: Random.pick(colors),
          width: Random.range(0.1, 0.2),
          speed: Random.range(0.001, 0.002),
          simulation: simulation(),
          radius: Random.range(2, 2.25) * radius,
        };
      }),
    [count]
  );

  const ref = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = lerp(
        ref.current.rotation.x,
        0 + mouse.current[1] / aspect / 200,
        0.1
      );
      ref.current.rotation.y = lerp(
        ref.current.rotation.y,
        0 + mouse.current[0] / aspect / 400,
        0.1
      );
    }
  });

  return (
    <group ref={ref}>
      <group>
        {lines.map((props, index) => (
          <Fatline key={index} {...props} />
        ))}
      </group>
    </group>
  );
}
