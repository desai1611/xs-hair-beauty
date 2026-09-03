import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ServiceCard from './ServiceCard';

function renderCard(service) {
  return render(
    <MemoryRouter>
      <ServiceCard service={service} />
    </MemoryRouter>
  );
}

describe('ServiceCard', () => {
  it('shows the price when set', () => {
    renderCard({ name: 'Full Colour', description: 'All-over colour.', price: 120, priceNote: 'From' });
    expect(screen.getByText('Full Colour')).toBeInTheDocument();
    expect(screen.getByText(/\$120/)).toBeInTheDocument();
  });

  it('shows "Price on consultation" when price is null', () => {
    renderCard({ name: 'Bridal Package', description: 'Custom package.', price: null });
    expect(screen.getByText('Price on consultation')).toBeInTheDocument();
  });
});
