import { useEffect, useRef, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { SALON, waLink, telLink } from '../config/salon';

const DEFAULT_HOURS = 'Tuesday–Saturday 9:30 AM–6:00 PM, Sunday 10:00 AM–6:00 PM, Monday closed.';

function buildKnowledgeBase(hoursText) {
  return [
    {
      keywords: ['hour', 'open', 'close', 'time', 'when'],
      answer: `Our opening hours are:\n${hoursText}`,
    },
    {
      keywords: ['where', 'address', 'location', 'located', 'direction', 'park'],
      answer: `We're located at ${SALON.address}. Tap "Get Directions" on our Contact page for turn-by-turn directions.`,
    },
    {
      keywords: ['book', 'appointment', 'schedule', 'reserve'],
      answer: `You can book in two ways: fill out the booking form on our Contact page, or message us directly on WhatsApp — whichever's easier for you!`,
    },
    {
      keywords: ['phone', 'call', 'number', 'contact'],
      answer: `You can call or WhatsApp us at ${SALON.phoneDisplay}.`,
    },
    {
      keywords: ['price', 'cost', 'how much', 'charge', 'fee'],
      answer: `Pricing varies by service — check the Hair Services, Beauty Services, or Advanced Beauty pages for our price list, or message us on WhatsApp for a quick quote.`,
    },
    {
      keywords: ['hair', 'cut', 'colour', 'color', 'keratin', 'balayage', 'highlight'],
      answer: `We offer haircuts, colouring, highlights, keratin smoothing, and nanoplastia treatments. Check out our Hair Services page for the full list and pricing.`,
    },
    {
      keywords: ['beauty', 'thread', 'wax', 'facial', 'eyebrow', 'brow'],
      answer: `Our Beauty Services include eyebrow & facial threading, waxing, and facials. See the Beauty Services page for details.`,
    },
    {
      keywords: ['bridal', 'wedding', 'bride'],
      answer: `We'd love to be part of your big day! Our Bridal Package includes hair styling & trial, a pre-wedding glow facial, and bridal party grooming. Check the Advanced Beauty page or message us to enquire.`,
    },
    {
      keywords: ['party', 'birthday', 'event', 'occasion'],
      answer: `Our Party Package covers event hair styling, an express glow facial, and brow/face threading touch-ups — perfect for birthdays and celebrations. See the Advanced Beauty page for more.`,
    },
    {
      keywords: ['product', 'shop', 'buy', 'shampoo', 'conditioner'],
      answer: `We sell hair care & styling products in-salon — check out the Products page and message us on WhatsApp to purchase or check availability.`,
    },
    {
      keywords: ['review', 'rating', 'testimonial'],
      answer: `We're rated highly by our clients! Check out the Reviews page to read what people are saying and see real before & after results.`,
    },
    {
      keywords: ['cancel', 'reschedule', 'change appointment'],
      answer: `No problem — just message or call us at ${SALON.phoneDisplay} and we'll help you reschedule.`,
    },
  ];
}

const SUGGESTED_QUESTIONS = [
  'What are your opening hours?',
  'Where are you located?',
  'How do I book an appointment?',
  'Do you do bridal packages?',
];

function findAnswer(question, knowledgeBase) {
  const q = question.toLowerCase();
  let best = null;
  let bestScore = 0;
  knowledgeBase.forEach((entry) => {
    const score = entry.keywords.filter((kw) => q.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  });
  return best?.answer || null;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hi! I'm the XS Hair & Beauty assistant. Ask me about our hours, services, location, or how to book — or tap a question below.",
    },
  ]);
  const { data: siteContent } = useFetch('/site-content');
  const scrollRef = useRef(null);

  const hoursText = siteContent?.opening_hours?.value
    ? siteContent.opening_hours.value.split('\n').join(', ')
    : DEFAULT_HOURS;
  const knowledgeBase = buildKnowledgeBase(hoursText);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  function ask(text) {
    if (!text.trim()) return;
    const answer = findAnswer(text, knowledgeBase);
    setMessages((m) => [
      ...m,
      { from: 'user', text },
      {
        from: 'bot',
        text:
          answer ||
          `I'm not totally sure about that — message us on WhatsApp or call ${SALON.phoneDisplay} and our team will help right away!`,
        fallback: !answer,
      },
    ]);
    setInput('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    ask(input);
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-[9.5rem] right-6.5 z-[210] w-[min(360px,calc(100vw-2rem))] h-[min(480px,calc(100vh-11rem))] bg-white rounded-2xl shadow-lg border border-pink-100 flex flex-col overflow-hidden">
          <div className="px-5 py-4 text-white flex items-center justify-between flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-pink-500), var(--color-pink-700))' }}>
            <div>
              <strong className="block text-sm">XS Hair &amp; Beauty Assistant</strong>
              <span className="text-[11px] opacity-85">Usually replies instantly</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white/90 hover:text-white text-lg leading-none px-1">✕</button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-pink-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] whitespace-pre-line ${
                    m.from === 'user' ? 'bg-pink-600 text-white rounded-br-sm' : 'bg-white text-text border border-pink-100 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                  {m.fallback && (
                    <div className="flex gap-2 mt-2">
                      <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-sm !px-3 !py-1.5 !text-[11px]">WhatsApp</a>
                      <a href={telLink()} className="btn btn-outline btn-sm !px-3 !py-1.5 !text-[11px]">Call</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 pt-3 pb-2 flex flex-wrap gap-1.5 bg-white border-t border-pink-100">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="text-[11px] px-2.5 py-1.5 rounded-full border border-pink-200 text-pink-700 hover:bg-pink-50 whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="px-4 pb-4 pt-1 flex gap-2 bg-white flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question..."
              className="flex-1 rounded-full px-3.5 py-2.5 text-[13px] border-[1.5px] border-pink-200 bg-pink-50 outline-none focus:border-pink-500"
            />
            <button type="submit" className="btn btn-primary btn-sm !px-4">Send</button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
        className="fixed bottom-[5.75rem] right-6.5 w-14 h-14 rounded-full text-white flex items-center justify-center text-2xl shadow-mid z-[210] hover:scale-108 transition-transform"
        style={{ background: 'linear-gradient(135deg, var(--color-pink-500), var(--color-pink-700))' }}
      >
        {open ? '✕' : '💁‍♀️'}
      </button>
    </>
  );
}
