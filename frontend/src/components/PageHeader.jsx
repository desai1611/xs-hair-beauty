export default function PageHeader({ eyebrow, title, subtitle, gold = false }) {
  return (
    <section
      className="text-center px-6 py-16 sm:py-20"
      style={{
        background: gold
          ? 'linear-gradient(180deg, var(--color-gold-light), var(--color-white))'
          : 'linear-gradient(180deg, var(--color-pink-50), var(--color-white))',
        borderBottom: '1px solid var(--color-pink-100)',
      }}
    >
      <div className="max-w-[1180px] mx-auto">
        <span className="eyebrow" style={gold ? { color: 'var(--color-gold)' } : undefined}>{eyebrow}</span>
        <h1 className="text-[32px] sm:text-5xl mb-3">{title}</h1>
        <p className="max-w-lg mx-auto text-text-light">{subtitle}</p>
      </div>
    </section>
  );
}
