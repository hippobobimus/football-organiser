import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/lineup'>Lineup</Link>
        </li>
        <li>
          <Link to='/weather'>Weather</Link>
        </li>
        <li>
          <Link to='/location'>Location</Link>
        </li>
        <li>
          <Link to='/faq'>FAQ</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
