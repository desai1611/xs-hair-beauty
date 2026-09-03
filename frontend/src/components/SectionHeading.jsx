export default function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`max-w-xl mb-13 ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-[28px] sm:text-4xl">{title}</h2>
      {subtitle && <p className="text-text-light mt-2">{subtitle}</p>}
    </div>
  );
}
