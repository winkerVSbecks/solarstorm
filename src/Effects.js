import * as THREE from 'three';
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { mapRange } from 'canvas-sketch-util/math';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { GlitchPass } from './post/Glitchpass';
import { WaterPass } from './post/Waterpass';
import { useMusicStore } from './useMusicStore';

extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  WaterPass,
  UnrealBloomPass,
  FilmPass,
  GlitchPass,
});

export function Effects() {
  const composer = useRef();
  const bloomPass = useRef();

  const { scene, gl, size, camera } = useThree();
  const aspect = useMemo(() => new THREE.Vector2(512, 512), []);

  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  );

  const bass = useRef(0);
  const glitchFactor = useMusicStore((state) => state.glitchFactor);

  useEffect(
    () =>
      useMusicStore.subscribe((state) => {
        bass.current = state.bass;
      }),
    []
  );

  useFrame(() => {
    if (bloomPass.current && bass.current) {
      bloomPass.current.strength = mapRange(
        bass.current,
        0,
        0.25,
        1.75,
        2.5,
        true
      );
    }

    composer.current.render();
  }, 1);

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      {/* <waterPass attachArray="passes" factor={distortFactor} /> */}
      <unrealBloomPass
        ref={bloomPass}
        attachArray="passes"
        args={[aspect, 2, 1, 0]}
      />
      <filmPass attachArray="passes" args={[aspect, 2, 1, 0]} />
      <glitchPass glitchPass attachArray="passes" factor={glitchFactor} />
    </effectComposer>
  );
}
