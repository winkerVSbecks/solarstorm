import { ShaderMaterial, Color } from 'three';
import { extend } from 'react-three-fiber';
import glsl from 'babel-plugin-glsl/macro';

export default class SilkyMaterial extends ShaderMaterial {
  constructor(options) {
    super({
      clipping: true,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: [800, 800] },
        u_scale: { value: 1 },
        u_background: { value: new Color('#600935') },
        u_foreground: { value: new Color('#de77c7') },
      },
      vertexShader: glsl/*glsl*/ `
        precision highp float;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vOutput;

        uniform float u_time;
        uniform float u_scale;
        uniform vec3 u_background;

        #pragma glslify: noise = require(glsl-noise/simplex/4d);

        const int AMOUNT = 4;

        float loopNoise (vec3 v, float t, float scale, float offset) {
          float duration = scale;
          float current = t * scale;
          return ((duration - current) * noise(vec4(v, current + offset)) + current * noise(vec4(v, current - duration + offset))) / duration;
        }

        void main () {
          vPosition = position;

          vec2 coord = 20.0 * vUv;

          vec3 p = vPosition * 1.0;
          float v = 0.0;
          float amp = 0.5;
          v += loopNoise(p, u_time, 1.0, 60.0) * amp;

          float len;

          for (int i = 0; i < AMOUNT; i++) {
            len = length(vec2(coord.x, coord.y));
            coord.x = coord.x - cos(coord.y + sin(len)) + cos(u_time / 9.0);
            coord.y = coord.y + sin(coord.x + cos(len)) + sin(u_time / 12.0);
          }

          len += v * u_scale;
          vec3 displacement = vec3(1.0 + cos(len), 1.0 + cos(len), 1.0 + cos(len));
          // vec3 displacement = mix(u_background, vec3(0.5, 0.5, 0.5), cos(len));

          // float displacement = noise(vec4(position, u_time));
          vOutput = len;
          vec3 newPosition = position + normal * displacement * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

          // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          // vUv = uv;
          vUv = position.xy * 0.5 + 0.5;
        }`,
      fragmentShader: glsl/* glsl */ `
        precision highp float;

        #pragma glslify: noise = require(glsl-noise/simplex/4d);
        #pragma glslify: grain = require(glsl-film-grain);
        #pragma glslify: blend = require('glsl-blend-soft-light');
        // #define gold vec3(1.0, 0.843, 0.0)

        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_scale;
        uniform vec3 u_background;
        uniform vec3 u_foreground;

        varying vec3 vPosition;
        varying vec2 vUv;
        varying float vOutput;

        const int AMOUNT = 4;

        float loopNoise (vec3 v, float t, float scale, float offset) {
          float duration = scale;
          float current = t * scale;
          return ((duration - current) * noise(vec4(v, current + offset)) + current * noise(vec4(v, current - duration + offset))) / duration;
        }

        void main(){
          vec2 coord = 20.0 * vUv;

          vec3 p = vPosition * 1.0;
          float v = 0.0;
          float amp = 0.5;
          v = loopNoise(p, u_time, 1.0, 60.0) * amp;

          float len;

          for (int i = 0; i < AMOUNT; i++){
            len = length(vec2(coord.x, coord.y));
            coord.x = coord.x - cos(coord.y + sin(len)) + cos(u_time / 9.0);
            coord.y = coord.y + sin(coord.x + cos(len)) + sin(u_time / 12.0);
          }

          len += v * u_scale;
          // vec3 color = vec3(cos(len), cos(len), cos(len));
          // vec3 color = mix(u_background, vec3(0.5, 0.5, 0.5), cos(len));
          vec3 color = mix(u_background,  vec3(0.25, 0.25, 0.25), cos(vOutput));

          // float grainSize = 1.0;
          // float g = grain(vUv, u_resolution / grainSize);
          // vec3 noiseColor = blend(vec3(g), u_foreground);
          // color = blend(color, noiseColor);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }
}

extend({ SilkyMaterial });
