export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-text-light">
      <div className="w-9 h-9 rounded-full border-3 border-pink-200 border-t-pink-600 animate-spin mb-3" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorMessage({ message }) {
  return (
    <div className="text-center py-16">
      <p className="text-pink-700 font-semibold mb-1">Couldn't load this content</p>
      <p className="text-sm text-text-light">{message}</p>
    </div>
  );
}
