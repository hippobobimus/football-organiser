import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled(Container)`
  flex-direction: column;

  background: repeating-linear-gradient(
    45deg,
    ${(props) => props.theme.fgClr},
    ${(props) => props.theme.fgClr} 80px,
    ${(props) => props.theme.fgClrDark} 80px,
    ${(props) => props.theme.fgClrDark} 160px
  );
  border-radius: 25px;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  padding: 20px;

  min-width: 100%;
  min-height: 90%;
`;

const Content = styled(Container)`
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  height: 100%;
  padding: 20px min(10%, 5000px);
  flex-direction: column;
  justify-content: flex-start;

  background-color: ${(props) => props.theme.bgClr};
`;

const Icon = styled.img`
  height: 1rem;

  &:hover {
    cursor: pointer;
  }
`;

const Title = styled.h1`
  color: ${(props) => props.theme.textClr};
  font-family: ${(props) => props.theme.titleFont};
  font-size: 2rem;
  white-space: nowrap;
`;

const Subtitle = styled.h2`
  color: ${(props) => props.theme.textClr};
  font-family: ${(props) => props.theme.subtitleFont};
  font-size: 1.8rem;
  white-space: nowrap;
  align-text: center;
`;

export { Card, Container, Content, Icon, Subtitle, Title };
