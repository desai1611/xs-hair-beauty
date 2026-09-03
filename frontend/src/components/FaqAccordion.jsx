import { useState } from 'react';

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q} className="border border-pink-100 rounded-[10px] mb-3.5 overflow-hidden bg-white">
            <button
              className="w-full text-left px-5.5 py-4.5 font-semibold text-[15px] text-plum-900 flex justify-between items-center gap-3"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
            >
              {item.q}
              <span className={`text-xl text-pink-600 flex-shrink-0 transition-transform duration-250 ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div
              className="px-5.5 overflow-hidden transition-[max-height] duration-300"
              style={{ maxHeight: isOpen ? '300px' : '0px' }}
            >
              <p className="text-sm text-text-light pb-4.5">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
