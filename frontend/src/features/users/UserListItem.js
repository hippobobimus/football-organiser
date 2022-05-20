import { useSelector } from 'react-redux';

import * as Styled from './UserListItem.styles';
import { selectUserById } from '../users/usersSlice';

const UserListItem = ({ userId, isGuest }) => {
  const user = useSelector((state) => selectUserById(state, userId));

  return (
    <Styled.ListItem>
      <span>
        {isGuest && 'Guest of'} {user?.name || 'unknown user'}
      </span>
    </Styled.ListItem>
  );
};

export default UserListItem;
