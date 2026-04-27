import { Outlet } from 'react-router';
import { AuthProvider } from '../../hooks/AuthContext';

export function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
