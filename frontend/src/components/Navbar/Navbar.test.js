import { render, screen, createUser } from 'test-utils';

import { Navbar } from './Navbar';

describe('Navbar component', () => {
  const menuItems = [
    { uid: 0, text: 'Test123', path: '/test-path-0' },
    { uid: 1, text: 'Test456', path: '/test-path-1' },
    { uid: 2, text: 'Test789', path: '/test-path-2' },
  ];

  it('Renders correct menu items when user is logged in', () => {
    render(
      <Navbar title="test-title" menuItems={menuItems} widthThreshold={800} />,
      { user: createUser() }
    );

    menuItems.forEach((m) => {
      const elem = screen.getByText(m.text);
      expect(elem).toBeInTheDocument();
      expect(elem).toHaveAttribute('href', m.path);
    });
  });

  it('Should not display the navigation menu if the user is not logged in', () => {
    render(
      <Navbar title="test-title" menuItems={menuItems} widthThreshold={800} />
    );

    menuItems.forEach((m) => {
      const elem = screen.queryByText(m.text);
      expect(elem).not.toBeInTheDocument();
    });
  });
});
