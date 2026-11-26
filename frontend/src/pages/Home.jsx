import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import SectionHeading from '../components/SectionHeading';
import TestimonialCard from '../components/TestimonialCard';
import Loader from '../components/Loader';
import { SALON, FRESHA_STATS, DEFAULT_HOURS, waLink, telLink, mapsEmbedSrc } from '../config/salon';
import { openStatus } from '../utils/openStatus';

const MARQUEE_ITEMS = ['Your Look, Our Art', 'Haircuts', 'Colour', 'Threading', 'Waxing', 'Facials', 'Bridal & Party'];

const GALLERY_FALLBACK = [
  { _id: 'f1', title: 'Hair Colour', image: '/images/stock/hair-colour.jpg' },
  { _id: 'f2', title: 'Bridal Look', image: '/images/stock/bridal-look.jpg' },
  { _id: 'f3', title: 'Facial Glow', image: '/images/stock/facial-glow.jpg' },
  { _id: 'f4', title: 'Styling', image: '/images/stock/styling.jpg' },
];
const GALLERY_BG = ['var(--color-pink-500)', 'var(--color-lime)', 'var(--color-plum-800)', 'var(--color-pink-200)'];
const GALLERY_FG = ['text-plum-900', 'text-plum-900', 'text-white', 'text-plum-900'];
const GALLERY_SPAN = ['sm:col-span-2 sm:row-span-2', '', '', 'sm:col-span-2'];

