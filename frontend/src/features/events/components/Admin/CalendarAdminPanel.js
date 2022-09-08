import { Link } from 'react-router-dom';

import { Button, ButtonRow } from '../../../../components/styles';

export const CalendarAdminPanel = () => {
  return (
    <ButtonRow>
      <Button as={Link} to="create-match">
        New Match
      </Button>
      <Button as={Link} to="create-social">
        New Social
      </Button>
    </ButtonRow>
  );
};
