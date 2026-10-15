import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyRespondent } from '../api/verify.api';
import { createReceipt, confirmReceipt } from '../api/receipt.api';
import SignaturePad from '../components/SignaturePad';

function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('ko-KR');
}

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const round = searchParams.get('round');

  const [step, setStep] = useState('form'); // form | not_found | already_received | sign | awaiting_confirm | confirmed
  const [respondentId, setRespondentId] = useState('');
  const [name, setName] = useState('');
  const [signedAt, setSignedAt] = useState(null);
  const [receiptId, setReceiptId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const signaturePadRef = useRef(null);

  if (!round) {
    return (
      <div className="center-page">
        <h1>접속 정보가 올바르지 않습니다</h1>
        <p>회차 정보가 없는 링크입니다. 담당자에게 문의해 주세요.</p>
      </div>
    );
  }

  async function handleVerifySubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await verifyRespondent({ round, respondentId, name });
      if (result.status === 'eligible') {
        setStep('sign');
      } else if (result.status === 'already_received') {
        setSignedAt(result.signedAt);
        setStep('already_received');
      } else {
        setStep('not_found');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message ?? '확인 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignSubmit() {
    if (signaturePadRef.current?.isEmpty()) {
      setError('서명을 입력해 주세요');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const signatureImage = signaturePadRef.current.toDataURL();
      const result = await createReceipt({ round, respondentId, name, signatureImage });
      if (result.status === 'created') {
        setReceiptId(result.receipt.id);
        setStep('awaiting_confirm');
      } else if (result.status === 'already_received') {
        setSignedAt(result.signedAt);
        setStep('already_received');
      } else {
        setStep('not_found');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message ?? '제출 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }

  async function handleStaffConfirm() {
    setError('');
    setLoading(true);
    try {
      await confirmReceipt(receiptId);
      setStep('confirmed');
    } catch (err) {
      setError(err.response?.data?.error?.message ?? '확인 처리 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }

  function resetToForm() {
    setStep('form');
    setError('');
  }

  return (
    <div className="verify-page center-page">
      {step === 'form' && (
        <form className="card" onSubmit={handleVerifySubmit}>
          <h1>기념품 수령 확인</h1>
          <label>
            학번/사번
            <input
              value={respondentId}
              onChange={(e) => setRespondentId(e.target.value)}
              required
              inputMode="numeric"
              autoFocus
            />
          </label>
          <label>
            성명
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? '확인 중…' : '다음'}
          </button>
        </form>
      )}

      {step === 'not_found' && (
        <div className="card">
          <h1>대상자가 아닙니다</h1>
          <p>입력하신 정보를 다시 확인해 주세요.</p>
          <dl className="info-list">
            <dt>학번/사번</dt>
            <dd>{respondentId}</dd>
            <dt>성명</dt>
            <dd>{name}</dd>
          </dl>
          <button type="button" onClick={resetToForm}>
            다시 입력
          </button>
        </div>
      )}

      {step === 'already_received' && (
        <div className="card">
          <h1>이미 기념품을 수령하셨습니다</h1>
          <dl className="info-list">
            <dt>학번/사번</dt>
            <dd>{respondentId}</dd>
            <dt>성명</dt>
            <dd>{name}</dd>
            <dt>서명일시</dt>
            <dd>{formatDateTime(signedAt)}</dd>
          </dl>
        </div>
      )}

      {step === 'sign' && (
        <div className="card">
          <h1>서명해 주세요</h1>
          <p>
            {name}님 ({respondentId})
          </p>
          <SignaturePad ref={signaturePadRef} />
          <div className="button-row">
            <button type="button" className="secondary" onClick={() => signaturePadRef.current?.clear()}>
              다시 쓰기
            </button>
            <button type="button" onClick={handleSignSubmit} disabled={loading}>
              {loading ? '제출 중…' : '서명완료'}
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
      )}

      {step === 'awaiting_confirm' && (
        <div className="card">
          <h1>서명이 완료되었습니다</h1>
          <p className="guidance-text">담당자가 확인 버튼을 누를 수 있게 보여주세요</p>
          <button type="button" className="confirm-button" onClick={handleStaffConfirm} disabled={loading}>
            {loading ? '처리 중…' : '담당자 확인'}
          </button>
          <div className="caution-text">
            <p>&lt;주의사항&gt;</p>
            <p>절대로 버튼을 직접 누르지 마세요!</p>
            <p>본 화면을 담당자가 확인할 수 있게 제시하시면, 상품을 드립니다!</p>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
      )}

      {step === 'confirmed' && (
        <div className="card">
          <h1>지급이 완료되었습니다</h1>
          <p>기념품 수령이 정상적으로 처리되었습니다. 감사합니다.</p>
        </div>
      )}
    </div>
  );
}