function MarqueeTrack() {
  return (
    <div className="marquee-track" aria-hidden="true">
      {MARQUEE_ITEMS.map((t) => (
        <span key={t} className="inline-flex items-center gap-10 font-display text-[20px] sm:text-[24px] font-medium italic">
          {t}
          <span className="text-gold text-[16px]">✦</span>
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
  const { data: allServices } = useFetch('/services');
  const popular = (allServices || []).filter((s) => s.isPopular).slice(0, 2);
  const shortText = (t = '') => (t.length > 170 ? `${t.slice(0, 167).replace(/\s+\S*$/, '')}...` : t);
  const hoursLines = siteContent?.opening_hours?.value
    ? siteContent.opening_hours.value.split(/\r?\n/).filter(Boolean)
    : DEFAULT_HOURS;
  const status = openStatus(hoursLines);
  const galleryItems = (gallery && gallery.length > 0 ? gallery : GALLERY_FALLBACK).slice(0, 4);

  return (
    <>
      {/* HERO — bento grid */}
      <section className="px-3 sm:px-5 pt-4">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="tile lg:col-span-8 bg-pink-100 px-7 sm:px-12 py-10 sm:py-14 flex flex-col justify-between min-h-[420px]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="eyebrow !mb-0" style={{ background: 'var(--color-white)' }}>Auckland's Neighbourhood Salon</span>
                {status && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-plum-900 text-white text-[12px] font-bold px-3.5 py-1.5">
                    <span className={`w-2 h-2 rounded-full ${status.open ? 'bg-gold animate-pulse' : 'bg-pink-300'}`} aria-hidden="true" />
                    {status.text}
                  </span>
                )}
              </div>
              <h1 className="text-[44px] sm:text-[70px] leading-[1.02] mb-5 max-w-[11ch] sm:max-w-none">
                Look &amp; feel your <em className="italic font-normal text-pink-700">best</em>, every visit
              </h1>
              <p className="text-[16px] sm:text-[18px] text-plum-900/80 max-w-md mb-8">
                From everyday haircuts to bridal glam, XS Hair &amp; Beauty in Glenfield blends skilled hands with a calm, welcoming space. Book in minutes by phone or WhatsApp.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <a href={SALON.booking} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Book Online</a>
              <a href={waLink('Hi! I want to book an appointment.')} target="_blank" rel="noopener noreferrer" className="btn btn-light">Chat on WhatsApp</a>
            </div>
          </div>

          <div className="tile lg:col-span-4 lg:row-span-2 bg-plum-800 min-h-[380px] lg:min-h-0">
            <img src="/images/salon/massage-chair.jpg" alt="Inside XS Hair & Beauty salon" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(42,21,34,0) 55%, rgba(42,21,34,0.55) 100%)' }} />
            <div className="sticker absolute left-4 bottom-4 sm:left-5 sm:bottom-5">
              <span className="text-gold">★★★★★</span> {FRESHA_STATS.rating} / 5 on Fresha
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-3 gap-3">
            <div className="tile bg-lime px-4 sm:px-7 py-6 sm:py-8">
              <strong className="block font-display text-[34px] sm:text-[52px] leading-none text-plum-900">{FRESHA_STATS.reviews}</strong>
              <span className="text-[12px] sm:text-[14px] font-semibold text-plum-900/75">Client Reviews</span>
            </div>
            <div className="tile bg-plum-900 px-4 sm:px-7 py-6 sm:py-8">
              <strong className="block font-display text-[34px] sm:text-[52px] leading-none text-white">{FRESHA_STATS.rating}<span className="text-gold">★</span></strong>
              <span className="text-[12px] sm:text-[14px] font-semibold text-white/75">Rating on Fresha</span>
            </div>
            <div className="tile bg-white border-[1.5px] border-plum-900/10 px-4 sm:px-7 py-6 sm:py-8">
              <strong className="block font-display text-[34px] sm:text-[52px] leading-none text-pink-700">{FRESHA_STATS.services}</strong>
              <span className="text-[12px] sm:text-[14px] font-semibold text-plum-900/75">Services to Book</span>
            </div>
          </div>
        </div>
      </section>

      {/* SLOGAN MARQUEE */}
      <div className="overflow-hidden py-3">
        <section className="py-4 bg-plum-900 text-white" aria-label="Your Look, Our Art — haircuts, colour, threading, waxing, facials, bridal and party">
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
              { label: 'Hair', title: 'Hair Services', desc: 'Cuts, colour, highlights, keratin, nanoplastia and treatments for every hair type.', to: '/hair-services', bg: 'var(--color-lime)', img: '/images/stock/hair-colour.jpg', pos: '50% 74%' },
              { label: 'Beauty', title: 'Beauty & Advanced', desc: 'Threading, waxing, gentle facials, advanced skin treatments, plus bridal and party packages.', to: '/beauty-services', bg: 'var(--color-plum-900)', img: '/images/stock/facial-glow.jpg', pos: '50% 50%' },
            ].map((s) => (
              <Link key={s.title} to={s.to}
                className="tile reveal group p-8 sm:p-10 min-h-[300px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
                style={{ background: s.bg }}>
                <img src={s.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: s.pos }} loading="lazy" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(43,10,30,0.15) 0%, rgba(43,10,30,0.88) 100%)' }} />
                <span className="sticker relative self-start">{s.label}</span>
                <div className="relative">
                  <h3 className="text-[34px] sm:text-[44px] leading-none mb-3 !text-white">{s.title}</h3>
                  <p className="text-[15px] max-w-sm mb-5 text-white/85">{s.desc}</p>
                  <span className="inline-flex items-center gap-2 font-bold text-sm text-lime">
                    View {s.title} <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INSIDE THE SALON */}
      <section className="py-10 sm:py-16 px-3 sm:px-5">
        <div className="max-w-[1240px] mx-auto">
          <SectionHeading eyebrow="Inside XS" title="A calm, modern space"
            subtitle="Unwind in our massage chair and browse professional Wella, Keune and Brazilian keratin care — all under one welcoming roof." />
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="tile reveal aspect-[3/4] bg-pink-100">
              <img src="/images/salon/massage-chair.jpg" alt="Massage chair in the XS Hair & Beauty salon" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <span className="sticker absolute left-4 bottom-4">Relax &amp; unwind</span>
            </div>
            <div className="tile reveal aspect-[3/4] bg-plum-800">
              <video className="absolute inset-0 w-full h-full object-cover" src="/videos/salon-tour.mp4" poster="/images/salon/retail-wall.jpg"
                autoPlay muted loop playsInline preload="metadata" aria-label="A short walk through the salon" />
              <span className="sticker absolute left-4 bottom-4">Salon tour</span>
            </div>
            <div className="tile reveal aspect-[3/4] bg-pink-100">
              <img src="/images/salon/retail-wall.jpg" alt="Wella and Keune professional hair care on display" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <span className="sticker absolute left-4 bottom-4">Professional care, in store</span>
            </div>
          </div>
          <div className="text-center mt-9">
            <Link to="/products" className="btn btn-outline">Shop salon products</Link>
          </div>
        </div>
      </section>

      {/* MOST POPULAR */}
      {popular.length > 0 && (
        <section className="py-10 sm:py-16 px-3 sm:px-5">
          <div className="max-w-[1240px] mx-auto">
            <SectionHeading eyebrow="Most popular" title="Our clients' favourites"
              subtitle="The two treatments our clients ask for most. Tap Book to choose your time on Fresha." />
            <div className="grid md:grid-cols-2 gap-3">
              {popular.map((s) => (
                <div key={s._id} className="tile reveal bg-plum-900 min-h-[380px] p-7 sm:p-9 flex flex-col justify-end text-white">
                  {s.image && <img src={s.image} alt={s.name} className="absolute inset-0 w-full h-full object-cover object-[50%_30%]" loading="lazy" />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(42,21,34,0.1) 0%, rgba(42,21,34,0.9) 78%)' }} />
                  <span className="sticker relative self-start mb-auto">★ Most popular</span>
                  <h3 className="relative !text-white text-[32px] sm:text-[40px] leading-none mt-10 mb-3">{s.name}</h3>
                  <p className="relative text-white/85 text-[15px] max-w-md mb-5">{shortText(s.description)}</p>
                  <div className="relative flex flex-wrap items-center gap-x-5 gap-y-3">
                    {s.duration && <span className="text-[13px] font-semibold text-white/85">Takes {s.duration}</span>}
                    <span className="font-display text-[22px] font-semibold text-white">{s.priceNote} ${s.price}</span>
                    <a href={SALON.booking} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-sm">Book now</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OFFERS */}
      <section className="py-16 sm:py-20 px-3 sm:px-5">
        <div className="max-w-[1240px] mx-auto tile bg-pink-100 px-5 sm:px-12 py-12 sm:py-16">
          <SectionHeading eyebrow="Limited Time" title="Special offers"
            subtitle="Seasonal deals and packages — ask our team for the latest pricing when you book." />
          {offersLoading ? (
            <Loader label="Loading offers..." />
          ) : (
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-1 px-1 pb-4 scroll-smooth [scrollbar-width:thin] [scrollbar-color:var(--color-plum-900)_transparent]" tabIndex={0} aria-label="Special offers, scroll sideways for more">
              {(offers || []).map((offer, i) => (
                <div key={offer._id}
                  className="tile snap-start shrink-0 w-[82%] sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)] p-7 min-h-[300px] flex flex-col justify-end text-white"
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
          {!offersLoading && (offers || []).length > 3 && (
            <p className="text-center text-[13px] font-semibold text-plum-900/60 mt-1">Scroll sideways for more offers →</p>
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
                className={`tile reveal ${GALLERY_SPAN[i % 4]} flex items-end p-4 hover:scale-[1.02] transition-transform duration-300`}
                style={{ background: GALLERY_BG[i % 4] }}>
                {g.image ? (
                  <>
                    <img src={g.image} alt={g.title} className="absolute inset-0 w-full h-full object-cover object-[50%_30%]" loading="lazy" />
                    <span className="sticker relative !text-[11px] sm:!text-[12px]">{g.title}</span>
                  </>
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
          <div className="tile border border-plum-900/15 min-h-[300px]">
            <iframe src={mapsEmbedSrc()} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="XS Hair & Beauty location" className="absolute inset-0 w-full h-full border-0 block" />
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="pb-16 px-3 sm:px-5 pt-6">
        <div className="max-w-[1240px] mx-auto">
          <div className="tile bg-plum-900 px-7 sm:px-14 py-14 sm:py-20 text-center">
            <h2 className="text-white text-[36px] sm:text-[60px] leading-[1.02] mb-4 max-w-3xl mx-auto">
              Ready for your <em className="italic text-gold font-normal">next</em> appointment?
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
