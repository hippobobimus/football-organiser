import { Card, Subtitle } from '../components/styles';
import RegisterForm from '../features/auth/RegisterForm';

function Register() {
  return (
    <Card>
      <Subtitle>Create an account</Subtitle>
      <RegisterForm />
    </Card>
  );
}

export default Register;
