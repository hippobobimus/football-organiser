import { Outlet } from 'react-router-dom';

import * as Styled from './styles';

export const EventEditLayout = () => {
  return (
    <Styled.ContentCard>
      <Outlet />
    </Styled.ContentCard>
  );
};
