import ResourceManager from '../../components/admin/ResourceManager';

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'description', label: 'Caption (optional)', type: 'textarea' },
  { name: 'page', label: 'Page', type: 'select', options: ['home', 'hair', 'beauty', 'advanced'] },
  { name: 'category', label: 'Filter Category (e.g. colour, cuts, treatments)' },
  { name: 'image', label: 'Photo', type: 'image', required: true },
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
      description='Manage gallery photos for the Hair, Beauty, Advanced Beauty, and Home pages. To edit the "Before & After" transformations on the Reviews page, use the Transformations section instead.'
      apiBase="/gallery"
      columns={columns}
      fields={fields}
      emptyItem={emptyItem}
    />
  );
}
