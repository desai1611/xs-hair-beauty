import ResourceManager from '../../components/admin/ResourceManager';

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'description', label: 'Caption (optional — shown under Before/After pairs on the Reviews page)', type: 'textarea' },
  { name: 'page', label: 'Page', type: 'select', options: ['home', 'hair', 'beauty', 'advanced', 'reviews'] },
  { name: 'category', label: 'Filter Category (e.g. colour, cuts, treatments — ignored on the Reviews page)' },
  { name: 'image', label: 'Photo', type: 'image', required: true },
  {
    name: 'type',
    label: 'Type — set to "single" for a normal gallery photo, or "before"/"after" for a Reviews page transformation',
    type: 'select',
    options: ['single', 'before', 'after'],
  },
  {
    name: 'pairKey',
    label: 'Pair Key — only for Before/After: give the "before" and "after" entries the exact same key (e.g. "client1") to link them',
  },
  { name: 'order', label: 'Display Order', type: 'number' },
  { name: 'isActive', label: 'Active', type: 'checkbox', checkboxLabel: 'Visible on the public site' },
];

const emptyItem = {
  title: '', description: '', page: 'hair', category: 'general', image: '', type: 'single', pairKey: '', order: 0, isActive: true,
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
      description={
        'Manage gallery images across the site. To edit the "Before & After" section on the Reviews page: ' +
        'delete an existing pair with Delete, or add a new one by creating two entries with Page="reviews", ' +
        'matching Pair Key, and Type set to "before" and "after".'
      }
      apiBase="/gallery"
      columns={columns}
      fields={fields}
      emptyItem={emptyItem}
    />
  );
}
