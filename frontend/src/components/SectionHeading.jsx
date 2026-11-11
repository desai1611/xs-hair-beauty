export default function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`max-w-xl mb-12 ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-[32px] sm:text-[44px] leading-[1.05]">{title}</h2>
      {subtitle && <p className="text-text-light mt-3 text-[16px]">{subtitle}</p>}
    </div>
  );
}
