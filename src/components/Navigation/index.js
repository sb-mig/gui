import {Nav, NavContainer} from "./styled/Navigation";
import {Link} from "react-router-dom";

const Navigation = () => {
  return (
      <NavContainer>
        <Nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </Nav>
      </NavContainer>
  )
}

export default Navigation