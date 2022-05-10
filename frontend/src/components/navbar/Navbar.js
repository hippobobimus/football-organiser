import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import * as Styled from './Navbar.styles';
import { Container } from '../styles';
import MenuImg from './assets/menu.svg';
import Menu from '../menu/Menu';
import { logout } from '../../features/auth/authSlice';

function Navbar({ title, menuItems, widthBreakpoint }) {
  const [menuIsVisible, setMenuIsVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);

    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    setIsMobile(screenWidth < widthBreakpoint);
  }, [screenWidth, widthBreakpoint]);

  useEffect(() => {
    // ensure menu is initially hidden when switching to mobile view.
    if (isMobile) {
      setMenuIsVisible(false);
    }
  }, [isMobile]);

  useEffect(() => {
    // close menu on path change.
    setMenuIsVisible(false);
  }, [pathname]);

  const toggleMenu = () => {
    setMenuIsVisible(!menuIsVisible);
  };

  const handleLogout = () => {
    dispatch(logout());
    setMenuIsVisible(false);
    navigate('/');
  };

  return (
    <Styled.Nav isMobile={isMobile}>
      <Container>
        {isMobile && <Styled.MenuToggle src={MenuImg} onClick={toggleMenu} />}
        <Styled.NavTitle>{title}</Styled.NavTitle>
      </Container>
      {(menuIsVisible || !isMobile) && (
        <Styled.MenuContainer isRow={!isMobile}>
          <Menu isRow={!isMobile} items={menuItems} />
          {user && (
            <Styled.NavButton onClick={handleLogout}>Logout</Styled.NavButton>
          )}
        </Styled.MenuContainer>
      )}
    </Styled.Nav>
  );
}

export default Navbar;
