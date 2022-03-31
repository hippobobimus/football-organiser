import { useEffect, useState } from 'react';
import './Navbar.css';
import MenuImg from '../assets/menu.svg';
import Menu from './Menu';
import MenuToggle from './MenuToggle';
import Title from './Title';

function Navbar({ title, menuItems }) {
  // menu switches to a dropdown at this threshold.
  const widthThreshold = 800;

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
    <div className='navbar'>
      <div className='title-container'>
        {(screenWidth < widthThreshold) &&
          <MenuToggle imageSrc={MenuImg} onClickHandler={toggleMenu} />
        }
        <Title text={title} />
      </div>
      {(menuIsVisible || screenWidth > widthThreshold) &&
        <Menu items={menuItems} />
      }
    </div>
  );
}

export default Navbar;
