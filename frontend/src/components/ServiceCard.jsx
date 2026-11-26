import { useState } from 'react';
import { SALON } from '../config/salon';

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default function ServiceCard({ service, premium = false }) {
  const [open, setOpen] = useState(false);
  const gradient = premium ? 'var(--color-lime)' : 'var(--color-pink-200)';
  const isLong = (service.description || '').length > 150;

  return (
    <div className="card text-left pb-6.5">
      <div className="relative h-[170px] flex items-center justify-center text-plum-900 text-4xl overflow-hidden" style={{ background: gradient }}>
        {service.image ? (
          <img src={service.image} alt={service.name} className="w-full h-full object-cover object-[50%_35%]" loading="lazy" />
        ) : (
          <span>✨</span>
        )}
        {service.isPopular && <span className="sticker absolute left-3 top-3">★ Most popular</span>}
      </div>
      <div className="px-6 pt-5.5">
        <h3 className="text-[21px] mb-2">{service.name}</h3>
        {service.duration && (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-plum-900/65 mb-2.5">
            <ClockIcon /> Takes {service.duration}
          </span>
        )}
        <p className={`text-sm text-text-light ${isLong ? 'mb-1.5' : 'mb-3.5'} ${open ? '' : 'line-clamp-4'}`}>{service.description}</p>
        {isLong && (
          <button type="button" onClick={() => setOpen((o) => !o)} className="text-[12px] font-bold text-pink-700 underline mb-3 cursor-pointer" aria-expanded={open}>
            {open ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      <div className="flex justify-between items-center pt-3.5 mx-6 border-t-2 border-dashed border-plum-900/15">
        <span className="font-display font-bold text-[16px] text-pink-700">
          {service.price === 0 ? (
            <span>Free</span>
          ) : service.price != null ? (
            <>
              {service.priceNote || 'From'} ${service.price} <small className="font-sans text-[11px] text-text-light font-normal">NZD</small>
            </>
          ) : (
            <span className="text-sm font-sans font-semibold">Price on consultation</span>
          )}
        </span>
        <a href={SALON.booking} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">Book</a>
      </div>
    </div>
  );
}
