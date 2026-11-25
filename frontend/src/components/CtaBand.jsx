import { telLink, waLink } from '../config/salon';

export default function CtaBand({
  title = 'Ready to book your appointment?',
  subtitle = 'Message us on WhatsApp or call the salon directly to find a time that suits you.',
}) {
  return (
    <section className="pb-16 px-3 sm:px-5 mt-6">
      <div className="max-w-[1240px] mx-auto">
        <div className="tile px-7 sm:px-14 py-14 sm:py-16 text-center bg-plum-900">
          <h2 className="text-white text-[34px] sm:text-[52px] leading-[1.05] mb-4 max-w-2xl mx-auto">{title}</h2>
          <p className="text-white/75 max-w-lg mx-auto mb-8">{subtitle}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href={telLink()} className="btn btn-light">📞 Call the Salon</a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">💬 WhatsApp Us</a>
          </div>
        </div>
      </div>
    </section>
  );
}
