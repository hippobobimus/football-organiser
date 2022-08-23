import * as Styled from './styles';
import { useGetEventQuery } from '../../api/eventsApiSlice';

export const EventStatus = ({ eventId }) => {
  const { data: event } = useGetEventQuery(eventId);

  return (
    <Styled.Status>
      {(event.isCancelled && 'Cancelled') ||
        (event.isFinished && 'Finished') ||
        (event.isFull && 'Event Full') ||
        'Places Available'}
    </Styled.Status>
  );
};
