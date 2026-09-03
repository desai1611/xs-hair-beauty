import { telLink, waLink } from '../config/salon';

export default function CtaBand({
  title = 'Ready to book your appointment?',
  subtitle = 'Message us on WhatsApp or call the salon directly to find a time that suits you.',
  gold = false,
}) {
  return (
    <section className="pb-20 px-6">
      <div className="max-w-[1180px] mx-auto">
        <div
          className="rounded-3xl px-9 py-13 text-center text-white shadow-lg"
          style={{
            background: gold
              ? 'linear-gradient(135deg, var(--color-gold), var(--color-plum-900))'
              : 'linear-gradient(135deg, var(--color-pink-600), var(--color-plum-900))',
          }}
        >
          <h2 className="text-white text-3xl mb-3">{title}</h2>
          <p className="text-white/85 max-w-lg mx-auto mb-7">{subtitle}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href={telLink()} className="btn btn-light">📞 Call the Salon</a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">💬 WhatsApp Us</a>
          </div>
        </div>
      </div>
    </section>
  );
}
