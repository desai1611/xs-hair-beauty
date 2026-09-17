import { useRef, useState } from 'react';
import { uploadImage, extractErrorMessage } from '../../api/client';

const MAX_SIZE_MB = 5;

// A single field that accepts either a pasted image URL or a file upload
// from the browser. Used for Service/Product/Gallery/Offer images and for
// the singleton Site Media slots (hero photo, bridal/party photos).
export default function ImageUploadField({ id, value, onChange, required = false }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // allow re-selecting the same file later

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image is too large — please choose a file under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(extractErrorMessage(err, 'Upload failed'));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste an image URL, or upload a file"
          required={required}
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn btn-outline btn-sm whitespace-nowrap disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
      {value && (
        <div className="mt-2.5 w-24 h-24 rounded-lg overflow-hidden border border-pink-200 bg-pink-50">
          <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.target.style.display = 'none')} />
        </div>
      )}
    </div>
  );
}
