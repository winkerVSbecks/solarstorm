import React, {
  Suspense,
  useRef,
  useEffect,
  forwardRef,
  useState,
} from 'react';
import { useThree, useLoader, useFrame } from 'react-three-fiber';
import { AudioLoader, AudioListener, AudioAnalyser } from 'three';
import { mapRange } from 'canvas-sketch-util/math';
import create from 'zustand';

export const useMusicStore = create((set) => ({
  data: 0,
  setData: (data) =>
    set(() => {
      return { data: mapRange(data, 0, 255, 0, 1) };
    }),
}));

const url = '/XkZZDMkY5C1C.128.mp3';

/**
 * https://codesandbox.io/s/r3f-audo-analyser-38vb8?file=/src/App.js:642-647
 * https://threejs.org/docs/?q=audio#api/en/audio/AudioAnalyser
 */
function Analyzer({ sound }) {
  // <Analyzer /> will not run before everything else in the suspense block is resolved.
  // That means <Audio/>, which executes async, is ready by the time we're here.
  // The next frame (useEffect) is guaranteed(!) to access sound ref
  const analyser = useRef();
  const setData = useMusicStore((state) => state.setData);

  useFrame(() => {
    if (!analyser.current && sound.current) {
      analyser.current = new AudioAnalyser(sound.current, 32);
    }

    if (analyser.current) {
      const data = analyser.current.getAverageFrequency();
      setData(data);
    }
  });

  return null;
}

const Audio = forwardRef((props, ref) => {
  const { camera } = useThree();
  const [listener] = useState(() => new AudioListener());
  const buffer = useLoader(AudioLoader, url);

  useEffect(() => {
    const sound = ref.current;
    if (sound) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
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

export function Music() {
  // This component creates a suspense block, blocking execution until
  // all async tasks (in this case Audio) have been resolved.
  const sound = useRef();

  return (
    <Suspense fallback={null}>
      <Audio ref={sound} />
      <Analyzer sound={sound} />
    </Suspense>
  );
}
