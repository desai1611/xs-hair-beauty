import { useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../../api/client';
import Loader, { ErrorMessage } from '../Loader';
import ImageUploadField from './ImageUploadField';

export default function ResourceManager({ title, description, apiBase, columns, fields, emptyItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`${apiBase}/admin`);
      setItems(res.data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyItem);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item._id);
    const values = { ...emptyItem };
    fields.forEach((f) => {
      values[f.name] = item[f.name] ?? emptyItem[f.name];
    });
    setForm(values);
    setFormError('');
    setModalOpen(true);
  }

  function updateField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = { ...form };
      fields.forEach((f) => {
        if (f.type === 'number' && payload[f.name] !== '' && payload[f.name] != null) {
          payload[f.name] = Number(payload[f.name]);
        }
        if (f.type === 'number' && payload[f.name] === '') {
          payload[f.name] = null;
        }
      });

      if (editingId) {
        await api.put(`${apiBase}/${editingId}`, payload);
      } else {
        await api.post(apiBase, payload);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`${apiBase}/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(extractErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-7">
        <div>
          <h1 className="text-[26px] mb-1">{title}</h1>
          {description && <p className="text-sm mb-0">{description}</p>}
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-sm">+ Add New</button>
      </div>

      {loading && <Loader label={`Loading ${title.toLowerCase()}...`} />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="bg-white rounded-[14px] border border-pink-100 shadow-soft overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left border-b border-pink-100 text-text-light text-xs uppercase tracking-wide">
                {columns.map((c) => <th key={c.key} className="px-5 py-3.5 font-semibold">{c.label}</th>)}
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-pink-50 last:border-0 hover:bg-pink-50/50">
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-3.5 align-top">
                      {c.render ? c.render(item) : String(item[c.key] ?? '—')}
                    </td>
                  ))}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(item)} className="text-pink-700 font-semibold text-xs mr-4 hover:underline">Edit</button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="text-red-500 font-semibold text-xs hover:underline disabled:opacity-50"
                    >
                      {deletingId === item._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="px-5 py-8 text-center text-text-light">No items yet — click "Add New" to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-7 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl mb-5">{editingId ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}</h2>

            {formError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{formError}</div>}

            <form onSubmit={handleSubmit}>
              {fields.map((f) => (
                <div className="field mb-4" key={f.name}>
                  <label htmlFor={f.name}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      id={f.name}
                      rows={3}
                      value={form[f.name] ?? ''}
                      onChange={(e) => updateField(f.name, e.target.value)}
                      required={f.required}
                    />
                  ) : f.type === 'select' ? (
                    <select id={f.name} value={form[f.name] ?? ''} onChange={(e) => updateField(f.name, e.target.value)}>
                      {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 text-sm font-normal">
                      <input
                        type="checkbox"
                        className="w-auto"
                        checked={!!form[f.name]}
                        onChange={(e) => updateField(f.name, e.target.checked)}
                      />
                      {f.checkboxLabel || 'Yes'}
                    </label>
                  ) : f.type === 'image' ? (
                    <ImageUploadField
                      id={f.name}
                      value={form[f.name]}
                      onChange={(url) => updateField(f.name, url)}
                      required={f.required}
                    />
                  ) : (
                    <input
                      id={f.name}
                      type={f.type || 'text'}
                      value={form[f.name] ?? ''}
                      onChange={(e) => updateField(f.name, e.target.value)}
                      required={f.required}
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary flex-1 justify-center disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
