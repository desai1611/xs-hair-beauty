import { waLink, telLink } from '../config/salon';

export default function FloatingButtons() {
  return (
    <>
      <a
        href={waLink("Hi! I'd like to ask about your services.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6.5 right-6.5 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center text-2xl shadow-[0_8px_24px_rgba(37,211,102,0.45)] z-[200] hover:scale-108 transition-transform"
      >
        💬
      </a>
      <a
        href={telLink()}
        aria-label="Call the salon"
        className="call-float fixed bottom-6.5 left-6.5 w-12.5 h-12.5 rounded-full bg-white border-2 border-pink-500 text-pink-700 items-center justify-center text-xl shadow-mid z-[200]"
      >
        📞
      </a>
    </>
  );
}
