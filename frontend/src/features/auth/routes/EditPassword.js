import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { SectionHeading } from '../../../components/styles';
import { EditPasswordForm } from '../components/AuthForm';

export const EditPassword = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/profile');
    toast.success('Password updated');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <>
      <SectionHeading>Change Your Password</SectionHeading>
      <EditPasswordForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
};
