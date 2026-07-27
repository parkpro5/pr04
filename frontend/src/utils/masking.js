// backend/src/utils/masking.js 와 동일한 규칙(인쇄 미리보기용 클라이언트 사본).

export function maskRespondentId(id) {
  const s = String(id ?? '');
  if (s.length <= 4) return s;
  if (s.length === 5) {
    return s.slice(0, 2) + '*' + s.slice(3);
  }
  const end = Math.min(s.length, 5);
  return s.slice(0, 2) + '*'.repeat(end - 2) + s.slice(end);
}

export function maskName(name) {
  const s = String(name ?? '');
  if (s.length < 2) return s;
  return s.slice(0, 1) + 'O' + s.slice(2);
}
