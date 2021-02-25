import { getByTestId, render, screen } from '@testing-library/react';
import App from './App';

test('renders', () => {
  render(<App />);
  const linkElement = screen.getAllByText(/Weather/i);
  expect(linkElement[0]).toBeInTheDocument();
});

test('form requires input', () => {
  render(<App />);
  let cityNameInput = document.getElementById('formCity');
  let fakeDelayInput = document.getElementById('delay-form');
  expect(cityNameInput).toBeRequired();
  expect(fakeDelayInput).toBeRequired();
  // expect(getByTestId('fake-delay-input')).toBeRequired();
})

test('focus on form upon page load', () => {
  render(<App />);
  let cityNameInput = document.getElementById('formCity');
  expect(cityNameInput).toHaveFocus();
})