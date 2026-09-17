import { useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../../api/client';
import Loader, { ErrorMessage } from '../../components/Loader';
import ImageUploadField from '../../components/admin/ImageUploadField';

export default function SiteMediaPanel() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState(null);
  const [savedKey, setSavedKey] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/site-content');
      setContent(res.data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function updateLocal(key, value) {
    setContent((c) => ({ ...c, [key]: { ...c[key], value } }));
  }

  async function save(key) {
    setSavingKey(key);
    setSavedKey(null);
    try {
      await api.put(`/site-content/${key}`, { value: content[key].value });
      setSavedKey(key);
      setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 2000);
    } catch (err) {
      alert(extractErrorMessage(err));
    } finally {
      setSavingKey(null);
    }
  }

  if (loading) return <Loader label="Loading site media..." />;
  if (error) return <ErrorMessage message={error} />;

  const entries = Object.entries(content || {});

  return (
    <div>
      <h1 className="text-[26px] mb-1">Site Media</h1>
      <p className="mb-8">
        These are the standalone photo &amp; video spots on the public site that aren't part of a
        list (like the homepage hero photo). Everything else — service, product, gallery, and offer
        photos — is managed from its own section using the same upload button.
      </p>

      <div className="space-y-5">
        {entries.map(([key, item]) => (
          <div key={key} className="bg-white rounded-[14px] border border-pink-100 shadow-soft p-6">
            <h3 className="text-base mb-1">{item.label}</h3>
            <p className="text-xs text-text-light mb-4">
              {item.type === 'video'
                ? 'Paste a YouTube link or a direct video file URL (.mp4).'
                : item.type === 'text'
                ? 'One line per entry — this is shown exactly as typed, line by line.'
                : 'Paste an image URL, or upload a photo from your computer.'}
            </p>

            {item.type === 'video' ? (
              <div className="field">
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateLocal(key, e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
                />
              </div>
            ) : item.type === 'text' ? (
              <div className="field">
                <textarea
                  rows={7}
                  value={item.value}
                  onChange={(e) => updateLocal(key, e.target.value)}
                  placeholder="Monday: Closed&#10;Tuesday: 9:30 AM – 6:00 PM"
                />
              </div>
            ) : (
              <ImageUploadField id={key} value={item.value} onChange={(url) => updateLocal(key, url)} />
            )}

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => save(key)}
                disabled={savingKey === key}
                className="btn btn-primary btn-sm disabled:opacity-60"
              >
                {savingKey === key ? 'Saving...' : 'Save'}
              </button>
              {savedKey === key && <span className="text-xs font-semibold text-pink-700">Saved ✓</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
