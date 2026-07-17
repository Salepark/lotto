import React from 'react';

function ballColor(n) {
  if (n <= 10) return '#FBC400';
  if (n <= 20) return '#69C8F2';
  if (n <= 30) return '#FF7272';
  if (n <= 40) return '#AAAAAA';
  return '#B0D840';
}

export default function NumberBall({ n, size = 36 }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: ballColor(n),
        color: n <= 10 || (n > 30 && n <= 40) ? '#262626' : '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.42,
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  );
}
