import { Outlet, useParams } from 'react-router-dom';

import { Spinner } from '../../../../components/spinner';
import { DisplayError } from '../../../../components/DisplayError';
import { EventInfoBar } from '../EventInfoBar';
import { useGetEventQuery } from '../../api/eventsApiSlice';

export const EventLayout = () => {
  const { eventId } = useParams();
  const { isLoading, isError, error } = useGetEventQuery(eventId);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <DisplayError error={error} />;
  }

  return (
    <>
      <EventInfoBar eventId={eventId} />
      <Outlet />
    </>
  );
};
