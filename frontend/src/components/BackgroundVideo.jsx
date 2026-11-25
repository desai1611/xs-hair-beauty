import { useEffect, useRef, useState } from 'react';

// One looping video that plays behind every page of the website (the page sits in front of it).
//
// The clip is  frontend/public/videos/hair-art-background.mp4 . To change it, replace that file
// with another short, muted landscape clip (about 7-15 seconds, ideally under 5 MB).
//
// Framing: the whole picture is shown (not cropped in), so nothing looks zoomed.
//
// Kind to visitors:
//  - starts only after the page has loaded, so it never slows the first view
//  - pauses when the tab is hidden
//  - shows nothing but the plain background when the visitor prefers reduced motion or has
//    data-saver on
const VIDEO_SRC = '/videos/hair-art-background.mp4';

export default function BackgroundVideo() {
  const videoRef = useRef(null);
  const [play, setPlay] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reduced = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    if (reduced || saveData) return undefined;
    if (document.readyState === 'complete') {
      setPlay(true);
      return undefined;
    }
    const onLoad = () => setPlay(true);
    window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const onVisibility = () => {
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [play]);

  return (
    <div className="bg-video" aria-hidden="true">
      {play && !failed && (
        <video
          ref={videoRef}
          className="bg-video__clip"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          onError={() => setFailed(true)}
        />
      )}
      <div className="bg-video__veil" />
    </div>
  );
}
