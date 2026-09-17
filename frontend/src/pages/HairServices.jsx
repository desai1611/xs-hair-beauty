import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import ServiceCard from '../components/ServiceCard';
import FaqAccordion from '../components/FaqAccordion';
import Loader, { ErrorMessage } from '../components/Loader';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';
import VideoEmbed from '../components/VideoEmbed';

const filters = ['all', 'colour', 'cuts', 'treatments'];

const faqs = [
  { q: 'How long does a full colour service take?', a: "A full colour service typically takes 2–3 hours depending on hair length and the result you're after. We'll confirm timing at your consultation." },
  { q: 'Do I need to book a consultation before colour or keratin services?', a: 'Yes, we recommend a quick consultation (in person, by phone, or WhatsApp) so we can recommend the right products and give you an accurate quote.' },
  { q: 'How often should I get a keratin or nanoplastia treatment?', a: 'Most clients return every 3–5 months, depending on hair type, aftercare, and how quickly your natural texture returns.' },
  { q: 'Can I bring inspiration photos to my appointment?', a: 'Absolutely — reference photos help our stylists understand exactly the look you want and set realistic expectations.' },
];

export default function HairServices() {
  const { data: services, loading, error } = useFetch('/services?category=hair');
  const { data: gallery } = useFetch('/gallery?page=hair');
  const { data: siteContent } = useFetch('/site-content');
  const promoVideo = siteContent?.hair_promo_video?.value;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredServices = (services || []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredGallery = (gallery || []).filter((g) => filter === 'all' || g.category === filter);

  return (
    <>
      <PageHeader
        eyebrow="Hair Services"
        title="Cuts, colour & care for every hair type"
        subtitle="From a quick trim to full transformation colour work, our stylists tailor every service to your hair's health and your lifestyle."
      />

      <section className="py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="max-w-md mx-auto mb-11">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a service e.g. keratin, colour..."
              className="w-full rounded-full px-4.5 py-3.5 border-[1.5px] border-pink-200 bg-pink-50 text-sm outline-none focus:border-pink-500"
            />
          </div>

          {loading && <Loader label="Loading services..." />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredServices.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
              {filteredServices.length === 0 && (
                <p className="col-span-full text-center text-text-light">No services match your search.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-20 bg-pink-50 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center mb-9">
            <span className="eyebrow">Gallery</span>
            <h2 className="text-3xl">Recent hair transformations</h2>
          </div>
          <div className="flex justify-center gap-2.5 flex-wrap mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-full border-[1.5px] text-[13.5px] font-semibold capitalize transition-colors ${
                  filter === f ? 'bg-pink-600 border-pink-600 text-white' : 'bg-white border-pink-200 hover:border-pink-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4.5">
            {filteredGallery.length === 0 && (
              <p className="col-span-full text-center text-text-light">No gallery images in this category yet.</p>
            )}
            {filteredGallery.map((g) => (
              <div key={g._id} className="rounded-[10px] overflow-hidden aspect-square shadow-soft">
                <div className="w-full h-full flex items-center justify-center text-white text-[13px] text-center p-2"
                  style={{ background: 'linear-gradient(150deg, var(--color-pink-500), var(--color-plum-900))' }}>
                  {g.image ? <img src={g.image} alt={g.title} className="w-full h-full object-cover" /> : g.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO VIDEO */}
      <section className="py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center mb-9">
            <span className="eyebrow">Watch</span>
            <h2 className="text-3xl">This month's hair promotion</h2>
          </div>
          <VideoEmbed url={promoVideo} placeholderLabel="Promo video placeholder — embed salon video here" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-pink-50 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-9">
            <span className="eyebrow">FAQ</span>
            <h2 className="text-3xl">Hair service questions</h2>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
