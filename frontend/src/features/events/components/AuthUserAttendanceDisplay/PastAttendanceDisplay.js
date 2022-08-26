import * as Styled from './styles';

export const PastAttendanceDisplay = ({ attended, eventCategory, guests }) => {
  return (
    <Styled.SummaryContainer>
      {attended ? (
        <>
          <Styled.Status>
            {eventCategory === 'match' ? 'You played!' : 'You attended!'}
          </Styled.Status>
          {guests > 0 && (
            <Styled.GuestsContainer>
              <p>
                ...and brought{' '}
                <u>
                  <b>{guests} guest(s)</b>
                </u>
              </p>
            </Styled.GuestsContainer>
          )}
        </>
      ) : (
        <Styled.Status>
          {eventCategory === 'match' ? "You didn't play" : "You didn't attend"}
        </Styled.Status>
      )}
    </Styled.SummaryContainer>
  );
};
