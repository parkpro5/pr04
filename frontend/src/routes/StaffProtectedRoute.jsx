import { Navigate, Outlet } from 'react-router-dom';
import { useStaffAuthStore } from '../store/staffAuthStore';

export default function StaffProtectedRoute() {
  const token = useStaffAuthStore((state) => state.token);
  if (!token) return <Navigate to="/staff/login" replace />;
  return <Outlet />;
}
