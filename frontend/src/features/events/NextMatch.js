import {
  Subtitle,
  Section,
  SectionHeading,
  SmallButton,
  Button,
} from '../../components/styles';
import * as Styled from './NextMatch.styles';

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
  // TODO dummy data
  const date = 'Saturday 1st Feb 2022';
  const buildUp = '9:15am';
  const kickOff = '9:30am';
  const endTime = '10:30am';
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
            {date}
          </Styled.InfoListItem>
          <Styled.InfoListItem>
            <span>Warm-Up:</span>
            <span>{buildUp}</span>
          </Styled.InfoListItem>
          <Styled.InfoListItem>
            <span>Kick-Off:</span>
            <span>{kickOff}</span>
          </Styled.InfoListItem>
          <Styled.InfoListItem>
            <span>Finishes:</span>
            <span>{endTime}</span>
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
  return (
    <Styled.ContentContainer>
      <Subtitle>Next Match</Subtitle>
      <CurrentUserSummary />
      <MatchDetails />
    </Styled.ContentContainer>
  );
};

export default NextMatch;
