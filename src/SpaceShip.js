import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import {
  createAttractor,
  updateAttractor,
  lorenzMod2Attractor,
} from './attractor';

const RADIUS = 20;
let nextPosition;

export function SpaceShip(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  );

  const line = useRef(0);

  const [positions, currentPosition] = useMemo(
    () => createAttractor(30, [0, RADIUS, 0]),
    []
  );

  useFrame(() => {
    if (line.current) {
      const target = updateAttractor(
        currentPosition,
        RADIUS,
        lorenzMod2Attractor,
        0.002
      );

      if (nextPosition) {
        group.current.position.copy(
          nextPosition.clone().add(new THREE.Vector3(0, 0, 0))
        );
        group.current.lookAt(target);

        line.current.advance(nextPosition);
      }

      nextPosition = target;
    }
  });

  return (
    <>
      <group ref={group} scale={[1, 1, 1]} {...props} dispose={null}>
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
        <meshLine ref={line} attach="geometry" points={positions} />
        <meshLineMaterial
          attach="material"
          lineWidth={0.25}
          color="#FCEEB5"
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(
  'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);
