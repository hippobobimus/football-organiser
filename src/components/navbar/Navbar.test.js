import { getByText, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar component', () => {
  const menuItems = [
    { uid: 0, text: 'Test123', path: '/test-path-0' },
    { uid: 1, text: 'Test456', path: '/test-path-1' },
    { uid: 2, text: 'Test789', path: '/test-path-2' },
  ];

  test('Renders correct menu items', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Navbar title='test-title' menuItems={menuItems} widthThreshold={800}/>
      </MemoryRouter>
    );

    menuItems.forEach((m) => {
      const elem = getByText(m.text);
      expect(elem).toBeInTheDocument();
      expect(elem).toHaveAttribute('href', m.path);
    });
  });
});
