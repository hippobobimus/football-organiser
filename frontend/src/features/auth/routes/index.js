import { Route, Routes } from 'react-router-dom';

import { Protect } from '../components/Protect';
import { Login } from './Login';
import { Register } from './Register';
import { Profile } from './Profile';
import { EditProfile } from './EditProfile';
import { EditPassword } from './EditPassword';

export const AuthRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route element={<Protect allowedRoles={['admin', 'user']} />}>
        <Route path="profile" element={<Profile />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="edit-password" element={<EditPassword />} />
      </Route>
    </Routes>
  );
};
