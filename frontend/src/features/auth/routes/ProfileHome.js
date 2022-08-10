import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, SmallButton } from '../../../components/styles';
import { selectAuthUser } from '../stores/authSlice';
import { ProfileInfo } from '../components/ProfileInfo';

export const ProfileHome = () => {
  const navigate = useNavigate();

  const user = useSelector(selectAuthUser);

  const handleEdit = () => {
    navigate('edit');
  };

  const handleChangePassword = () => {
    navigate('change-password');
  };

  const handleLogout = () => {
    // TODO
    // navigate('/');
  };

  return (
    <>
      <ProfileInfo user={user} onEdit={handleEdit} />
      <SmallButton onClick={handleChangePassword}>Change Password</SmallButton>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};
