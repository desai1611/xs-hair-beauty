import ResourceManager from '../../components/admin/ResourceManager';

const fields = [
  { name: 'name', label: 'Service Name', required: true },
  { name: 'category', label: 'Category', type: 'select', options: ['hair', 'beauty', 'advanced'] },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'price', label: 'Price (NZD, leave blank for "on consultation")', type: 'number' },
  { name: 'priceNote', label: 'Price Note (e.g. "From")' },
  { name: 'image', label: 'Image URL' },
  { name: 'order', label: 'Display Order', type: 'number' },
  { name: 'isFeatured', label: 'Featured', type: 'checkbox', checkboxLabel: 'Highlight this service' },
  { name: 'isActive', label: 'Active', type: 'checkbox', checkboxLabel: 'Visible on the public site' },
];

const emptyItem = {
  name: '', category: 'hair', description: '', price: '', priceNote: 'From',
  image: '', order: 0, isFeatured: false, isActive: true,
};

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', render: (i) => (i.price != null ? `$${i.price}` : '—') },
  { key: 'isActive', label: 'Status', render: (i) => (i.isActive ? 'Active' : 'Hidden') },
];

export default function ServicesPanel() {
  return (
    <ResourceManager
      title="Services"
      description="Manage the Hair, Beauty, and Advanced Beauty service listings shown on the public site."
      apiBase="/services"
      columns={columns}
      fields={fields}
      emptyItem={emptyItem}
    />
  );
}
