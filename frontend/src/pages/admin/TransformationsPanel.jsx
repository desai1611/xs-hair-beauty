import { useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../../api/client';
import Loader, { ErrorMessage } from '../../components/Loader';
import ImageUploadField from '../../components/admin/ImageUploadField';

// Groups the flat GalleryImage rows (page: 'reviews', type: 'before'/'after',
// linked by pairKey) into { pairKey, before, after } pairs for editing.
function groupPairs(images) {
  const map = {};
  images.forEach((img) => {
    const key = img.pairKey || img._id;
    if (!map[key]) map[key] = { pairKey: key, before: null, after: null };
    if (img.type === 'before') map[key].before = img;
    if (img.type === 'after') map[key].after = img;
  });
  return Object.values(map)
    .filter((p) => p.before || p.after)
    .sort((a, b) => (a.before?.order ?? a.after?.order ?? 0) - (b.before?.order ?? b.after?.order ?? 0));
}

const emptyForm = { title: '', description: '', beforeImage: '', afterImage: '', order: 0, isActive: true };

export default function TransformationsPanel() {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null); // null while adding new
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingKey, setDeletingKey] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/gallery/admin');
      setPairs(groupPairs(res.data.filter((img) => img.page === 'reviews')));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingKey(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(pair) {
    setEditingKey(pair.pairKey);
    setForm({
      title: pair.before?.title || pair.after?.title || '',
      description: pair.before?.description || pair.after?.description || '',
      beforeImage: pair.before?.image || '',
      afterImage: pair.after?.image || '',
      order: pair.before?.order ?? pair.after?.order ?? 0,
      isActive: pair.before?.isActive ?? pair.after?.isActive ?? true,
    });
    setFormError('');
    setModalOpen(true);
  }

  function updateField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.beforeImage || !form.afterImage) {
      setFormError('Please add both a Before photo and an After photo.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const shared = {
        title: form.title,
        description: form.description,
        page: 'reviews',
        category: 'transformation',
        order: Number(form.order) || 0,
        isActive: form.isActive,
      };

      if (editingKey) {
        const pair = pairs.find((p) => p.pairKey === editingKey);
        const beforePayload = { ...shared, image: form.beforeImage, type: 'before', pairKey: editingKey };
        const afterPayload = { ...shared, image: form.afterImage, type: 'after', pairKey: editingKey };
        await Promise.all([
          pair?.before ? api.put(`/gallery/${pair.before._id}`, beforePayload) : api.post('/gallery', beforePayload),
          pair?.after ? api.put(`/gallery/${pair.after._id}`, afterPayload) : api.post('/gallery', afterPayload),
        ]);
      } else {
        const pairKey = `pair-${Date.now()}`;
        await Promise.all([
          api.post('/gallery', { ...shared, image: form.beforeImage, type: 'before', pairKey }),
          api.post('/gallery', { ...shared, image: form.afterImage, type: 'after', pairKey }),
        ]);
      }

      setModalOpen(false);
      await load();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(pair) {
    if (!window.confirm('Delete this before/after transformation? This cannot be undone.')) return;
    setDeletingKey(pair.pairKey);
    try {
      await Promise.all([
        pair.before ? api.delete(`/gallery/${pair.before._id}`) : null,
        pair.after ? api.delete(`/gallery/${pair.after._id}`) : null,
      ]);
      setPairs((prev) => prev.filter((p) => p.pairKey !== pair.pairKey));
    } catch (err) {
      alert(extractErrorMessage(err));
    } finally {
      setDeletingKey(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-7">
        <div>
          <h1 className="text-[26px] mb-1">Transformations</h1>
          <p className="text-sm mb-0">
            Manage the Before &amp; After photos shown on the Reviews page. Upload a "before" and "after" photo
            together as one entry — visitors see them side by side.
          </p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-sm">+ Add Transformation</button>
      </div>

      {loading && <Loader label="Loading transformations..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 gap-6">
          {pairs.map((pair) => (
            <div key={pair.pairKey} className="bg-white rounded-[14px] border border-pink-100 shadow-soft overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="aspect-[4/3] bg-pink-50 flex items-center justify-center overflow-hidden">
                  {pair.before?.image ? (
                    <img src={pair.before.image} alt="Before" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-text-light">No before photo</span>
                  )}
                </div>
                <div className="aspect-[4/3] bg-pink-50 flex items-center justify-center overflow-hidden">
                  {pair.after?.image ? (
                    <img src={pair.after.image} alt="After" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-text-light">No after photo</span>
                  )}
                </div>
              </div>
              <div className="px-4.5 py-3.5">
                <strong className="block text-sm">{pair.before?.title || pair.after?.title || 'Untitled'}</strong>
                <p className="text-[13px] text-text-light mt-1 mb-2.5">{pair.before?.description || pair.after?.description || '—'}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-semibold ${pair.before?.isActive ?? pair.after?.isActive ? 'text-green-600' : 'text-text-light'}`}>
                    {(pair.before?.isActive ?? pair.after?.isActive) ? 'Visible' : 'Hidden'}
                  </span>
                  <div>
                    <button onClick={() => openEdit(pair)} className="text-pink-700 font-semibold text-xs mr-4 hover:underline">Edit</button>
                    <button
                      onClick={() => handleDelete(pair)}
                      disabled={deletingKey === pair.pairKey}
                      className="text-red-500 font-semibold text-xs hover:underline disabled:opacity-50"
                    >
                      {deletingKey === pair.pairKey ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {pairs.length === 0 && (
            <div className="sm:col-span-2 bg-white rounded-[14px] border border-pink-100 shadow-soft px-5 py-10 text-center text-text-light text-sm">
              No transformations yet — the Reviews page is showing placeholder examples. Click "+ Add Transformation" to add a real one.
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-7 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl mb-5">{editingKey ? 'Edit Transformation' : 'Add Transformation'}</h2>

            {formError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field mb-4">
                <label htmlFor="title">Title</label>
                <input id="title" type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)} required />
              </div>

              <div className="field mb-4">
                <label htmlFor="description">Caption (optional)</label>
                <textarea id="description" rows={2} value={form.description} onChange={(e) => updateField('description', e.target.value)} />
              </div>

              <div className="field mb-4">
                <label>Before Photo</label>
                <ImageUploadField id="beforeImage" value={form.beforeImage} onChange={(url) => updateField('beforeImage', url)} required />
              </div>

              <div className="field mb-4">
                <label>After Photo</label>
                <ImageUploadField id="afterImage" value={form.afterImage} onChange={(url) => updateField('afterImage', url)} required />
              </div>

              <div className="field mb-4">
                <label className="flex items-center gap-2 text-sm font-normal">
                  <input type="checkbox" className="w-auto" checked={form.isActive} onChange={(e) => updateField('isActive', e.target.checked)} />
                  Visible on the public Reviews page
                </label>
              </div>

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
