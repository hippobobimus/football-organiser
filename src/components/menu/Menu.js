import { NavLink } from 'react-router-dom';
import * as Styled from './Menu.styles';

function Menu({ items, isRow }) {
  const elements = items.map((item) =>
    <Styled.ListItem key={item.uid}>
      <NavLink className={({ isActive }) => isActive ? 'active' : ''} to={item.path}>
        {item.text}
      </NavLink>
    </Styled.ListItem>
  );

  return (
    <Styled.MenuList isRow={isRow}>
      {elements}
    </Styled.MenuList>
  );
}

export default Menu;
