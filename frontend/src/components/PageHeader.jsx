// Page banner. With an `image` it sits on a photo (soft dark overlay, light text);
// without one it is a plain blush (or champagne when `gold`) panel.
export default function PageHeader({ eyebrow, title, subtitle, gold = false, image, imagePosition = '50% 50%' }) {
  const hasImage = Boolean(image);
  return (
    <section className="px-3 sm:px-5 pt-4">
      <div
        className="tile max-w-[1240px] mx-auto text-center px-6 py-16 sm:py-24"
        style={{ background: gold ? 'var(--color-lime)' : 'var(--color-pink-100)' }}
      >
        {hasImage && (
          <>
            <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: imagePosition }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(42,21,34,0.55) 0%, rgba(42,21,34,0.72) 100%)' }} />
          </>
        )}
        <div className="relative">
          <span className="eyebrow" style={{ background: hasImage ? 'rgba(255,255,255,0.92)' : 'var(--color-white)' }}>{eyebrow}</span>
          <h1 className={`text-[36px] sm:text-[58px] leading-[1.05] mb-4 max-w-3xl mx-auto ${hasImage ? '!text-white' : ''}`}>{title}</h1>
          <p className={`max-w-lg mx-auto text-[16px] sm:text-[17px] ${hasImage ? 'text-white/85' : 'text-plum-900/80'}`}>{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
