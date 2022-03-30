import { getByText, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar component', () => {
  const menuItems = [
    { text: 'Test123', path: '/test-path' },
  ];

  test('Renders correct menu items', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Navbar menuItems={menuItems}/>
      </MemoryRouter>
    );

    menuItems.forEach((m) => {
      const elem = getByText(m.text);
      expect(elem).toBeInTheDocument();
      expect(elem).toHaveAttribute('href', m.path);
    });
  });
});
