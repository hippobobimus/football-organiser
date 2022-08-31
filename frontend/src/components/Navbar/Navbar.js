import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { mdiMenu } from '@mdi/js';

import * as Styled from './Navbar.styles';
import { Container } from '../styles';
import Menu from '../menu/Menu';
import { reset } from '../../features/events/eventsSlice';

export const Navbar = ({ title, menuItems, widthBreakpoint }) => {
  const dispatch = useDispatch();
  const [menuIsVisible, setMenuIsVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);
  const { pathname } = useLocation();

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
    dispatch(reset());
  }, [dispatch, pathname]);

  const toggleMenu = () => {
    setMenuIsVisible(!menuIsVisible);
  };

  return (
    <Styled.Nav isMobile={isMobile}>
      <Container>
        {isMobile && (
          <Styled.MenuToggle path={mdiMenu} title="Menu" onClick={toggleMenu} />
        )}
        <Styled.NavTitle>{title}</Styled.NavTitle>
      </Container>
      {(menuIsVisible || !isMobile) && (
        <Styled.MenuContainer isRow={!isMobile}>
          <Menu isRow={!isMobile} items={menuItems} />
        </Styled.MenuContainer>
      )}
    </Styled.Nav>
  );
};
