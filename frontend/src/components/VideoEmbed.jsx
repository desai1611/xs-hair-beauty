import { useState } from 'react';
import { SALON } from '../config/salon';

function getYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// Shown when no video is set (or the video file can't be loaded): a photo with a play
// button that takes visitors to the salon's Instagram instead of an empty box.
function PosterTile({ poster, label }) {
  return (
    <a
      href={SALON.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-[32px] overflow-hidden aspect-video relative bg-plum-900"
      aria-label={`${label} — opens Instagram`}
    >
      {poster && <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover object-[50%_65%] group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(43,10,30,0.1) 0%, rgba(43,10,30,0.75) 100%)' }} />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-20 h-20 rounded-full bg-lime text-plum-900 border-2 border-plum-900 flex items-center justify-center text-2xl shadow-[4px_4px_0_var(--color-plum-900)] group-hover:scale-110 transition-transform">▶</span>
      </span>
      <span className="absolute left-5 bottom-5 sticker">{label}</span>
    </a>
  );
}

// Renders a YouTube embed, a direct video file (autoplays silently, loops, tap for
// sound), or a poster tile when no video is available.
export default function VideoEmbed({ url, poster, label = 'Watch our work on Instagram' }) {
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);

  if (!url || failed) return <PosterTile poster={poster} label={label} />;

  const youtubeId = getYouTubeId(url);

  if (youtubeId) {
    return (
      <div className="rounded-[32px] overflow-hidden aspect-video border-2 border-plum-900">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Salon video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="rounded-[32px] overflow-hidden aspect-video relative bg-plum-900 border-2 border-plum-900">
      <video
        className="w-full h-full object-cover"
        src={url}
        poster={poster}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
      />
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="absolute right-4 bottom-4 sticker cursor-pointer"
        aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      >
        {muted ? '🔇 Sound off' : '🔊 Sound on'}
      </button>
    </div>
  );
}
