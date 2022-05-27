import styled from 'styled-components';
import { Carousel, CarouselItem } from '../../components/carousel';

export const ContentCarousel = styled(Carousel)`
  width: 300px;
  height: 350px;
`;

export const ContentCarouselItem = styled(CarouselItem)`
  justify-content: flex-start;
  gap: 10px;
  margin-top: 10px;
`;
