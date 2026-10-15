import { useEffect, useRef } from 'react';

const DENSITY = 2; // 인쇄 해상도를 위해 2배 크기로 그리고 CSS로 축소 표시

// 서명 이미지를 지정 크기 안에 비율을 유지해 그린 뒤, 서명의 가로 방향
// 가운데 1/3 구간을 검은 사각형으로 덮어 출력한다(마스킹 규칙).
export default function MaskedSignature({ src, width = 110, height = 36 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !src) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const cw = width * DENSITY;
      const ch = height * DENSITY;
      canvas.width = cw;
      canvas.height = ch;
      ctx.clearRect(0, 0, cw, ch);

      const scale = Math.min(cw / img.width, ch / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);

      ctx.fillStyle = '#000000';
      ctx.fillRect(dx + dw / 3, 0, dw / 3, ch);
    };
    img.src = src;
  }, [src, width, height]);

  if (!src) return <span className="masked-signature masked-signature--empty">-</span>;
  return (
    <canvas
      ref={canvasRef}
      width={width * DENSITY}
      height={height * DENSITY}
      style={{ width, height }}
      className="masked-signature"
    />
  );
}
