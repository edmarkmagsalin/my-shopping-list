import { render, screen } from '@testing-library/react';
import App from './App';

test('renders MY SHOPPING LIST title', () => {
  render(<App />);
  const title = screen.getByText(/MY SHOPPING LIST/i);
  expect(title).toBeInTheDocument();
});
