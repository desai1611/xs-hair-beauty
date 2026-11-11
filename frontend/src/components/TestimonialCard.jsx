export default function TestimonialCard({ review }) {
  const initial = review.name?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className="card text-left px-7 py-7.5">
      <span className="block text-gold text-[15px] tracking-widest mb-3.5">
        {'★'.repeat(review.rating)}
        {'☆'.repeat(5 - review.rating)}
      </span>
      <p className="font-display text-text text-[17px] leading-snug mb-5">"{review.quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10.5 h-10.5 rounded-full flex items-center justify-center text-plum-900 font-bold text-[15px] flex-shrink-0 border-2 border-plum-900"
          style={{ background: 'var(--color-pink-500)' }}>
          {initial}
        </div>
        <div>
          <strong className="block text-sm">{review.name}</strong>
          <span className="text-xs text-text-light">{review.serviceLabel}</span>
        </div>
      </div>
    </div>
  );
}
