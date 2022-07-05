import styled from "styled-components";
import { Carousel, CarouselItem } from "../../components/carousel";

export const CarouselContainer = styled.div`
  background-color: ${(props) => props.theme.eventCarouselBgClr};
  border-radius: 25px;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
  width: 100%;
`;

export const ContentCarousel = styled(Carousel)`
  width: 300px;
  height: 320px;
`;

export const ContentCarouselItem = styled(CarouselItem)`
  justify-content: center;
  gap: 10px;
`;
