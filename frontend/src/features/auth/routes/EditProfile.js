import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { SectionHeading } from '../../../components/styles';
import { EditProfileForm } from '../components/AuthForm';

export const EditProfile = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/profile');
    toast.success('Profile updated');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <>
      <SectionHeading>Edit Your Info</SectionHeading>
      <EditProfileForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
};
