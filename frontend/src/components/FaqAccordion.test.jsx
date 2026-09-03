import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FaqAccordion from './FaqAccordion';

const items = [
  { q: 'Question one?', a: 'Answer one.' },
  { q: 'Question two?', a: 'Answer two.' },
];

describe('FaqAccordion', () => {
  it('renders all questions', () => {
    render(<FaqAccordion items={items} />);
    expect(screen.getByText('Question one?')).toBeInTheDocument();
    expect(screen.getByText('Question two?')).toBeInTheDocument();
  });

  it('opens the first item by default and toggles on click', () => {
    render(<FaqAccordion items={items} />);
    const secondQuestion = screen.getByText('Question two?');
    fireEvent.click(secondQuestion);
    expect(screen.getByText('Answer two.')).toBeInTheDocument();
  });
});
