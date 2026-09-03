import { waLink } from '../config/salon';

export default function ProductCard({ product }) {
  return (
    <div className="card text-left pb-6.5">
      <div className="h-[170px] flex items-center justify-center text-white text-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-pink-300), var(--color-plum-900))' }}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span>🧴</span>
        )}
      </div>
      <div className="px-6 pt-5.5">
        <span className="text-[11px] uppercase tracking-wide text-pink-600 font-semibold">{product.category}</span>
        <h3 className="text-[18px] mt-1 mb-2">{product.name}</h3>
        <p className="text-sm text-text-light mb-3.5">{product.description}</p>
      </div>
      <div className="flex justify-between items-center pt-3.5 mx-6 border-t border-dashed border-pink-200">
        <span className="font-display font-bold text-[16px] text-pink-700">
          ${product.price.toFixed(2)} <small className="font-sans text-[11px] text-text-light font-normal">NZD</small>
        </span>
        {product.inStock ? (
          <a
            href={waLink(`Hi! I'd like to purchase: ${product.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            Enquire
          </a>
        ) : (
          <span className="text-[12px] text-text-light font-semibold">Out of stock</span>
        )}
      </div>
    </div>
  );
}
