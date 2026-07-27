import { useState } from 'react';
import { uploadRoster } from '../api/roster.api';

export default function RosterUploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await uploadRoster(file);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error?.message ?? '업로드 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-section">
      <h1>명부 업로드</h1>
      <p className="hint-text">
        열 제목은 <strong>회차, 학번/사번, 성명</strong> 3개여야 합니다. 같은 회차를 다시 업로드하면 기존
        명단이 새 내용으로 전체 교체됩니다(이미 발급된 수령 기록은 영향받지 않습니다).
      </p>
      <p className="hint-text">
        학번/사번에 앞자리 0이 있는 경우, 엑셀에서 해당 열의 서식을 <strong>텍스트</strong>로 지정해야
        0이 사라지지 않습니다.
      </p>
      <form onSubmit={handleSubmit} className="card">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
        <button type="submit" disabled={loading || !file}>
          {loading ? '업로드 중…' : '업로드'}
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
      {result && (
        <p className="success-text">
          {result.rounds.join(', ')} 회차 {result.count}명 명단을 반영했습니다.
        </p>
      )}
    </div>
  );
}
