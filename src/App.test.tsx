import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders add note button', () => {
  render(<App />);
  const button = screen.getByText(/add a new note/i);
  expect(button).toBeInTheDocument();
});
