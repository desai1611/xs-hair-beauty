import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import ProductCard from '../components/ProductCard';
import Loader, { ErrorMessage } from '../components/Loader';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';

export default function Products() {
  const { data: products, loading, error } = useFetch('/products');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...new Set((products || []).map((p) => p.category))];
  const filtered = (products || []).filter(
    (p) => (category === 'all' || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Hair Care & Beauty Products"
        subtitle="Salon-quality products to keep your results looking fresh at home. Message us on WhatsApp to purchase or check availability."
      />

      <section className="py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-11">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full sm:w-80 rounded-full px-4.5 py-3.5 border-[1.5px] border-pink-200 bg-pink-50 text-sm outline-none focus:border-pink-500"
            />
            <div className="flex gap-2.5 flex-wrap justify-center">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-5 py-2.5 rounded-full border-[1.5px] text-[13.5px] font-semibold capitalize transition-colors ${
                    category === c ? 'bg-pink-600 border-pink-600 text-white' : 'bg-white border-pink-200 hover:border-pink-500'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading && <Loader label="Loading products..." />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
              {filtered.length === 0 && <p className="col-span-full text-center text-text-light">No products match your search yet — check back soon.</p>}
            </div>
          )}
        </div>
      </section>

      <CtaBand title="Want product recommendations?" subtitle="Tell us about your hair and skin goals and we'll suggest the right products for you." />
    </>
  );
}
