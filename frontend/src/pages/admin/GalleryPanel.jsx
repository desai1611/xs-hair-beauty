import ResourceManager from '../../components/admin/ResourceManager';

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'page', label: 'Page', type: 'select', options: ['home', 'hair', 'beauty', 'advanced', 'reviews'] },
  { name: 'category', label: 'Filter Category (e.g. colour, cuts, treatments)' },
  { name: 'image', label: 'Photo', type: 'image', required: true },
  { name: 'type', label: 'Type', type: 'select', options: ['single', 'before', 'after'] },
  { name: 'pairKey', label: 'Before/After Pair Key (optional)' },
  { name: 'order', label: 'Display Order', type: 'number' },
  { name: 'isActive', label: 'Active', type: 'checkbox', checkboxLabel: 'Visible on the public site' },
];

const emptyItem = {
  title: '', page: 'hair', category: 'general', image: '', type: 'single', pairKey: '', order: 0, isActive: true,
};

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'page', label: 'Page' },
  { key: 'category', label: 'Category' },
  { key: 'isActive', label: 'Status', render: (i) => (i.isActive ? 'Active' : 'Hidden') },
];

export default function GalleryPanel() {
  return (
    <ResourceManager
      title="Gallery"
      description="Manage gallery images shown across the Hair, Advanced Beauty, and Home pages."
      apiBase="/gallery"
      columns={columns}
      fields={fields}
      emptyItem={emptyItem}
    />
  );
}
