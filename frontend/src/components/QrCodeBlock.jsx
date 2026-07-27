import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QrCodeBlock({ round }) {
  const [dataUrl, setDataUrl] = useState(null);
  const verifyUrl = `${window.location.origin}/verify?round=${encodeURIComponent(round)}`;

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(verifyUrl, { width: 220, margin: 1 }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [verifyUrl]);

  return (
    <div className="qr-block">
      <p className="qr-block__label">{round}회차 접속 QR (인쇄해서 게시)</p>
      {dataUrl && <img src={dataUrl} alt={`${round} 회차 접속 QR코드`} width={220} height={220} />}
      <p className="qr-block__url">{verifyUrl}</p>
    </div>
  );
}
