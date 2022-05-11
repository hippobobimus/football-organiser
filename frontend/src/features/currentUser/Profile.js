import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Card, Subtitle } from '../../components/styles';
import Spinner from '../../components/spinner/Spinner';
import { getCurrentUser } from './currentUserSlice';

function Profile() {
  const dispatch = useDispatch();
  const { data, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.currentUser
  );

  useEffect(() => {
    if (!isLoading && !isSuccess && !isError) {
      console.log('dispatching');
      dispatch(getCurrentUser());
    }
  }, [dispatch, isLoading, isSuccess, isError]);

  if (isError) {
    return <p>error: {message}</p>;
  }

  if (isLoading || !data) {
    return <Spinner />;
  }

  return (
    <Card>
      <Subtitle>Hi {data.firstName}!</Subtitle>
      <Subtitle>Your Info</Subtitle>
      <ul>
        <li>
          Email: <Button>Edit</Button>
        </li>
      </ul>
      <Button>Change Password</Button>
    </Card>
  );
}

export default Profile;
