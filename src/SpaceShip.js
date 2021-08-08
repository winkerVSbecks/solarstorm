import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useMusicStore } from './Music';

const RADIUS = 15;
let progress = 0;

export function SpaceShip(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  );

  const curve = useMemo(() => {
    const points = new Array(30).fill().map((_, index) => {
      const psi = (index / 20) * Math.PI * 2;
      const theta = Math.sin((index / 20) * Math.PI) * Math.PI;

      return new THREE.Vector3(
        Math.cos(psi) * Math.sin(theta) * RADIUS,
        Math.sin(psi) * Math.sin(theta) * RADIUS,
        Math.cos(theta) * RADIUS
      );
    });

    return new THREE.CatmullRomCurve3(points);
  }, []);

  const musicProgressRef = useRef(0);

  useEffect(
    () =>
      useMusicStore.subscribe(
        (progress) => (musicProgressRef.current = progress),
        (state) => state.progress
      ),
    []
  );

  useFrame(() => {
    if (group.current) {
      progress += 0.001;
      if (progress > 1) {
        progress = 0;
      }

      const position = curve.getPointAt(
        progress /* musicProgressRef.current */
      );
      const rotation = curve.getTangentAt(
        progress /* musicProgressRef.current */
      );

      var target = curve.getPoint(Math.max(0, progress - 0.001));

      group.current.position.copy(position);
      group.current.lookAt(target);
      // group.current.rotation.copy(rotation);
    }
  });

  return (
    <>
      <group
        ref={group}
        scale={[1, 1, 1]}
        // position={[0, 15, 0]}
        {...props}
        dispose={null}>
        <mesh geometry={nodes.Cube005.geometry} material={materials.Mat0} />
        <mesh geometry={nodes.Cube005_1.geometry} material={materials.Mat1} />
        <mesh geometry={nodes.Cube005_2.geometry} material={materials.Mat2} />
        <mesh
          geometry={nodes.Cube005_3.geometry}
          material={materials.Window_Frame}
        />
        <mesh geometry={nodes.Cube005_4.geometry} material={materials.Mat4} />
        <mesh geometry={nodes.Cube005_5.geometry} material={materials.Mat3} />
        <mesh geometry={nodes.Cube005_6.geometry} material={materials.Window} />
      </group>
      <mesh>
        <meshLine attach="geometry" points={curve.getPoints(1000)} />
        <meshLineMaterial attach="material" lineWidth={0.25} color="#0f0" />
      </mesh>
    </>
  );
}

useGLTF.preload(
  'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);
