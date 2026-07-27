import { Routes, Route, Navigate } from 'react-router-dom';
import StaffLayout from '../layouts/StaffLayout';
import StaffProtectedRoute from './StaffProtectedRoute';
import VerifyPage from '../pages/VerifyPage';
import StaffLoginPage from '../pages/StaffLoginPage';
import RosterUploadPage from '../pages/RosterUploadPage';
import RosterListPage from '../pages/RosterListPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/staff/login" replace />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/staff/login" element={<StaffLoginPage />} />

      <Route element={<StaffProtectedRoute />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff/upload" element={<RosterUploadPage />} />
          <Route path="/staff/rosters" element={<RosterListPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
