import { mapRange } from 'canvas-sketch-util/math';
import create from 'zustand';

// Max values
// bass: 0.2485294117647059;
// drums: 0.628921568627451;
// melody: 0.6061274509803921;
// vocals: 0.6301470588235294;

const glitchFactor = (progress) => {
  if (progress > 0.487179487179487 && progress < 0.495726495726496) {
    return 1;
  } else if (progress > 0.504273504273504 && progress < 0.52991452991453) {
    return 0.5;
  }

  return 0;
};

/**
 * 0  - Start           - 0                 - planet + sparks + space ship
 * 25 - Melody kicks in - 0.213675213675214 - spark storm + camera shake
 * 32 - Vocals          - 0.273504273504274 - planet distortion kicks in
 * 51 - Scratch         - 0.435897435897436 - distort the spaceship
 * 57 - Beep            - 0.487179487179487 -
 * 71 - Drop beep       - 0.598290598290598 - planet distortion * 15
 */

export const useMusicStore = create((set) => ({
  bass: 0,
  drums: 0,
  melody: 0,
  vocals: 0,
  setAudioData: (type, data) =>
    set(() => {
      return { [type]: mapRange(data, 0, 255, 0, 1) };
    }),
  progress: 0,
  sparkStorm: false,
  setProgress: (progress) =>
    set(() => {
      return {
        progress,
        sparkStorm: progress > 0.213675213675214 ? true : false,
        planetDistortion: progress > 0.273504273504274 ? true : false,
        spaceshipDistortion: progress > 0.435897435897436 ? true : false,
        beep: progress > 0.487179487179487 ? true : false,
        planetDistortionMax: progress > 0.598290598290598 ? true : false,
        glitchFactor: glitchFactor(progress),
      };
    }),
}));
