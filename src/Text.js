import * as THREE from 'three'
import React, { forwardRef, useMemo } from 'react'
import { useLoader, useUpdate } from 'react-three-fiber'

const Text = forwardRef(({ children, vAlign = 'center', hAlign = 'center', size = 1, color = '#000000', ...props }, ref) => {
  const font = useLoader(THREE.FontLoader, '/bold.blob')
  const config = useMemo(() => ({ font, size: 40, height: 50 }), [font])
  const mesh = useUpdate(
    (self) => {
      const size = new THREE.Vector3()
      self.geometry.computeBoundingBox()
      self.geometry.boundingBox.getSize(size)
      self.position.x = hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x
      self.position.y = vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y
    },
    [children]
  )
  return (
    <group ref={ref} {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry args={[children, config]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  )
})

export default Text
