import { Outlet, useParams } from 'react-router-dom';

import { Subtitle } from '../../../../components/styles';
import { Spinner } from '../../../../components/Spinner';
import { DisplayError } from '../../../../components/DisplayError';
import { EventInfoBar } from '../EventInfoBar';
import { useGetEventQuery } from '../../api/eventsApiSlice';
import * as Styled from './styles';

export const EventMainLayout = () => {
  const { eventId } = useParams();
  const { data: event, isLoading, isError, error } = useGetEventQuery(eventId);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <DisplayError error={error} />;
  }

  if (eventId === 'next-match' && !event) {
    return <Subtitle>No upcoming matches...</Subtitle>;
  }

  return (
    <Styled.EventContainer>
      <Subtitle>{event.name}</Subtitle>
      <EventInfoBar eventId={eventId} />
      <Styled.EventBodyContainer>
        <Outlet />
      </Styled.EventBodyContainer>
    </Styled.EventContainer>
  );
};
