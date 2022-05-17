import styled from 'styled-components';

export const CarouselContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 300px;
  height: 300px;
`;

export const InnerCarouselContainer = styled.div`
  flex: 1;
  white-space: nowrap;
  transform: translateX(${(props) => props.transform}%);
  transition: transform 0.3s;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 5px;
`;

export const CarouselNav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CarouselNavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

export const CarouselNavItem = styled.li`
  font-family: ${(props) => props.theme.subtitleFont};
  font-size: 1.2rem;

  ${(props) =>
    props.isActive &&
    `
    text-shadow: 0px 5px 2px ${props.theme.carouselTextShadowClr};
    transform: translate(-0px, -3px);
  `}

  &:hover {
    cursor: pointer;
    text-shadow: 0px 5px 2px ${(props) => props.theme.carouselTextShadowClr};
    transform: translate(-0px, -3px);
  }

  &:active {
    text-shadow: none;
    transform: none;
  }
`;
