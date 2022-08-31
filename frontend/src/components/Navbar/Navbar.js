import { useEffect, useState } from 'react';
import { mdiMenu } from '@mdi/js';

import * as Styled from './Navbar.styles';
import { Container } from '../styles';
import { Menu } from '../Menu';
import { useSelector } from 'react-redux';

const NavMenu = ({ menuItems, isRow, onClick }) => {
  return (
    <Styled.MenuContainer isRow={isRow}>
      <Menu isRow={isRow} items={menuItems} onClick={onClick} />
    </Styled.MenuContainer>
  );
};

const Logo = ({ title }) => {
  return <Styled.NavTitle>{title}</Styled.NavTitle>;
};

const Toggle = ({ onClick }) => {
  return <Styled.MenuToggle path={mdiMenu} title="Menu" onClick={onClick} />;
};

export const Navbar = ({ title, menuItems, widthBreakpoint }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isCollapsed = screenWidth < widthBreakpoint;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isOpen, setIsOpen] = useState(false);

  const showToggle = isLoggedIn && isCollapsed;
  const showMenu = isLoggedIn && (!isCollapsed || isOpen);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <Styled.Nav isMobile={isCollapsed}>
      <Container>
        {showToggle && <Toggle onClick={handleToggle} />}
        <Logo title={title} />
      </Container>
      {showMenu && (
        <NavMenu
          menuItems={menuItems}
          isRow={!isCollapsed}
          onClick={handleMenuClick}
        />
      )}
    </Styled.Nav>
  );
};
