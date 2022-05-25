import * as Styled from './UserListItem.styles';

const UserListItem = ({ user, isGuest }) => {
  return (
    <Styled.ListItem>
      <span>
        {isGuest && 'Guest of'} {user?.name || 'unknown user'}
      </span>
    </Styled.ListItem>
  );
};

export default UserListItem;
