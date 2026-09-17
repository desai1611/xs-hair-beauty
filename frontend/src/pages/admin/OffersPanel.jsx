import ResourceManager from '../../components/admin/ResourceManager';

const fields = [
  { name: 'tag', label: 'Tag (e.g. "New Client", "This Month")' },
  { name: 'title', label: 'Title', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'image', label: 'Photo', type: 'image' },
  { name: 'expiresAt', label: 'Expires On (optional)', type: 'date' },
  { name: 'order', label: 'Display Order', type: 'number' },
  { name: 'isActive', label: 'Active', type: 'checkbox', checkboxLabel: 'Visible on the public site' },
];

const emptyItem = { tag: '', title: '', description: '', image: '', expiresAt: '', order: 0, isActive: true };

const columns = [
  { key: 'tag', label: 'Tag' },
  { key: 'title', label: 'Title' },
  { key: 'expiresAt', label: 'Expires', render: (i) => (i.expiresAt ? new Date(i.expiresAt).toLocaleDateString('en-NZ') : 'No expiry') },
  { key: 'isActive', label: 'Status', render: (i) => (i.isActive ? 'Active' : 'Hidden') },
];

export default function OffersPanel() {
  return (
    <ResourceManager
      title="Offers"
      description="Manage the special offers shown on the Home page."
      apiBase="/offers"
      columns={columns}
      fields={fields}
      emptyItem={emptyItem}
    />
  );
}
