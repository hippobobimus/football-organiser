import { useMemo } from 'react';
import { format } from 'date-fns';
import Icon from '@mdi/react';
import {
  mdiClockOutline,
  mdiClockStart,
  mdiCalendarMonthOutline,
  mdiAccountGroupOutline,
  mdiArrowRightBoldOutline,
} from '@mdi/js';

import * as Styled from './styles';
import { useGetEventQuery } from '../../api/eventsApiSlice';

export const EventInfoList = ({ eventId }) => {
  const { data: event } = useGetEventQuery(eventId);

  const formattedTime = useMemo(() => {
    const { buildUp, start, end } = event.time;
    return {
      date: format(Date.parse(start), 'EEE do LLL yyyy'),
      buildUp: format(Date.parse(buildUp), 'h:mmaaa'),
      start: format(Date.parse(start), 'h:mmaaa'),
      end: format(Date.parse(end), 'h:mmaaa'),
    };
  }, [event]);

  return (
    <Styled.InfoList>
      <Styled.InfoEntry>
        <Icon path={mdiCalendarMonthOutline} size={1} title="Date" />
        <Styled.InfoText>{formattedTime.date}</Styled.InfoText>
      </Styled.InfoEntry>

      <Styled.InfoEntry>
        <Icon path={mdiClockStart} size={1} title="Arrive from" />
        <Styled.InfoText>
          {event.category === 'match' ? 'Warm-up' : 'Arrive-from'}{' '}
          {formattedTime.buildUp}
        </Styled.InfoText>
      </Styled.InfoEntry>

      <Styled.InfoEntry>
        <Icon path={mdiClockOutline} size={1} title="Time" />
        <Styled.InfoText>{formattedTime.start}</Styled.InfoText>
        <Icon path={mdiArrowRightBoldOutline} size={0.75} />
        <Styled.InfoText>{formattedTime.end}</Styled.InfoText>
      </Styled.InfoEntry>

      <Styled.InfoEntry>
        <Icon path={mdiAccountGroupOutline} size={1} title="Attendance" />
        <Styled.InfoText>
          {event.numAttendees} {event.capacity > 0 && ` / ${event.capacity}`}
        </Styled.InfoText>
      </Styled.InfoEntry>
    </Styled.InfoList>
  );
};
