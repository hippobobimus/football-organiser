import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  ButtonRow,
  SmallButton,
  Subtitle,
} from "../../components/styles";
import { Spinner } from "../../components/spinner";
import PaginationButtons from "../../components/pagination/PaginationButtons";
import { fetchEvents, selectAllEvents } from "./eventsSlice";
import EventsList from "./EventsList";

const Calendar = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [finished, setFinished] = useState(false);

  const authUser = useSelector((state) => state.auth.authUser);

  const { fetchStatus, fetchMessage, pagination } = useSelector(
    (state) => state.events
  );
  const events = useSelector(selectAllEvents);

  useEffect(() => {
    dispatch(fetchEvents({ page, finished }));
  }, [dispatch, finished, page]);

  if (fetchStatus === "loading" || fetchStatus === "idle") {
    return <Spinner />;
  }

  if (fetchStatus === "error") {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{fetchMessage}</p>
      </>
    );
  }

  const handlePageDown = () => {
    setPage((prev) => prev + 1);
  };

  const handlePageUp = () => {
    setPage((prev) => prev - 1);
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
        upDisabled={!pagination?.hasPrevPage}
        downDisabled={!pagination?.hasNextPage}
      />
      {finished ? (
        <SmallButton type="button" onClick={() => setFinished(false)}>
          Show Current & Upcoming Events
        </SmallButton>
      ) : (
        <SmallButton type="button" onClick={() => setFinished(true)}>
          Show Past Events
        </SmallButton>
      )}
    </>
  );
};

export default Calendar;
