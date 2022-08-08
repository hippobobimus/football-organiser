import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Protect } from '../components/Protect';
import { Login } from './Login';
import { Register } from './Register';
import { Profile } from './Profile';
import { EditProfile } from './EditProfile';
import { EditPassword } from './EditPassword';

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
        <Route path="profile" element={<Profile />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="edit-password" element={<EditPassword />} />
      </Route>
    </Routes>
  );
};
