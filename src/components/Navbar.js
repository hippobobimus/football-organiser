import { Link } from 'react-router-dom';

function Navbar(props) {
  const menuElements = props.menuItems.map((item) =>
    <li key={item.uid}>
      <Link to={item.path}>{item.text}</Link>
    </li>
  );

  return (
    <div>
      <ul>
        {menuElements}
      </ul>
    </div>
  );
}

export default Navbar;
