import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStaffAuthStore } from '../store/staffAuthStore';

export default function StaffLayout() {
  const navigate = useNavigate();
  const staff = useStaffAuthStore((state) => state.staff);
  const logout = useStaffAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate('/staff/login', { replace: true });
  }

  return (
    <div className="staff-layout">
      <header className="staff-header no-print">
        <span className="staff-header__title">설문 기념품 관리</span>
        <nav className="staff-header__nav">
          <NavLink to="/staff/upload">명부 업로드</NavLink>
          <NavLink to="/staff/rosters">명부 조회</NavLink>
        </nav>
        <div className="staff-header__user">
          {staff ? `${staff.name} 담당자` : ''}
          <button type="button" onClick={handleLogout}>로그아웃</button>
        </div>
      </header>
      <main className="staff-main">
        <Outlet />
      </main>
    </div>
  );
}
