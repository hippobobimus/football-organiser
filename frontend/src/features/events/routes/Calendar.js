import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  ButtonRow,
  SmallButton,
  Subtitle,
} from '../../../components/styles';
import { Spinner } from '../../../components/spinner';
import PaginationButtons from '../../../components/pagination/PaginationButtons';
import EventsList from '../EventsList';

import { DisplayError } from '../../../components/DisplayError';
import { useListEventsQuery } from '../api/eventsApiSlice';
import { useGetAuthUserQuery } from '../../auth/api/authApiSlice';

export const Calendar = () => {
  const [page, setPage] = useState(1);
  const [finished, setFinished] = useState(false);

  const {
    data: eventsList,
    isLoading,
    isError,
    error,
  } = useListEventsQuery({ page, finished });
  const { data: authUser } = useGetAuthUserQuery();

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
      <Subtitle>Calendar</Subtitle>
      {authUser.isAdmin && (
        <ButtonRow>
          <Button as={Link} to="/create-match">
            New Match
          </Button>
          <Button as={Link} to="/create-social">
            New Social
          </Button>
        </ButtonRow>
      )}
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
