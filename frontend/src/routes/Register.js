import { Card } from '../components/styles';
import RegisterForm from '../features/auth/RegisterForm';

function Register() {
  return (
    <Card>
      <RegisterForm title='Create an Account'/>
    </Card>
  );
}

export default Register;
