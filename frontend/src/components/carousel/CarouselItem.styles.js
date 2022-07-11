import styled from 'styled-components';

export const CarouselItemContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  vertical-align: top;
  width: ${(props) => props.width};
  height: 100%;
`;
