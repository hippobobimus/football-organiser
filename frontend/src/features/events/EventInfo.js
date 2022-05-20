import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

import { Section, SectionHeading } from '../../components/styles';
import * as Styled from './EventInfo.styles';
import { selectEventById } from './eventsSlice';

const EventInfo = ({ eventId }) => {
  const event = useSelector((state) => selectEventById(state, eventId));

  const [formatted, setFormatted] = useState({
    date: '',
    buildUp: '',
    start: '',
    end: '',
  });

  useEffect(() => {
    if (event) {
      const { buildUp, start, end } = event.time;

      setFormatted({
        date: format(Date.parse(start), 'EEEE do LLL yyyy'),
        buildUp: format(Date.parse(buildUp), 'h:mmaaa'),
        start: format(Date.parse(start), 'h:mmaaa'),
        end: format(Date.parse(end), 'h:mmaaa'),
      });
    }
  }, [event]);

  // TODO dummy data
  const location = {
    name: 'Powerleague Watford',
    number: '',
    street: 'Aldenham Road',
    city: 'Watford',
    postcode: 'WD23 2TY',
  };

  if (!event) {
    return <p>No event</p>;
  }

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

export default EventInfo;
