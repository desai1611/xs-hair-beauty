import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import SectionHeading from '../components/SectionHeading';
import TestimonialCard from '../components/TestimonialCard';
import Loader from '../components/Loader';
import { SALON, waLink, telLink, mapsEmbedSrc } from '../config/salon';

const MARQUEE_ITEMS = ['Your Look, Our Art', 'Haircuts', 'Colour', 'Threading', 'Waxing', 'Facials', 'Bridal & Party'];

const GALLERY_FALLBACK = [
  { _id: 'f1', title: 'Hair Colour' },
  { _id: 'f2', title: 'Bridal Look' },
  { _id: 'f3', title: 'Facial Glow' },
  { _id: 'f4', title: 'Styling' },
];
const GALLERY_BG = ['var(--color-pink-500)', 'var(--color-lime)', 'var(--color-plum-800)', 'var(--color-pink-200)'];
const GALLERY_FG = ['text-plum-900', 'text-plum-900', 'text-white', 'text-plum-900'];
const GALLERY_SPAN = ['sm:col-span-2 sm:row-span-2', '', '', 'sm:col-span-2'];

function MarqueeTrack() {
  return (
    <div className="marquee-track" aria-hidden="true">
      {MARQUEE_ITEMS.map((t, i) => (
        <span key={t} className="inline-flex items-center gap-10 font-display text-[22px] sm:text-[28px] font-semibold">
          {t}
          <span className={i % 2 ? 'text-lime' : 'text-pink-500'}>✦</span>
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const { data: offers, loading: offersLoading } = useFetch('/offers');
  const { data: reviews, loading: reviewsLoading } = useFetch('/reviews');
  const { data: gallery } = useFetch('/gallery?page=home');
  const { data: siteContent } = useFetch('/site-content');
  const heroImage = siteContent?.home_hero_image?.value;
  const galleryItems = (gallery && gallery.length > 0 ? gallery : GALLERY_FALLBACK).slice(0, 4);

  return (
    <>
      {/* HERO — bento grid */}
      <section className="px-3 sm:px-5 pt-4">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="tile lg:col-span-8 bg-pink-500 px-7 sm:px-12 py-10 sm:py-14 flex flex-col justify-between min-h-[420px]">
            <div>
              <span className="eyebrow" style={{ background: 'var(--color-white)' }}>Auckland's Neighbourhood Salon</span>
              <h1 className="text-[44px] sm:text-[76px] leading-[0.98] mb-5 max-w-[11ch] sm:max-w-none">
                Look &amp; feel your <em className="italic font-medium text-white">best</em>, every visit
              </h1>
              <p className="text-[16px] sm:text-[18px] text-plum-900/80 max-w-md mb-8">
                From everyday haircuts to bridal glam, XS Hair &amp; Beauty in Glenfield blends skilled hands with a calm, welcoming space. Book in minutes by phone or WhatsApp.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/contact#booking-form" className="btn btn-primary">Book an Appointment</Link>
              <a href={waLink('Hi! I want to book an appointment.')} target="_blank" rel="noopener noreferrer" className="btn btn-light">Chat on WhatsApp</a>
            </div>
          </div>

          <div className="tile lg:col-span-4 lg:row-span-2 bg-plum-800 min-h-[340px] lg:min-h-0">
            {heroImage ? (
              <img src={heroImage} alt="XS Hair & Beauty salon interior" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                <span className="font-display text-[40px] sm:text-[48px] leading-tight font-semibold">Your Look,<br /><em className="italic text-lime font-medium">Our Art</em></span>
                <small className="block text-xs text-white/60 mt-3">Salon interior photo goes here</small>
              </div>
            )}
            <div className="sticker float-sticker absolute left-4 bottom-4 sm:left-5 sm:bottom-5 shadow-[3px_3px_0_var(--color-plum-900)]">
              <span className="text-gold">★★★★★</span> 4.9 / 5 from local reviews
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-3 gap-3">
            <div className="tile bg-lime px-4 sm:px-7 py-6 sm:py-8">
              <strong className="block font-display text-[34px] sm:text-[52px] leading-none text-plum-900">500+</strong>
              <span className="text-[12px] sm:text-[14px] font-semibold text-plum-900/75">Happy Clients</span>
            </div>
            <div className="tile bg-plum-900 px-4 sm:px-7 py-6 sm:py-8">
              <strong className="block font-display text-[34px] sm:text-[52px] leading-none text-white">4.9<span className="text-pink-500">★</span></strong>
              <span className="text-[12px] sm:text-[14px] font-semibold text-white/75">Average Rating</span>
            </div>
            <div className="tile bg-white border-[1.5px] border-plum-900/10 px-4 sm:px-7 py-6 sm:py-8">
              <strong className="block font-display text-[34px] sm:text-[52px] leading-none text-pink-700">10+</strong>
              <span className="text-[12px] sm:text-[14px] font-semibold text-plum-900/75">Services Offered</span>
            </div>
          </div>
        </div>
      </section>

      {/* SLOGAN MARQUEE */}
      <div className="overflow-hidden py-5">
        <section className="py-4 bg-plum-900 text-white -rotate-1 scale-[1.03] origin-center" aria-label="Your Look, Our Art — haircuts, colour, threading, waxing, facials, bridal and party">
          <div className="marquee flex">
            <MarqueeTrack />
            <MarqueeTrack />
          </div>
        </section>
      </div>

      {/* SERVICE OVERVIEW */}
      <section className="py-16 sm:py-20 px-3 sm:px-5">
        <div className="max-w-[1240px] mx-auto">
          <SectionHeading eyebrow="What We Offer" title="Services for every occasion"
            subtitle="Two simple categories, one trusted team — explore hair, and beauty & advanced treatments." />
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { icon: '✂️', title: 'Hair Services', desc: 'Cuts, colour, highlights, keratin, nanoplastia and treatments for every hair type.', to: '/hair-services', bg: 'var(--color-lime)', dark: false },
              { icon: '💆‍♀️', title: 'Beauty & Advanced', desc: 'Threading, waxing, gentle facials, advanced skin treatments, plus bridal and party packages.', to: '/beauty-services', bg: 'var(--color-plum-900)', dark: true },
            ].map((s) => (
              <Link key={s.title} to={s.to}
                className="tile reveal group p-8 sm:p-10 min-h-[300px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
                style={{ background: s.bg }}>
                <span className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl border-2 border-plum-900 group-hover:rotate-12 transition-transform">{s.icon}</span>
                <div>
                  <h3 className={`text-[34px] sm:text-[44px] leading-none mb-3 ${s.dark ? '!text-white' : ''}`}>{s.title}</h3>
                  <p className={`text-[15px] max-w-sm mb-5 ${s.dark ? 'text-white/75' : 'text-plum-900/75'}`}>{s.desc}</p>
                  <span className={`inline-flex items-center gap-2 font-bold text-sm ${s.dark ? 'text-lime' : 'text-plum-900'}`}>
                    View {s.title} <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section className="py-16 sm:py-20 px-3 sm:px-5">
        <div className="max-w-[1240px] mx-auto tile bg-pink-100 px-5 sm:px-12 py-12 sm:py-16">
          <SectionHeading eyebrow="Limited Time" title="Special offers"
            subtitle="Seasonal deals and packages — ask our team for the latest pricing when you book." />
          {offersLoading ? (
            <Loader label="Loading offers..." />
          ) : (
            <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-1 px-1 pb-2">
              {(offers || []).map((offer, i) => (
                <div key={offer._id}
                  className="tile reveal snap-center shrink-0 w-[82%] sm:w-auto p-7 min-h-[260px] flex flex-col justify-end text-white"
                  style={{ background: ['var(--color-plum-900)', 'var(--color-pink-600)', 'var(--color-plum-800)'][i % 3] }}>
                  {offer.image && <img src={offer.image} alt={offer.title} className="absolute inset-0 w-full h-full object-cover" />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(43,10,30,0.1) 0%, rgba(43,10,30,0.85) 88%)' }} />
                  {offer.tag && <span className="sticker relative z-10 self-start mb-auto">{offer.tag}</span>}
                  <h3 className="relative z-10 !text-white text-[26px] leading-tight mb-1.5 mt-8">{offer.title}</h3>
                  <p className="relative z-10 text-white/85 text-sm mb-0">{offer.description}</p>
                </div>
              ))}
              {!offersLoading && (offers || []).length === 0 && (
                <p className="col-span-full text-center text-text-light w-full">No active offers right now — check back soon!</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-16 sm:py-20 px-3 sm:px-5">
        <div className="max-w-[1240px] mx-auto">
          <SectionHeading eyebrow="Our Work" title="A glimpse of the gallery" subtitle="See more transformations, before & afters, and salon moments." />
          <div className="grid grid-cols-2 sm:grid-cols-4 sm:auto-rows-[200px] auto-rows-[160px] gap-3">
            {galleryItems.map((g, i) => (
              <div key={g._id || i}
                className={`tile reveal ${GALLERY_SPAN[i % 4]} flex items-end p-4 hover:-rotate-1 hover:scale-[1.02] transition-transform duration-300`}
                style={{ background: GALLERY_BG[i % 4] }}>
                {g.image ? (
                  <img src={g.image} alt={g.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span className={`font-display text-[22px] sm:text-[30px] leading-none font-semibold ${GALLERY_FG[i % 4]}`}>{g.title}</span>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-9">
            <Link to="/hair-services" className="btn btn-outline">See Full Gallery</Link>
          </div>
        </div>
      </section>

      {/* REVIEWS PREVIEW */}
      <section className="py-16 sm:py-20 px-3 sm:px-5">
        <div className="max-w-[1240px] mx-auto">
          <SectionHeading eyebrow="Client Love" title="What our clients say" />
          {reviewsLoading ? (
            <Loader label="Loading reviews..." />
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              {(reviews || []).slice(0, 3).map((r) => (
                <div key={r._id} className="reveal"><TestimonialCard review={r} /></div>
              ))}
            </div>
          )}
          <div className="text-center mt-9">
            <Link to="/reviews" className="btn btn-outline">Read All Reviews</Link>
          </div>
        </div>
      </section>

      {/* LOCATION PREVIEW */}
      <section className="py-10 sm:py-14 px-3 sm:px-5">
        <div className="max-w-[1240px] mx-auto grid lg:grid-cols-2 gap-3">
          <div className="tile bg-lime p-8 sm:p-12 flex flex-col justify-center">
            <span className="eyebrow self-start" style={{ background: 'var(--color-white)' }}>Visit Us</span>
            <h2 className="text-[34px] sm:text-[48px] leading-[1.02] mb-4">Find us in Glenfield, Auckland</h2>
            <p className="text-plum-900/75 mb-7">{SALON.address}. Easy parking and close to the Glenfield town centre.</p>
            <div><Link to="/contact" className="btn btn-primary">Get Directions &amp; Contact Info</Link></div>
          </div>
          <div className="tile border-2 border-plum-900 min-h-[300px]">
            <iframe src={mapsEmbedSrc()} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="XS Hair & Beauty location" className="absolute inset-0 w-full h-full border-0 block" />
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="pb-16 px-3 sm:px-5 pt-6">
        <div className="max-w-[1240px] mx-auto">
          <div className="tile bg-plum-900 px-7 sm:px-14 py-14 sm:py-20 text-center">
            <h2 className="text-white text-[36px] sm:text-[60px] leading-[1.02] mb-4 max-w-3xl mx-auto">
              Ready for your <em className="italic text-pink-500 font-medium">next</em> appointment?
            </h2>
            <p className="text-white/75 max-w-lg mx-auto mb-8">Message us on WhatsApp, give us a call, or send an enquiry — our team will get back to you quickly.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href={telLink()} className="btn btn-light">📞 Call the Salon</a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">💬 WhatsApp Us</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
