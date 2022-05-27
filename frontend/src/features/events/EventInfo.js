import { useEffect, useState } from 'react';
import { format } from 'date-fns';

import { Section, SectionHeading } from '../../components/styles';
import * as Styled from './EventInfo.styles';

const EventInfo = ({ event, location }) => {
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
            <span>{event.category === 'match' ? 'Warm Up' : 'Arrive From'}:</span>
            <span>{formatted.buildUp}</span>
          </Styled.InfoListItem>
          <Styled.InfoListItem>
            <span>{event.category === 'match' ? 'Kick-Off' : 'Starts'}:</span>
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
