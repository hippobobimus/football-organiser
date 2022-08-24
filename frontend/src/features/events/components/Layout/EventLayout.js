import { Outlet, useParams } from 'react-router-dom';

import { Subtitle } from '../../../../components/styles';
import { Spinner } from '../../../../components/spinner';
import { DisplayError } from '../../../../components/DisplayError';
import { EventInfoBar } from '../EventInfoBar';
import { EventContentContainer } from './EventContentContainer';
import { useGetEventQuery } from '../../api/eventsApiSlice';
import * as Styled from './EventLayout.styles';

export const EventLayout = ({ navItems }) => {
  const { eventId } = useParams();
  const { data: event, isLoading, isError, error } = useGetEventQuery(eventId);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <DisplayError error={error} />;
  }

  return (
    <Styled.ContentContainer>
      <Subtitle>{event.name}</Subtitle>
      <EventInfoBar eventId={eventId} />
      <EventContentContainer navItems={navItems}>
        <Outlet />
      </EventContentContainer>
    </Styled.ContentContainer>
  );
};
