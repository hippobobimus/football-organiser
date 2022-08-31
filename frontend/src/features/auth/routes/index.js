import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Protect } from '../components/Protect';
import { Login } from './Login';
import { Register } from './Register';
import { ProfileLayout } from '../components/Layout';
import { ProfileHome } from './ProfileHome';
import { EditProfile } from './EditProfile';
import { EditPassword } from './EditPassword';
import { PageNotFound } from '../../../components/PageNotFound';

export const AuthRoutes = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Routes>
      <Route
        path="login"
        element={isLoggedIn ? <Navigate replace to="/" /> : <Login />}
      />
      <Route
        path="register"
        element={isLoggedIn ? <Navigate replace to="/" /> : <Register />}
      />

      <Route element={<Protect allowedRoles={['admin', 'user']} />}>
        <Route path="profile" element={<ProfileLayout />}>
          <Route index element={<ProfileHome />} />
          <Route path="edit" element={<EditProfile />} />
          <Route path="change-password" element={<EditPassword />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
