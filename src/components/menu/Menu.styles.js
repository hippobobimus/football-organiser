import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const ListItem = styled.li`
  display: flex;
  align-items: center;

  font-family: ${(props) => props.theme.subtitleFont};
  font-size: 1.5rem;
  text-decoration: none;
`;

const MenuList = styled.ul`
  display: flex;
  flex-direction: ${(props) => props.isRow ? 'row' : 'column'};
  align-items: center;
  gap: 15px;

  list-style: none;
`;

const MenuNavLink = styled(NavLink)`
  
  &.active,
  &:hover {
    text-shadow: 0px 5px 2px ${(props) => props.theme.textShadowClr};
    transform: translate(-0px, -3px);
  }

  &:active {
    text-shadow: none;
    transform: none;
  }
`

export { ListItem, MenuList, MenuNavLink };
