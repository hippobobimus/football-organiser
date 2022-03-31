import { NavLink } from 'react-router-dom';

function Menu({ items }) {
  const elements = items.map((item) =>
    <li key={item.uid}>
      <NavLink className={({ isActive }) => isActive ? 'active' : ''} to={item.path}>
        {item.text}
      </NavLink>
    </li>
  );

  return (
    <ul>
      {elements}
    </ul>
  );
}

export default Menu;
