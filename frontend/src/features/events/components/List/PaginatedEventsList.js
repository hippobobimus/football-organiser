import { useState } from 'react';

import { SmallButton } from '../../../../components/styles';
import { Spinner } from '../../../../components/Spinner';
import { DisplayError } from '../../../../components/DisplayError';
import { PaginationButtons } from '../../../../components/Pagination';
import { EventsList } from './EventsList';
import { useListEventsQuery } from '../../api/eventsApiSlice';

export const PaginatedEventsList = () => {
  const [page, setPage] = useState(1);
  const [finished, setFinished] = useState(false);

  const {
    data: eventsList,
    isLoading,
    isError,
    error,
  } = useListEventsQuery({ page, finished });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <DisplayError error={error} />;
  }

  const { docs: events, hasPrevPage, hasNextPage } = eventsList;

  const handlePageDown = () => {
    setPage((prev) => prev + 1);
  };

  const handlePageUp = () => {
    setPage((prev) => prev - 1);
  };

  const handlePastEventsClick = () => {
    setFinished(true);
    setPage(1);
  };

  const handleCurrentEventsClick = () => {
    setFinished(false);
    setPage(1);
  };

  return (
    <>
      <EventsList events={events} />
      <PaginationButtons
        onUpClick={handlePageUp}
        onDownClick={handlePageDown}
        upDisabled={!hasPrevPage}
        downDisabled={!hasNextPage}
      />
      {finished ? (
        <SmallButton type="button" onClick={handleCurrentEventsClick}>
          Show Current & Upcoming Events
        </SmallButton>
      ) : (
        <SmallButton type="button" onClick={handlePastEventsClick}>
          Show Past Events
        </SmallButton>
      )}
    </>
  );
};
