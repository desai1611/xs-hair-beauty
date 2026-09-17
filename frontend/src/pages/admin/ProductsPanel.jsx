import ResourceManager from '../../components/admin/ResourceManager';

const fields = [
  { name: 'name', label: 'Product Name', required: true },
  { name: 'brand', label: 'Brand' },
  { name: 'category', label: 'Category (e.g. Hair Care, Styling, Skin Care)' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'price', label: 'Price (NZD)', type: 'number', required: true },
  { name: 'image', label: 'Photo', type: 'image' },
  { name: 'order', label: 'Display Order', type: 'number' },
  { name: 'inStock', label: 'In Stock', type: 'checkbox', checkboxLabel: 'Currently available' },
  { name: 'isActive', label: 'Active', type: 'checkbox', checkboxLabel: 'Visible on the public site' },
];

const emptyItem = {
  name: '', brand: '', category: 'Hair Care', description: '', price: '',
  image: '', order: 0, inStock: true, isActive: true,
};

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', render: (i) => `$${i.price}` },
  { key: 'inStock', label: 'Stock', render: (i) => (i.inStock ? 'In stock' : 'Out of stock') },
];

export default function ProductsPanel() {
  return (
    <ResourceManager
      title="Products"
      description="Manage the hair care and beauty products sold on the Products page."
      apiBase="/products"
      columns={columns}
      fields={fields}
      emptyItem={emptyItem}
    />
  );
}
