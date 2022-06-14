import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { mdiAccountCheckOutline, mdiAccountGroupOutline } from '@mdi/js';

import * as Styled from './EventListItem.styles';
import { reset } from './eventsSlice';

const EventListItem = ({ event }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formatted, setFormatted] = useState({
    date: '',
    start: '',
  });

  const { name, time, numAttendees, authUserAttendee } = event;

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

  const handleClick = () => {
    dispatch(reset());
    navigate(`/events/${event.id}`);
  };

  return (
    <li>
      <Styled.ListItemButton type='button' onClick={handleClick}>
        <Styled.FieldsList>
          <Styled.DateField>
            <span>{formatted.weekday}</span>
            <span>{formatted.date}</span>
          </Styled.DateField>

          <Styled.TimeField>{formatted.start}</Styled.TimeField>

          <Styled.NameField>{name}</Styled.NameField>

          <Styled.IconContainer>
            <Styled.AttendeesField>
              <Styled.FieldIcon path={mdiAccountGroupOutline} size={1} title='Attendance' />
              <b>{numAttendees === 0 ? '-' : numAttendees}</b>
            </Styled.AttendeesField>

            {authUserAttendee && (
              <Styled.UserAttendanceField>
                <Styled.FieldIcon path={mdiAccountCheckOutline} size={1} title='You are attending'/>
              </Styled.UserAttendanceField>
            )}
          </Styled.IconContainer>
        </Styled.FieldsList>
      </Styled.ListItemButton>
    </li>
  );
};

export default EventListItem;
