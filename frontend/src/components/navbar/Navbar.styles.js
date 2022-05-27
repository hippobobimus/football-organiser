import styled, { css, keyframes } from 'styled-components';
import { Button, Container, Icon, Title } from '../styles';

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

const Nav = styled.nav`
  position: relative;

  display: flex;
  flex-direction: ${(props) => props.isMobile ? 'column' : 'row' };
  justify-content: ${(props) => props.isMobile ? 'flex-start' : 'space-around'};
  align-items: center;
  gap: 30px;

  padding: 15px;

  background-color: ${(props) => props.theme.bgClr};
`;

const MenuContainer = styled(Container)`
  background-color: ${(props) => props.theme.bgClr};

  flex-direction: ${(props) => props.isRow ? 'row' : 'column'};
  justify-content: flex-start;
  gap: 30px;
  z-index: 999;

  ${(props) => !props.isRow && columnMixin};
`;

const MenuToggle = styled(Icon)`
  position: absolute;
  left: 3vw;
  height: min(2rem, 8vw);
`;

const NavTitle = styled(Title)`
  font-size: min(10vw, 3rem);
`;

const NavButton = styled(Button)`
  background-color: ${(props) => props.theme.navButtonClr};
  color: ${(props) => props.theme.navButtonTextClr};

  &:hover {
    background-color: ${(props) => props.theme.navButtonHoverClr};
  }
`;

export { MenuContainer, MenuToggle, Nav, NavTitle, NavButton };
