import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { staffLogin } from '../api/auth.api';
import { useStaffAuthStore } from '../store/staffAuthStore';

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const token = useStaffAuthStore((state) => state.token);
  const setSession = useStaffAuthStore((state) => state.setSession);

  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (token) return <Navigate to="/staff/rosters" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token: newToken, staff } = await staffLogin(employeeId, name, secretKey);
      setSession(newToken, staff);
      navigate('/staff/rosters', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message ?? '로그인 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center-page">
      <form className="card" onSubmit={handleSubmit}>
        <h1>담당자 로그인</h1>
        <label>
          사번
          <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required autoFocus />
        </label>
        <label>
          성명
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          비밀키
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            required
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? '로그인 중…' : '로그인'}
        </button>
      </form>
    </div>
  );
}
