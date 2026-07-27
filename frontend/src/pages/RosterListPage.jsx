import { useEffect, useState } from 'react';
import { getRounds, getRosterByRound } from '../api/roster.api';
import { maskRespondentId, maskName } from '../utils/masking';
import MaskedSignature from '../components/MaskedSignature';
import QrCodeBlock from '../components/QrCodeBlock';

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('ko-KR');
}

export default function RosterListPage() {
  const [rounds, setRounds] = useState([]);
  const [round, setRound] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getRounds()
      .then((list) => {
        setRounds(list);
        if (list.length > 0) setRound(list[0]);
      })
      .catch((err) => setError(err.response?.data?.error?.message ?? '회차 목록을 불러오지 못했습니다'));
  }, []);

  useEffect(() => {
    if (!round) {
      setRows([]);
      return;
    }
    setLoading(true);
    setError('');
    getRosterByRound(round)
      .then(setRows)
      .catch((err) => setError(err.response?.data?.error?.message ?? '명부를 불러오지 못했습니다'))
      .finally(() => setLoading(false));
  }, [round]);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="page-section">
      <div className="no-print">
        <h1>명부 조회</h1>
        <div className="button-row">
          <label>
            회차
            <select value={round} onChange={(e) => setRound(e.target.value)}>
              {rounds.length === 0 && <option value="">업로드된 회차 없음</option>}
              {rounds.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={handlePrint} disabled={rows.length === 0}>
            출력
          </button>
        </div>
        {error && <p className="error-text">{error}</p>}
        {round && <QrCodeBlock round={round} />}

        {loading ? (
          <p>불러오는 중…</p>
        ) : (
          <table className="roster-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>사번/학번</th>
                <th>성명</th>
                <th>서명일시</th>
                <th>담당자확인</th>
                <th>서명</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.respondentId}>
                  <td>{row.no}</td>
                  <td>{row.respondentId}</td>
                  <td>{row.name}</td>
                  <td>{formatDateTime(row.signedAt)}</td>
                  <td>{row.confirmedAt ? formatDateTime(row.confirmedAt) : '-'}</td>
                  <td>
                    {row.signatureImage ? (
                      <img src={row.signatureImage} alt="서명" width={100} height={40} />
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 인쇄 전용 뷰: 화면에는 숨겨져 있다가 인쇄 시에만 표시된다(styles/global.css 참고) */}
      <div className="print-only">
        <h1>{round} 회차 기념품 수령 명부</h1>
        <table className="roster-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>사번/학번</th>
              <th>성명</th>
              <th>서명일시</th>
              <th>서명</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.respondentId}>
                <td>{row.no}</td>
                <td>{maskRespondentId(row.respondentId)}</td>
                <td>{maskName(row.name)}</td>
                <td>{formatDateTime(row.signedAt)}</td>
                <td>
                  <MaskedSignature src={row.signatureImage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
