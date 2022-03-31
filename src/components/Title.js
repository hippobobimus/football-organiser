import styled from 'styled-components';

const Title = styled.h1.attrs((props) => ({
  // dynamic styling with defaults.
  $size: props.$size || '3rem',
}))`
  color: ${(props) => props.theme.textClr};
  font-family: 'Londrina Sketch', cursive;
  font-size: ${(props) => props.$size};
  white-space: nowrap;
`;

export default Title;
