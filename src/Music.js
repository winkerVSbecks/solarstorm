import React, {
  Suspense,
  useRef,
  useEffect,
  forwardRef,
  useState,
} from 'react';
import { useThree, useLoader, useFrame } from '@react-three/fiber';
import { AudioLoader, AudioListener, AudioAnalyser } from 'three';
import { mapRange } from 'canvas-sketch-util/math';
import create from 'zustand';

// Maxes
// bass: 0.2485294117647059;
// drums: 0.628921568627451;
// melody: 0.6061274509803921;
// vocals: 0.6301470588235294;

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
      };
    }),
}));

/**
 * 0  - Start           - 0                 - planet + sparks + space ship
 * 25 - Melody kicks in - 0.213675213675214 - spark storm + camera shake
 * 32 - Vocals          - 0.273504273504274 - planet distortion kicks in
 * 51 - Scratch         - 0.435897435897436 - distort the spaceship
 * 57 - Beep            - 0.487179487179487 -
 * 71 - Drop beep       - 0.598290598290598 - planet distortion * 15
 */

const urls = {
  bass: '/quitters-raga/bass.wav',
  drums: '/quitters-raga/drums.wav',
  melody: '/quitters-raga/melody.wav',
  fullSong: '/quitters-raga/quitters-raga.mp3',
  vocals: '/quitters-raga/vocals.wav',
};

/**
 * https://codesandbox.io/s/r3f-audo-analyser-38vb8?file=/src/App.js:642-647
 * https://threejs.org/docs/?q=audio#api/en/audio/AudioAnalyser
 */
function Analyzer({ track, sound, trackProgress = false }) {
  // <Analyzer /> will not run before everything else in the suspense block is resolved.
  // That means <Audio/>, which executes async, is ready by the time we're here.
  // The next frame (useEffect) is guaranteed(!) to access sound ref
  const analyser = useRef();
  const setAudioData = useMusicStore((state) => state.setAudioData);
  const musicProgress = useMusicStore((state) => state.progress);
  const setProgress = useMusicStore((state) => state.setProgress);

  useFrame(() => {
    if (!analyser.current && sound.current) {
      analyser.current = new AudioAnalyser(sound.current, 32);
    }

    if (analyser.current) {
      const data = analyser.current.getAverageFrequency();
      setAudioData(track, data);

      if (trackProgress) {
        const progress =
          (Math.max(
            sound.current.context.currentTime - sound.current._startedAt,
            0
          ) *
            sound.current.playbackRate) /
          sound.current.buffer.duration;

        setProgress(progress);
      }
    }
  });

  return null;
}

const Audio = forwardRef(({ url, volume, ...props }, ref) => {
  const { camera } = useThree();
  const [listener] = useState(() => new AudioListener());
  const buffer = useLoader(AudioLoader, url);

  useEffect(() => {
    const sound = ref.current;
    if (sound) {
      sound.setBuffer(buffer);
      sound.setLoop(false);
      sound.setVolume(volume);
      sound.play();
    }

    return () => {
      if (sound) {
        sound.stop();
        sound.disconnect();
      }
    };
  }, [buffer, camera, listener]);

  return <audio ref={ref} args={[listener]} />;
});

export function AudioLayer({ track, trackProgress, quiet = false }) {
  const sound = useRef();

  return (
    <>
      <Audio ref={sound} url={urls[track]} volume={quiet ? 0 : 0.5} />
      <Analyzer track={track} sound={sound} trackProgress={trackProgress} />
    </>
  );
}

export function Music() {
  // This component creates a suspense block, blocking execution until
  // all async tasks (in this case Audio) have been resolved.
  const song = useRef();

  return (
    <Suspense fallback={null}>
      <AudioLayer track="bass" />
      <AudioLayer track="drums" />
      <AudioLayer track="melody" trackProgress />
      <AudioLayer track="vocals" />
    </Suspense>
  );
}
