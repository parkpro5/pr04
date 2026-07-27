import { useEffect, useRef } from 'react';

// 서명 이미지의 가로 방향 가운데 1/3을 검은 사각형으로 덮어 재출력(마스킹 규칙).
export default function MaskedSignature({ src, width = 240, height = 100 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !src) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(width / 3, 0, width / 3, height);
    };
    img.src = src;
  }, [src, width, height]);

  if (!src) return <span className="masked-signature masked-signature--empty">-</span>;
  return <canvas ref={canvasRef} width={width} height={height} className="masked-signature" />;
}
