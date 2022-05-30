import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Subtitle,
  SectionHeading,
  SmallButton,
} from '../../components/styles';
import * as Styled from './Profile.styles';
import Spinner from '../../components/spinner/Spinner';
import { fetchAuthUser, logout, reset } from '../auth/authSlice';

const ProfileInfo = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditClick = () => {
    dispatch(reset());
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
  const { authUser, authUserStatus, authUserMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authUserStatus === 'idle') {
      dispatch(fetchAuthUser());
    }
  }, [dispatch, authUserStatus]);

  const handleChangePassword = () => {
    navigate('/edit-password');
    dispatch(reset());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    dispatch(reset());
  };

  if (authUserStatus === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{authUserMessage}</p>
      </>
    );
  }

  if (authUserStatus === 'loading' || authUserStatus === 'idle') {
    return <Spinner />;
  }

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
