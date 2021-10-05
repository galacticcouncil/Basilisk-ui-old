import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders a greeting element', () => {
  render(<App />);
  const greetingElement = screen.getByText(/Today is/i);
  expect(greetingElement).toBeInTheDocument();
});
