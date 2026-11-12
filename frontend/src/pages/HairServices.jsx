import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import ServiceCard from '../components/ServiceCard';
import FaqAccordion from '../components/FaqAccordion';
import Loader, { ErrorMessage } from '../components/Loader';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';
import VideoEmbed from '../components/VideoEmbed';
import { SALON, waLink } from '../config/salon';

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
  // Falls back to /videos/hair-promo.mp4 if that file has been added to the site.
  const promoVideo = siteContent?.hair_promo_video?.value || '/videos/hair-promo.mp4';
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
              className="w-full input-pill"
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
      <section className="py-20 bg-pink-100 px-6">
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
                className={`px-5 py-2.5 rounded-full border-2 text-[13.5px] font-semibold capitalize transition-colors ${
                  filter === f ? 'bg-plum-900 border-plum-900 text-white' : 'bg-white border-plum-900/15 hover:border-plum-900'
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
              <div key={g._id} className="rounded-[24px] overflow-hidden aspect-square">
                <div className="w-full h-full flex items-center justify-center text-plum-900 font-display font-semibold text-[18px] text-center p-3"
                  style={{ background: 'var(--color-pink-500)' }}>
                  {g.image ? <img src={g.image} alt={g.title} className="w-full h-full object-cover" /> : g.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO VIDEO */}
      <section className="py-16 px-3 sm:px-5">
        <div className="max-w-[1240px] mx-auto grid lg:grid-cols-[1.5fr_1fr] gap-3 items-stretch">
          <VideoEmbed url={promoVideo} poster="/images/stock/hair-colour.jpg" label="See our work on Instagram" />
          <div className="tile bg-plum-900 p-8 sm:p-10 flex flex-col justify-center">
            <span className="eyebrow self-start">Watch</span>
            <h2 className="text-white text-[32px] sm:text-[42px] leading-[1.05] mb-4">See the care in every cut and colour</h2>
            <ul className="text-white/80 text-[15px] space-y-2 mb-7">
              <li>✦ A quick consultation before we start</li>
              <li>✦ Premium, low-damage products</li>
              <li>✦ Aftercare tips to keep it fresh at home</li>
            </ul>
            <div className="flex gap-3 flex-wrap">
              <a href={SALON.booking} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Book a Visit</a>
              <a href={waLink('Hi! I saw your hair services and have a question.')} target="_blank" rel="noopener noreferrer" className="btn btn-light">💬 Ask on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-pink-100 px-6">
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
