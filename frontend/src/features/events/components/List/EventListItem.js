import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { mdiAccountCheckOutline, mdiAccountGroupOutline } from '@mdi/js';

import * as Styled from './EventListItem.styles';

export const EventListItem = ({ event }) => {
  const navigate = useNavigate();

  const { name, time, numAttendees, authUserAttendee } = event;

  const formattedTime = useMemo(() => {
    const { start } = time;

    return {
      weekday: format(Date.parse(start), 'EEEE'),
      date: format(Date.parse(start), 'dd/LL/yy'),
      start: format(Date.parse(start), 'h:mmaaa'),
    };
  }, [time]);

  const handleClick = () => {
    navigate(`${event.id}`);
  };

  return (
    <li>
      <Styled.ListItemButton type="button" onClick={handleClick}>
        <Styled.FieldsList>
          <Styled.DateField>
            <span>{formattedTime.weekday}</span>
            <span>{formattedTime.date}</span>
          </Styled.DateField>

          <Styled.TimeField>{formattedTime.start}</Styled.TimeField>

          <Styled.NameField>{name}</Styled.NameField>

          <Styled.IconContainer>
            <Styled.AttendeesField>
              <Styled.FieldIcon
                path={mdiAccountGroupOutline}
                size={1}
                title="Attendance"
              />
              <b>{numAttendees === 0 ? '-' : numAttendees}</b>
            </Styled.AttendeesField>

            {authUserAttendee && (
              <Styled.UserAttendanceField>
                <Styled.FieldIcon
                  path={mdiAccountCheckOutline}
                  size={1}
                  title="You are attending"
                />
              </Styled.UserAttendanceField>
            )}
          </Styled.IconContainer>
        </Styled.FieldsList>
      </Styled.ListItemButton>
    </li>
  );
};
