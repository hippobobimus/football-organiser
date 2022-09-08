import styled from 'styled-components';

import { Container } from '../../../../components/styles';

export const EventContainer = styled(Container)`
  width: min(100%, 750px);
`;

export const EventBodyContainer = styled(Container)`
  justify-content: flex-start;
  width: 100%;
  height: 100%;
`;

export const TabsNavContainer = styled(Container)`
  width: 100%;
  padding: 10px;
  border-bottom: 2px solid black;
  background-color: ${(props) => props.theme.eventContentNavBgClr};
  border-radius: 25px 25px 0 0;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
`;

export const ContentCard = styled(Container)`
  width: 100%;
  height: 100%;
  min-height: 350px;
  background-color: ${(props) => props.theme.eventContentBgClr};
  border-radius: 25px;
  box-shadow: 3px 3px 2px ${(props) => props.theme.boxShadowClr};
  gap: 0;
`;

export const TabBodyContainer = styled(Container)`
  width: 100%;
  height: 100%;
`;
