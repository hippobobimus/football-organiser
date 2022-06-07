import styled from 'styled-components';

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

export const Status = styled.div`
  font-family: ${(props) => props.theme.subtitleFont};
  color: ${(props) => props.theme.alertTextClr};
  font-size: 1.5rem;
  text-shadow: 0px 5px 2px ${(props) => props.theme.carouselTextShadowClr};
`;
