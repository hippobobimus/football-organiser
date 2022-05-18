import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

import {
  Subtitle,
  Section,
  SectionHeading,
  SmallButton,
  Button,
} from '../../components/styles';
import * as Styled from './NextMatch.styles';
import { getNextMatch } from './eventsSlice';

const CurrentUserSummary = () => {
  // TODO dummy data
  const isAttending = true;
  const guests = 1;

  return (
    <Styled.SummaryContainer>
      {isAttending ? (
        <>
          <Styled.Status>You're Playing!</Styled.Status>
          {guests ? (
            <Styled.GuestsContainer>
              <p>
                ...and bringing{' '}
                <u>
                  <b>{guests} guest(s)</b>
                </u>
              </p>
              <SmallButton>-</SmallButton>
              <SmallButton>+</SmallButton>
            </Styled.GuestsContainer>
          ) : (
            <SmallButton>Add a Guest</SmallButton>
          )}
        </>
      ) : (
        <Button>Count Me In!</Button>
      )}
    </Styled.SummaryContainer>
  );
};

const MatchInfo = () => {
  const dispatch = useDispatch();
  const { status, nextMatch } = useSelector((state) => state.events);

  const [formatted, setFormatted] = useState({
    date: '',
    buildUp: '',
    start: '',
    end: '',
  });

  useEffect(() => {
    //    if (status === 'idle') {
    //      dispatch(getNextMatch());
    //    }

    if (status === 'success') {
      const { buildUp, start, end } = nextMatch.time;

      setFormatted({
        date: format(Date.parse(start), 'EEEE do LLL yyyy'),
        buildUp: format(Date.parse(buildUp), 'h:mmaaa'),
        start: format(Date.parse(start), 'h:mmaaa'),
        end: format(Date.parse(end), 'h:mmaaa'),
      });
    }
  }, [dispatch, nextMatch, status]);

  // TODO dummy data
  const location = {
    name: 'Powerleague Watford',
    number: '',
    street: 'Aldenham Road',
    city: 'Watford',
    postcode: 'WD23 2TY',
  };

  return (
    <>
      <Section>
        <SectionHeading>When</SectionHeading>
        <Styled.InfoList>
          <Styled.InfoListItem style={{ justifyContent: 'center' }}>
            {formatted.date}
          </Styled.InfoListItem>
          <Styled.InfoListItem>
            <span>Warm-Up:</span>
            <span>{formatted.buildUp}</span>
          </Styled.InfoListItem>
          <Styled.InfoListItem>
            <span>Kick-Off:</span>
            <span>{formatted.start}</span>
          </Styled.InfoListItem>
          <Styled.InfoListItem>
            <span>Finishes:</span>
            <span>{formatted.end}</span>
          </Styled.InfoListItem>
        </Styled.InfoList>
      </Section>
      <Section>
        <SectionHeading>Where</SectionHeading>
        <p>{location.name}</p>
        <p>
          {location.number} {location.street}
        </p>
        <p>{location.city}</p>
        <p>{location.postcode}</p>
      </Section>
    </>
  );
};

const MatchLineup = () => {
  // TODO dummy data
  const players = [
    'John Smith',
    'Amy Mukherjee',
    'Bill Smalls',
    'Cara Chow',
    'John Smith',
    'Amy Mukherjee',
    'Bill Smalls',
    'Cara Chow',
    'John Smith',
    'Amy Mukherjee',
    'Bill Smalls',
    'Cara Chow',
    'John Smith',
    'Amy Mukherjee',
    'Bill Smalls',
    'Cara Chow',
    'Cara Chow',
    'John Smith',
    'Amy Mukherjee',
    'Bill Smalls',
    'Cara Chow',
  ];
  const totalPlayers = players.length;

  return (
    <Section style={{ width: '100%' }}>
      <SectionHeading>{totalPlayers} Players</SectionHeading>
      <Styled.PlayerList>
        {players.map((player, idx) => (
          <Styled.PlayerListItem key={idx}>
            <span>{player}</span>
          </Styled.PlayerListItem>
        ))}
      </Styled.PlayerList>
    </Section>
  );
};

const MatchDetails = () => {
  return (
    <Styled.ContentCarousel headings={['Info', 'Lineup', 'Weather']}>
      <Styled.ContentCarouselItem>
        <MatchInfo />
      </Styled.ContentCarouselItem>

      <Styled.ContentCarouselItem>
        <MatchLineup />
      </Styled.ContentCarouselItem>

      <Styled.ContentCarouselItem>
        <div>Weather</div>
      </Styled.ContentCarouselItem>
    </Styled.ContentCarousel>
  );
};

const NextMatch = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.events);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getNextMatch());
    }
  }, [status, dispatch]);

  return (
    <Styled.ContentContainer>
      <Subtitle>Next Match</Subtitle>
      <CurrentUserSummary />
      <MatchDetails />
    </Styled.ContentContainer>
  );
};

export default NextMatch;
