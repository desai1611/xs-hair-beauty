export default function PageHeader({ eyebrow, title, subtitle, gold = false }) {
  return (
    <section className="px-3 sm:px-5 pt-4">
      <div
        className="tile max-w-[1240px] mx-auto text-center px-6 py-14 sm:py-20"
        style={{ background: gold ? 'var(--color-lime)' : 'var(--color-pink-500)' }}
      >
        <span className="eyebrow" style={{ background: 'var(--color-white)' }}>{eyebrow}</span>
        <h1 className="text-[36px] sm:text-[58px] leading-[1.02] mb-4 max-w-3xl mx-auto">{title}</h1>
        <p className="max-w-lg mx-auto text-plum-900/80 text-[16px] sm:text-[17px]">{subtitle}</p>
      </div>
    </section>
  );
}
