// 명부 조회 화면의 "출력" 미리보기에서만 쓰이는 마스킹 규칙.
// frontend/src/utils/masking.js 에 동일 로직이 있다(인쇄 미리보기는 클라이언트에서 렌더링하기 때문).

function maskRespondentId(id) {
  const s = String(id);
  if (s.length <= 4) return s;
  if (s.length === 5) {
    return s.slice(0, 2) + '*' + s.slice(3);
  }
  // 6자리 이상: 3번째 글자(인덱스 2)부터 3글자를 마스킹
  const end = Math.min(s.length, 5);
  return s.slice(0, 2) + '*'.repeat(end - 2) + s.slice(end);
}

function maskName(name) {
  const s = String(name);
  if (s.length < 2) return s;
  return s.slice(0, 1) + 'O' + s.slice(2);
}

module.exports = { maskRespondentId, maskName };
