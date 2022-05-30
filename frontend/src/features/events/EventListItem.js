import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { mdiAccountCheckOutline, mdiAccountGroupOutline } from '@mdi/js';

import * as Styled from './EventListItem.styles';

const EventListItem = ({ event }) => {
  const [formatted, setFormatted] = useState({
    date: '',
    start: '',
  });

  const { name, time } = event;

  // TODO dummy data
  const isAttending = true;
  const attendees = 12;

  useEffect(() => {
    if (time) {
      const { buildUp, start, end } = time;

      setFormatted({
        weekday: format(Date.parse(start), 'EEEE'),
        date: format(Date.parse(start), 'dd/LL/yy'),
        buildUp: format(Date.parse(buildUp), 'h:mmaaa'),
        start: format(Date.parse(start), 'h:mmaaa'),
        end: format(Date.parse(end), 'h:mmaaa'),
      });
    }
  }, [time]);

  return (
    <Styled.ListItem>
      <Styled.FieldsList>
        <Styled.DateField>
          <span>{formatted.weekday}</span>
          <span>{formatted.date}</span>
        </Styled.DateField>

        <Styled.TimeField>{formatted.start}</Styled.TimeField>

        <Styled.NameField>{name}</Styled.NameField>

        <Styled.AttendeesField>
          <Styled.FieldIcon path={mdiAccountGroupOutline} size={1} />
          <b>{attendees}</b>
        </Styled.AttendeesField>

        {isAttending && (
          <Styled.UserAttendanceField>
            <Styled.FieldIcon path={mdiAccountCheckOutline} size={1} />
          </Styled.UserAttendanceField>
        )}
      </Styled.FieldsList>
    </Styled.ListItem>
  );
};

export default EventListItem;
