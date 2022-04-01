import { useEffect, useState } from 'react';
import './Navbar.css';
import * as Styled from './Navbar.styles';
import MenuImg from './assets/menu.svg';
import Menu from './Menu';
import MenuToggle from './MenuToggle';
import Title from '../Title';

function Navbar({ title, menuItems, widthThreshold }) {
  const [menuIsVisible, setMenuIsVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);

    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const toggleMenu = () => {
    setMenuIsVisible(!menuIsVisible);
  };

  return (
    <Styled.Nav>
      <div className='title-container'>
        {(screenWidth < widthThreshold) &&
          <MenuToggle imageSrc={MenuImg} onClickHandler={toggleMenu} />
        }
        <Title>{title}</Title>
      </div>
      {(menuIsVisible || screenWidth > widthThreshold) &&
        <Menu items={menuItems} />
      }
    </Styled.Nav>
  );
}

export default Navbar;
