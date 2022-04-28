import { NavLink } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

const rotateX = keyframes`
  0% {
    transform: rotateX(-90deg);
  }

  100% {
    transform: rotateX(0deg);
  }
`;

const animationMixin = css`
  animation: ${rotateX} 700ms ease-in-out forwards;
  transform-origin: top center;
`;

const columnMixin = css`
    position: absolute;
    top: 100%;
    width: 100%;
    height: calc(100vh - 100%);

    flex-direction: column;

    padding: 20px;

    ${animationMixin}
`;

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

  background-color: ${(props) => props.theme.bgClr};
  list-style: none;

  ${(props) => !props.isRow && columnMixin};
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
