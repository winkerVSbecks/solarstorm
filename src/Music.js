import React, {
  Suspense,
  useRef,
  useEffect,
  forwardRef,
  useState,
} from 'react';
import { useThree, useLoader, useFrame } from '@react-three/fiber';
import { AudioLoader, AudioListener, AudioAnalyser } from 'three';
import { useMusicStore } from './useMusicStore';

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

  return <audio ref={ref} args={[listener]} {...props} />;
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
