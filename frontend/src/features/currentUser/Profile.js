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
import { getCurrentUser, reset } from './currentUserSlice';
import { logout } from '../auth/authSlice';

const ProfileInfo = ({ data }) => {
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
            <span>{data.name}</span>
          </Styled.ListItem>
          <Styled.ListItem>
            <span>Email:</span>
            <span>{data.email}</span>
          </Styled.ListItem>
        </Styled.List>
      </Styled.SectionContainer>
    </section>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, status, message } = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getCurrentUser());
    }
  }, [dispatch, status]);

  const handleChangePassword = () => {
    navigate('/edit-password');
    dispatch(reset());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    dispatch(reset());
  };

  if (status === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{message}</p>
      </>
    );
  }

  if (status === 'loading' || status === 'idle') {
    return <Spinner />;
  }

  return (
    <>
      <Subtitle>Hi {data.firstName}!</Subtitle>
      <ProfileInfo data={data} />
      <SmallButton onClick={handleChangePassword}>Change Password</SmallButton>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default Profile;
