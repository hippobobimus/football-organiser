import { useEffect, useState } from 'react';
import * as Styled from './Navbar.styles';
import { Container } from '../styles';
import MenuImg from './assets/menu.svg';
import Menu from '../menu/Menu';

function Navbar({ title, menuItems, widthBreakpoint }) {
  const [menuIsVisible, setMenuIsVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);

    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    setIsMobile(screenWidth < widthBreakpoint);
  }, [screenWidth]);

  useEffect(() => {
    // ensure menu is initially hidden when switching to mobile view.
    if (isMobile) {
      setMenuIsVisible(false);
    }
  }, [isMobile]);

  const toggleMenu = () => {
    setMenuIsVisible(!menuIsVisible);
  };

  return (
    <Styled.Nav isMobile={isMobile}>
      <Container>
        {(isMobile) &&
          <Styled.MenuToggle src={MenuImg} onClick={toggleMenu} />
        }
        <Styled.NavTitle>{title}</Styled.NavTitle>
      </Container>
      {(menuIsVisible || !isMobile) &&
        <Menu isRow={!isMobile} items={menuItems} />
      }
    </Styled.Nav>
  );
}

export default Navbar;
