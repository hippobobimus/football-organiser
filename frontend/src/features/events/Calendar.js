import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import { fetchEvents, selectAllEvents } from './eventsSlice';
import EventsList from './EventsList';

const Calendar = () => {
  const dispatch = useDispatch();

  const { status, message } = useSelector((state) => state.events);
  const events = useSelector(selectAllEvents);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <Spinner />;
  }

  if (status === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{message}</p>
      </>
    );
  }

  return (
    <>
      <Subtitle>Calendar</Subtitle>
      <EventsList events={events} />
    </>
  );
};

export default Calendar;
