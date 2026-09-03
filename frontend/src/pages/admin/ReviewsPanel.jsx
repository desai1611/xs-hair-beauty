import ResourceManager from '../../components/admin/ResourceManager';

const fields = [
  { name: 'name', label: 'Client Name', required: true },
  { name: 'serviceLabel', label: 'Service Label (e.g. "Hair Colour Client")' },
  { name: 'rating', label: 'Rating (1-5)', type: 'number', required: true },
  { name: 'quote', label: 'Review Quote', type: 'textarea', required: true },
  { name: 'order', label: 'Display Order', type: 'number' },
  { name: 'isPublished', label: 'Published', type: 'checkbox', checkboxLabel: 'Visible on the public site' },
];

const emptyItem = { name: '', serviceLabel: '', rating: 5, quote: '', order: 0, isPublished: true };

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'rating', label: 'Rating', render: (i) => '★'.repeat(i.rating) },
  { key: 'quote', label: 'Quote', render: (i) => (i.quote.length > 60 ? `${i.quote.slice(0, 60)}...` : i.quote) },
  { key: 'isPublished', label: 'Status', render: (i) => (i.isPublished ? 'Published' : 'Hidden') },
];

export default function ReviewsPanel() {
  return (
    <ResourceManager
      title="Reviews"
      description="Manage the customer testimonials shown on the Home and Reviews pages."
      apiBase="/reviews"
      columns={columns}
      fields={fields}
      emptyItem={emptyItem}
    />
  );
}
