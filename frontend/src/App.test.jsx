import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Home/other pages call the API on mount; stub axios so the smoke test
// doesn't depend on a running backend.
vi.mock('./api/client', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
  extractErrorMessage: () => 'error',
}));

function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('App routing', () => {
  it('renders the Home page hero at "/"', () => {
    renderApp('/');
    expect(screen.getByText(/Look & feel your/i)).toBeInTheDocument();
  });

  it('renders the Contact page at "/contact"', () => {
    renderApp('/contact');
    expect(screen.getByText(/We'd love to hear from you/i)).toBeInTheDocument();
  });

  it('renders NotFound for an unknown route', () => {
    renderApp('/this-page-does-not-exist');
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });

  it('renders the admin login page at "/admin/login"', () => {
    renderApp('/admin/login');
    expect(screen.getByText(/Admin Dashboard Login/i)).toBeInTheDocument();
  });
});
