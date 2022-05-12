import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  Subtitle,
  SectionHeading,
  SmallButton,
} from '../../components/styles';
import * as Styled from './Profile.styles';
import Spinner from '../../components/spinner/Spinner';
import { getCurrentUser, reset } from './currentUserSlice';

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
  const { data, status, message } = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getCurrentUser());
    }
  }, [dispatch, status]);

  if (status === 'error') {
    return (
      <Card>
        <Subtitle>Something went wrong...</Subtitle>
        <p>Error: {message}</p>
      </Card>
    );
  }

  if (status === 'loading' || status === 'idle') {
    return (
      <Card>
        <Spinner />
      </Card>
    );
  }

  return (
    <Card>
      <Subtitle>Hi {data.firstName}!</Subtitle>
      <ProfileInfo data={data} />
      <SmallButton>Change Password</SmallButton>
      <Button>Logout</Button>
    </Card>
  );
};

export default Profile;