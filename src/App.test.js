import { render, screen } from '@testing-library/react';

test('renders', () => {
  render(<App />);
  const linkElement = screen.getByText(/Weather/i);
  expect(linkElement).toBeInTheDocument();
});
