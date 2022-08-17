import { useGetAuthUserQuery } from '../api/authApiSlice';
import { Spinner } from '../../../components/spinner';

export const AuthMiddleware = ({ children }) => {
  const { isLoading } = useGetAuthUserQuery();

  if (isLoading) {
    return <Spinner />;
  }

  return children;
};
