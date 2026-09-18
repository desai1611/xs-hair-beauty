import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';

const SECTIONS = [
  {
    icon: '✅',
    title: 'Our Guarantee',
    items: ['Carried out with reasonable care and skill', 'Fit for the purpose agreed', 'Completed within a reasonable time'],
  },
  {
    icon: '🚫',
    title: 'No Refunds for Change of Mind',
    items: ['Change your mind', 'Decide you do not like the style after service', 'Provide incorrect instructions or unclear expectations'],
  },
  {
    icon: '🔁',
    title: 'Corrections / Fix Policy',
    items: [
      'If you are not satisfied, please contact us within 3 days.',
      'Assess your concern',
      'Offer a free correction where appropriate (must be booked within 7 days)',
    ],
  },
  {
    icon: '💲',
    title: 'Refunds (If Applicable)',
    items: ['Service not carried out with reasonable care and skill', 'Issue cannot be fixed within a reasonable time'],
  },
  {
    icon: '⚠️',
    title: 'Right to Refuse Service',
    items: ['We reserve the right to refuse or stop service if a client is disruptive, abusive, or inappropriate', 'Charge for work already completed'],
  },
  {
    icon: '📅',
    title: 'Late & Cancellation Policy',
    items: ['24 hours notice for cancellations', 'Late arrivals may result in reduced service time or rescheduling'],
  },
  {
    icon: '👜',
    title: 'Product Purchases',
    items: ['Faulty products can be exchanged (proof of purchase required)', 'No refunds for change of mind'],
  },
];

export default function TermsConditions() {
  return (
    <>
      <PageHeader
        eyebrow="Terms & Conditions"
        title="Refund & Service Policy"
        subtitle="These terms are set out in line with New Zealand consumer law (Consumer Guarantees Act)."
      />

      <section className="py-16 px-6">
        <div className="max-w-[820px] mx-auto space-y-9">
          {SECTIONS.map((s) => (
            <div key={s.title} className="bg-white border border-pink-100 rounded-[18px] px-7 py-6.5 shadow-soft">
              <h2 className="flex items-center gap-3 text-[20px] mb-4">
                <span className="text-2xl">{s.icon}</span>
                {s.title}
              </h2>
              <ul className="space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="text-text-light text-[15px] pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-pink-500">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="text-center text-text-light text-sm pt-2">Thank you for choosing XS Hair &amp; Beauty Salon ❤️</p>
        </div>
      </section>

      <CtaBand title="Questions about our policy?" subtitle="Message us on WhatsApp or give us a call — we're happy to explain anything before you book." />
    </>
  );
}
