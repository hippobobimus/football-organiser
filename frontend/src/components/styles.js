import { Link as ReactRouterLink } from 'react-router-dom';
import styled from 'styled-components';

export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

export const Button = styled.button`
  cursor: pointer;
  border-radius: 5px;
  border: none;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  font-family: ${(props) => props.theme.buttonFont};
  font-size: 1rem;
  background-color: ${(props) => props.theme.buttonClr};
  color: ${(props) => props.theme.buttonTextClr};
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover,
  &:disabled,
  &:enabled:active {
    background-color: ${(props) => props.theme.buttonHoverClr};
  }

  &:enabled:active {
    transform: translate(3px, 3px);
    box-shadow: none;
  }
`;

export const SmallButton = styled(Button)`
  padding: 2px 10px;
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
`;

export const Content = styled(Container)`
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  height: 100%;
  padding: 10px min(5%, 5000px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  background: repeating-linear-gradient(
    45deg,
    ${(props) => props.theme.fgClr},
    ${(props) => props.theme.fgClr} 80px,
    ${(props) => props.theme.fgClrDark} 80px,
    ${(props) => props.theme.fgClrDark} 160px
  );
`;

export const Link = styled(ReactRouterLink)`
  color: ${(props) => props.theme.linkTextClr};
  text-decoration: underline;

  &:hover {
    font-weight: bold;
  }
`;

export const Title = styled.h1`
  color: ${(props) => props.theme.textClr};
  font-family: ${(props) => props.theme.titleFont};
  font-size: 2rem;
  font-weight: bold;
  white-space: nowrap;
`;

export const Subtitle = styled.h2`
  color: ${(props) => props.theme.textClr};
  font-family: ${(props) => props.theme.subtitleFont};
  font-size: 1.8rem;
  white-space: nowrap;
  align-text: center;
`;

export const SectionHeading = styled.h3`
  color: ${(props) => props.theme.textClr};
  font-family: ${(props) => props.theme.subtitleFont};
  font-size: 1.2rem;
  white-space: nowrap;
  align-text: center;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;
