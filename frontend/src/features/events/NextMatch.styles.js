import styled from 'styled-components';
import { Carousel, CarouselItem } from '../../components/carousel';

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

export const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  margin-bottom: 20px;
`;

export const Status = styled.h3`
  font-family: ${(props) => props.theme.subtitleFont};
`;

export const GuestsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 5px;
`;

export const PlayerList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(10px, max-content);
  gap: 5px;
  width: 95%;
  height: 230px;
`;

export const PlayerListItem = styled.li`
  background-color: ${(props) => props.theme.playerListBgClr};
  border-radius: 5px;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 10px 5px 10px;
  font-size: 0.7rem;
`;

export const InfoList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 150px;
`;

export const InfoListItem = styled.li`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ContentCarousel = styled(Carousel)`
  width: 300px;
  height: 350px;
`;

export const ContentCarouselItem = styled(CarouselItem)`
  justify-content: flex-start;
  gap: 10px;
  margin-top: 10px;
`;
