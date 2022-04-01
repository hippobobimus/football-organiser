import styled from 'styled-components';
import { Icon, Title } from '../styles';

const Nav = styled.nav`
  display: flex;
  flex-direction: ${(props) => props.isMobile ? 'column' : 'row' };
  justify-content: space-around;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const MenuToggle = styled(Icon)`
  position: absolute;
  left: 3vw;
  height: min(2rem, 8vw);
`;

const NavTitle = styled(Title)`
  font-size: min(10vw, 3rem);
`;

export { MenuToggle, Nav, NavTitle };
