import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Subtitle,
  SectionHeading,
  SmallButton,
} from '../../components/styles';
import * as Styled from './Profile.styles';
import { logout, reset, resetUpdate } from '../auth/authSlice';

const ProfileInfo = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditClick = () => {
    dispatch(resetUpdate());
    navigate('/edit-profile');
  };

  return (
    <section>
      <Styled.SectionContainer>
        <Styled.HeadingContainer>
          <SectionHeading>Your Info</SectionHeading>
          <SmallButton onClick={handleEditClick}>Edit</SmallButton>
        </Styled.HeadingContainer>

        <Styled.List>
          <Styled.ListItem>
            <span>Name:</span>
            <span>{user.name}</span>
          </Styled.ListItem>
          <Styled.ListItem>
            <span>Email:</span>
            <span>{user.email}</span>
          </Styled.ListItem>
        </Styled.List>
      </Styled.SectionContainer>
    </section>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);

  if (!authUser) {
    return null;
  }

  const handleChangePassword = () => {
    navigate('/edit-password');
    dispatch(resetUpdate());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <Subtitle>Hi {authUser.firstName}!</Subtitle>
      <ProfileInfo user={authUser} />
      <SmallButton onClick={handleChangePassword}>Change Password</SmallButton>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default Profile;
