import { useGetAuthUserQuery } from '../api/authApiSlice';
import { LoadingPage } from './LoadingPage';

export const AuthMiddleware = ({ children }) => {
  const { isLoading } = useGetAuthUserQuery();

  if (isLoading) {
    return <LoadingPage />;
  }

  return children;
};
