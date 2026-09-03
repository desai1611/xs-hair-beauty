import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import SectionHeading from '../components/SectionHeading';
import TestimonialCard from '../components/TestimonialCard';
import Loader from '../components/Loader';
import { SALON, waLink, telLink, mapsEmbedSrc } from '../config/salon';

export default function Home() {
  const { data: offers, loading: offersLoading } = useFetch('/offers');
  const { data: reviews, loading: reviewsLoading } = useFetch('/reviews');
  const { data: gallery } = useFetch('/gallery?page=home');

  return (
    <>
      {/* HERO */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-28 overflow-hidden"
        style={{ background: 'radial-gradient(circle at 15% 20%, var(--color-pink-100), transparent 55%), radial-gradient(circle at 85% 0%, var(--color-pink-50), transparent 45%), var(--color-white)' }}>
        <div className="max-w-[1180px] mx-auto px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div>
            <span className="eyebrow">Auckland's Neighbourhood Salon</span>
            <h1 className="text-4xl sm:text-[58px] leading-tight mb-5.5">
              Look &amp; feel your <em style={{ fontStyle: 'italic', color: 'var(--color-pink-600)' }}>best</em>, every visit
            </h1>
            <p className="text-[17px] text-text-light max-w-md mb-8">
              From everyday haircuts to bridal glam, XS Hair &amp; Beauty in Glenfield blends skilled hands with a calm, welcoming space. Book in minutes by phone or WhatsApp.
            </p>
            <div className="flex gap-4 flex-wrap mb-10">
              <Link to="/contact#booking-form" className="btn btn-primary">Book an Appointment</Link>
              <a href={waLink('Hi! I want to book an appointment.')} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Chat on WhatsApp</a>
            </div>
            <div className="flex gap-8 flex-wrap">
              <div><strong className="block font-display text-[26px] text-pink-700">500+</strong><span className="text-[13px] text-text-light">Happy Clients</span></div>
              <div><strong className="block font-display text-[26px] text-pink-700">4.9★</strong><span className="text-[13px] text-text-light">Average Rating</span></div>
              <div><strong className="block font-display text-[26px] text-pink-700">10+</strong><span className="text-[13px] text-text-light">Services Offered</span></div>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg max-w-[420px] mx-auto w-full">
            <div className="w-full h-full flex flex-col items-center justify-center text-center text-white font-display text-xl p-5"
              style={{ background: 'linear-gradient(150deg, var(--color-pink-300), var(--color-pink-700))' }}>
              Salon Interior Photo
              <small className="block font-sans text-xs opacity-85 mt-2">Replace with real photography</small>
            </div>
            <div className="absolute bottom-5 left-5 bg-white px-4.5 py-3.5 rounded-[18px] shadow-mid flex items-center gap-2.5">
              <div className="text-gold text-sm">★★★★★</div>
              <div><strong className="block text-sm">4.9 / 5</strong><span className="text-xs text-text-light">from local reviews</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE OVERVIEW */}
      <section className="py-22 px-6">
        <div className="max-w-[1180px] mx-auto">
          <SectionHeading eyebrow="What We Offer" title="Services for every occasion"
            subtitle="Three simple categories, one trusted team — explore hair, beauty, and our premium advanced treatments." />
          <div className="grid sm:grid-cols-3 gap-7">
            {[
              { icon: '✂️', title: 'Hair Services', desc: 'Cuts, colour, highlights, keratin, nanoplastia and treatments for every hair type.', to: '/hair-services' },
              { icon: '💆‍♀️', title: 'Beauty Services', desc: 'Eyebrow & facial threading, waxing, and gentle facials for a fresh, clean look.', to: '/beauty-services' },
              { icon: '✨', title: 'Advanced Beauty', desc: 'Advanced facials, skin & glow treatments, plus bridal and party packages.', to: '/advanced-beauty' },
            ].map((s) => (
              <div key={s.title} className="card text-center px-6.5 py-8.5">
                <div className="w-15.5 h-15.5 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-2xl mx-auto mb-4.5">{s.icon}</div>
                <h3 className="text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-text-light mb-0">{s.desc}</p>
                <Link to={s.to} className="btn btn-outline btn-sm mt-4 inline-flex">View {s.title}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section className="py-22 bg-pink-50">
        <div className="max-w-[1180px] mx-auto px-6">
          <SectionHeading eyebrow="Limited Time" title="Special offers"
            subtitle="Seasonal deals and packages — ask our team for the latest pricing when you book." />
          {offersLoading ? (
            <Loader label="Loading offers..." />
          ) : (
            <div className="grid sm:grid-cols-3 gap-7">
              {(offers || []).map((offer) => (
                <div key={offer._id} className="relative rounded-3xl overflow-hidden text-white p-8.5 min-h-[230px] flex flex-col justify-end shadow-mid"
                  style={{ background: 'linear-gradient(160deg, var(--color-pink-600), var(--color-plum-900))' }}>
                  {offer.tag && <span className="absolute top-5 left-5 bg-white text-pink-700 text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full uppercase">{offer.tag}</span>}
                  <h3 className="text-white text-[22px] mb-1.5">{offer.title}</h3>
                  <p className="text-white/85 text-sm mb-0">{offer.description}</p>
                </div>
              ))}
              {!offersLoading && (offers || []).length === 0 && (
                <p className="col-span-full text-center text-text-light">No active offers right now — check back soon!</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-22 px-6">
        <div className="max-w-[1180px] mx-auto">
          <SectionHeading eyebrow="Our Work" title="A glimpse of the gallery" subtitle="See more transformations, before & afters, and salon moments." />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4.5">
            {(gallery && gallery.length > 0 ? gallery : [{ _id: 1, title: 'Hair Colour' }, { _id: 2, title: 'Bridal Look' }, { _id: 3, title: 'Facial Glow' }, { _id: 4, title: 'Styling' }]).slice(0, 4).map((g, i) => (
              <div key={g._id || i} className="rounded-[10px] overflow-hidden aspect-square shadow-soft">
                <div className="w-full h-full flex items-center justify-center text-white text-[13px] text-center p-2"
                  style={{ background: `linear-gradient(150deg, var(--color-pink-${[300, 500, 200][i % 3]}), var(--color-plum-900))` }}>
                  {g.image ? <img src={g.image} alt={g.title} className="w-full h-full object-cover" /> : g.title}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-9">
            <Link to="/hair-services" className="btn btn-outline">See Full Gallery</Link>
          </div>
        </div>
      </section>

      {/* REVIEWS PREVIEW */}
      <section className="py-22 bg-pink-50">
        <div className="max-w-[1180px] mx-auto px-6">
          <SectionHeading eyebrow="Client Love" title="What our clients say" />
          {reviewsLoading ? (
            <Loader label="Loading reviews..." />
          ) : (
            <div className="grid sm:grid-cols-3 gap-7">
              {(reviews || []).slice(0, 3).map((r) => (
                <TestimonialCard key={r._id} review={r} />
              ))}
            </div>
          )}
          <div className="text-center mt-9">
            <Link to="/reviews" className="btn btn-outline">Read All Reviews</Link>
          </div>
        </div>
      </section>

      {/* LOCATION PREVIEW */}
      <section className="py-22 px-6">
        <div className="max-w-[1180px] mx-auto grid lg:grid-cols-2 gap-11 items-center">
          <div>
            <span className="eyebrow">Visit Us</span>
            <h2 className="text-3xl sm:text-4xl mb-3">Find us in Glenfield, Auckland</h2>
            <p className="text-text-light mb-6">{SALON.address}. Easy parking and close to the Glenfield town centre.</p>
            <Link to="/contact" className="btn btn-primary">Get Directions &amp; Contact Info</Link>
          </div>
          <div className="rounded-[18px] overflow-hidden shadow-soft border border-pink-100">
            <iframe src={mapsEmbedSrc()} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="XS Hair & Beauty location" className="w-full h-65 border-0 block" />
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="pb-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="rounded-3xl px-9 py-13 text-center text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--color-pink-600), var(--color-plum-900))' }}>
            <h2 className="text-white text-3xl mb-3">Ready for your next appointment?</h2>
            <p className="text-white/85 max-w-lg mx-auto mb-7">Message us on WhatsApp, give us a call, or send an enquiry — our team will get back to you quickly.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href={telLink()} className="btn btn-light">📞 Call the Salon</a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">💬 WhatsApp Us</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
