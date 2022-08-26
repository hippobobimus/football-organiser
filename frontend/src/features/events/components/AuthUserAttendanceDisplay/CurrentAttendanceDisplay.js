import * as Styled from './styles';
import { SmallButton } from '../../../../components/styles';

export const CurrentAttendanceDisplay = ({
  eventCategory,
  isFull,
  guests,
  onLeave,
  onRemoveGuest,
  onAddGuest,
}) => {
  return (
    <Styled.SummaryContainer>
      <Styled.Status>
        {eventCategory === 'match' ? "You're Playing!" : "You're Attending!"}
      </Styled.Status>

      {guests > 0 ? (
        <Styled.GuestsContainer>
          <p>
            ...and bringing{' '}
            <u>
              <b>{guests} guest(s)</b>
            </u>
          </p>
          <SmallButton
            type="button"
            onClick={onRemoveGuest}
            disabled={guests === 0}
          >
            -
          </SmallButton>
          <SmallButton type="button" onClick={onAddGuest} disabled={isFull}>
            +
          </SmallButton>
        </Styled.GuestsContainer>
      ) : (
        <SmallButton type="button" onClick={onAddGuest} disabled={isFull}>
          Add a Guest
        </SmallButton>
      )}
      <SmallButton type="button" onClick={onLeave}>
        Cancel my attendance
      </SmallButton>
    </Styled.SummaryContainer>
  );
};
