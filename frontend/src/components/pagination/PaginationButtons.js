import Icon from '@mdi/react';
import { mdiArrowUpBoldOutline, mdiArrowDownBoldOutline } from '@mdi/js';

import { SmallButton } from '../styles';
import * as Styled from './PaginationButtons.styles';

const PaginationButtons = ({
  onUpClick,
  onDownClick,
  upDisabled,
  downDisabled,
}) => {
  return (
    <Styled.ButtonRow>
      <SmallButton type='button' onClick={onUpClick} disabled={upDisabled}>
        <Icon path={mdiArrowUpBoldOutline} size={1} />
      </SmallButton>
      <SmallButton type='button' onClick={onDownClick} disabled={downDisabled}>
        <Icon path={mdiArrowDownBoldOutline} size={1} />
      </SmallButton>
    </Styled.ButtonRow>
  );
};

export default PaginationButtons;
