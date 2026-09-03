import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="py-32 px-6 text-center">
      <span className="eyebrow">404</span>
      <h1 className="text-4xl mb-4">Page not found</h1>
      <p className="text-text-light mb-8">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </section>
  );
}
