import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Subtitle } from '../../../components/styles';
import { RegisterForm } from '../components/AuthForm';

export const Register = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('../login');
  };

  const handleSuccess = () => {
    toast.success('You have successfully registered');
    navigate('/');
  };

  return (
    <>
      <Subtitle>Create an Account</Subtitle>
      <RegisterForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
};
