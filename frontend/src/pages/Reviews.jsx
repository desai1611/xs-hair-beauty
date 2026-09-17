import useFetch from '../hooks/useFetch';
import TestimonialCard from '../components/TestimonialCard';
import Loader, { ErrorMessage } from '../components/Loader';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';

// Shown only until the salon has added real before/after photos via Admin → Gallery.
const placeholderBeforeAfter = [
  { title: 'Balayage Colour Transformation', description: 'From flat single-tone to a sun-kissed balayage finish.' },
  { title: 'Keratin Smoothing Result', description: 'Frizzy, dry hair transformed into smooth, glossy strands.' },
  { title: 'Brow Threading Reshape', description: 'Cleaner, more defined brow shape in under 15 minutes.' },
  { title: 'Bridal Glow Facial', description: 'Refreshed, radiant skin ahead of the big day.' },
];

// Groups flat GalleryImage rows (type: 'before' | 'after', linked by pairKey)
// into { before, after, title, description } pairs for rendering.
function groupBeforeAfterPairs(images) {
  const map = {};
  (images || []).forEach((img) => {
    const key = img.pairKey || img._id;
    if (!map[key]) map[key] = { title: img.title, description: img.description };
    if (img.type === 'before') map[key].before = img;
    if (img.type === 'after') map[key].after = img;
    if (!map[key].description && img.description) map[key].description = img.description;
  });
  return Object.values(map).filter((pair) => pair.before || pair.after);
}

export default function Reviews() {
  const { data: reviews, loading, error } = useFetch('/reviews');
  const { data: gallery } = useFetch('/gallery?page=reviews');
  const realPairs = groupBeforeAfterPairs(gallery);
  const beforeAfter = realPairs.length > 0 ? realPairs : placeholderBeforeAfter;

  const avg = reviews && reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '4.9';
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct: reviews && reviews.length ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  return (
    <>
      <PageHeader eyebrow="Reviews" title="Loved by our Glenfield clients" subtitle="Real feedback from real clients — see why people keep coming back to XS Hair & Beauty." />

      <section className="py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex flex-wrap items-center gap-7 bg-white border border-pink-100 rounded-[18px] px-8.5 py-7.5 shadow-soft mb-13">
            <div className="font-display text-5xl text-pink-700 leading-none text-center">
              {avg}<br /><span className="text-gold text-base">★★★★★</span>
            </div>
            <div className="flex-1 min-w-55">
              {counts.map((c) => (
                <div key={c.star} className="flex items-center gap-2.5 mb-1.5 text-xs text-text-light">
                  <span>{c.star} star</span>
                  <div className="flex-1 h-1.5 bg-pink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${c.pct}%` }} />
                  </div>
                  <span>{c.pct}%</span>
                </div>
              ))}
            </div>
            <div>
              <strong className="block text-[15px]">{reviews ? reviews.length : 0}+ Reviews</strong>
              <span className="text-[13px] text-text-light">Based on Facebook &amp; in-salon feedback</span>
            </div>
          </div>

          {loading && <Loader label="Loading reviews..." />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {(reviews || []).map((r) => <TestimonialCard key={r._id} review={r} />)}
            </div>
          )}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="py-20 bg-pink-50 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center mb-11"><span className="eyebrow">Transformations</span><h2 className="text-3xl">Before &amp; after</h2><p className="text-text-light mt-2">A few of our favourite results — shown with client permission.</p></div>
          <div className="grid sm:grid-cols-2 gap-7">
            {beforeAfter.map((ba, i) => (
              <div key={ba.title || i} className="grid grid-cols-2 rounded-[18px] overflow-hidden shadow-soft border border-pink-100">
                {ba.before?.image ? (
                  <img src={ba.before.image} alt={`${ba.title} — before`} className="aspect-[3/4] w-full object-cover" />
                ) : (
                  <div className="aspect-[3/4] flex items-center justify-center text-white text-[13px]" style={{ background: 'linear-gradient(150deg, #c9b3ba, #7d6570)' }}>Before</div>
                )}
                {ba.after?.image ? (
                  <img src={ba.after.image} alt={`${ba.title} — after`} className="aspect-[3/4] w-full object-cover" />
                ) : (
                  <div className="aspect-[3/4] flex items-center justify-center text-white text-[13px]" style={{ background: 'linear-gradient(150deg, var(--color-pink-300), var(--color-pink-600))' }}>After</div>
                )}
                <div className="col-span-2 bg-white px-4.5 py-3.5">
                  <strong className="block text-sm">{ba.title}</strong>
                  <p className="text-[13px] text-text-light mt-1 mb-0">{ba.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Become our next happy client" subtitle="Book today and see why our clients keep coming back." />
    </>
  );
}
