import { waLink, telLink } from '../config/salon';

export default function FloatingButtons() {
  return (
    <>
      <a
        href={waLink("Hi! I'd like to ask about your services.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-5 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center text-2xl border-2 border-plum-900 shadow-[3px_3px_0_var(--color-plum-900)] z-[200] hover:-translate-y-0.5 transition-transform"
      >
        💬
      </a>
      <a
        href={telLink()}
        aria-label="Call the salon"
        className="call-float fixed bottom-6 left-5 w-12 h-12 rounded-full bg-lime text-plum-900 items-center justify-center text-xl border-2 border-plum-900 shadow-[3px_3px_0_var(--color-plum-900)] z-[200]"
      >
        📞
      </a>
    </>
  );
}
