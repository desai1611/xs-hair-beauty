import { useId, useState } from 'react';

// Drag (or use arrow keys on) the handle to reveal the before and after photos.
// Without photos it shows coloured placeholders until real ones are uploaded.
export default function BeforeAfterSlider({ before, after, title }) {
  const [pos, setPos] = useState(50);
  const id = useId();

  const pane = (img, label, bg, fg) =>
    img ? (
      <img src={img} alt={`${title} — ${label.toLowerCase()}`} className="absolute inset-0 w-full h-full object-cover" draggable="false" />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center font-display text-[28px] font-semibold" style={{ background: bg, color: fg }}>
        {label}
      </div>
    );

  return (
    <div className="relative aspect-[4/5] sm:aspect-[4/3] select-none overflow-hidden">
      {pane(after, 'After', 'var(--color-pink-500)', 'var(--color-plum-900)')}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {pane(before, 'Before', 'var(--color-plum-800)', '#fff')}
      </div>

      <span className="absolute top-3 left-3 sticker !text-[11px]">Before</span>
      <span className="absolute top-3 right-3 sticker !text-[11px]" style={{ transform: 'rotate(3deg)' }}>After</span>

      <div className="absolute inset-y-0 w-0.5 bg-white pointer-events-none" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-plum-900 flex items-center justify-center text-plum-900 text-sm font-bold shadow-[3px_3px_0_var(--color-plum-900)]">
          ↔
        </span>
      </div>

      <label htmlFor={id} className="sr-only">Slide to compare before and after</label>
      <input
        id={id}
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
      />
    </div>
  );
}
