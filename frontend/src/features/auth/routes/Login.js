import { useLocation, useNavigate } from 'react-router-dom';

import { Subtitle } from '../../../components/styles';
import { LoginForm } from '../components/AuthForm';

export const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/';

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <>
      <Subtitle>Please Login</Subtitle>
      <LoginForm onSuccess={handleSuccess} />
    </>
  );
};
