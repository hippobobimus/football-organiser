import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { publicRoutes } from './public';
import { privateRoutes } from './private';
import PageNotFound from '../components/PageNotFound';

export const AppRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const commonRoutes = [];

  const routes = isLoggedIn ? privateRoutes : publicRoutes;

  const element = useRoutes([
    ...routes,
    ...commonRoutes,
    {
      path: '*',
      element: <PageNotFound />,
    },
  ]);

  return <>{element}</>;
};
