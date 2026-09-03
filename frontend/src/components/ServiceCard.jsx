import { Link } from 'react-router-dom';

export default function ServiceCard({ service, premium = false }) {
  const gradient = premium
    ? 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))'
    : 'linear-gradient(135deg, var(--color-pink-200), var(--color-pink-500))';

  return (
    <div className="card text-left pb-6.5">
      <div className="h-[170px] flex items-center justify-center text-white text-3xl overflow-hidden" style={{ background: gradient }}>
        {service.image ? (
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
        ) : (
          <span>✨</span>
        )}
      </div>
      <div className="px-6 pt-5.5">
        <h3 className="text-[19px] mb-2">{service.name}</h3>
        <p className="text-sm text-text-light mb-3.5">{service.description}</p>
      </div>
      <div className="flex justify-between items-center pt-3.5 mx-6 border-t border-dashed border-pink-200">
        <span className="font-display font-bold text-[16px] text-pink-700">
          {service.price != null ? (
            <>
              {service.priceNote || 'From'} ${service.price} <small className="font-sans text-[11px] text-text-light font-normal">NZD</small>
            </>
          ) : (
            <span className="text-sm font-sans font-semibold">Price on consultation</span>
          )}
        </span>
        <Link to="/contact#booking-form" className="btn btn-outline btn-sm">Book</Link>
      </div>
    </div>
  );
}
