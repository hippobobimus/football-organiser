import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

export { Container, Icon, Title };
