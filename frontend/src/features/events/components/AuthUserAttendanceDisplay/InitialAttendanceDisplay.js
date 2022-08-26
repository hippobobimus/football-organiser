import * as Styled from './styles';
import { Button } from '../../../../components/styles';

export const InitialAttendanceDisplay = ({ onJoin }) => {
  return (
    <Styled.SummaryContainer>
      <Button type="button" onClick={onJoin}>
        Count Me In!
      </Button>
    </Styled.SummaryContainer>
  );
};
