function getYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// Renders a YouTube embed, a direct video file, or a placeholder if no url is set.
export default function VideoEmbed({ url, placeholderLabel = 'Promo video placeholder' }) {
  if (!url) {
    return (
      <div
        className="rounded-3xl overflow-hidden aspect-video relative flex items-center justify-center shadow-mid"
        style={{ background: 'linear-gradient(150deg, var(--color-plum-900), var(--color-pink-700))' }}
      >
        <div className="w-18.5 h-18.5 rounded-full bg-white/92 text-pink-700 flex items-center justify-center text-2xl shadow-mid">▶</div>
        <span className="absolute bottom-4.5 left-5.5 text-white text-[13px] tracking-wide">{placeholderLabel}</span>
      </div>
    );
  }

  const youtubeId = getYouTubeId(url);

  if (youtubeId) {
    return (
      <div className="rounded-3xl overflow-hidden aspect-video shadow-mid">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Promo video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden aspect-video shadow-mid bg-plum-900">
      <video className="w-full h-full" src={url} controls />
    </div>
  );
}
