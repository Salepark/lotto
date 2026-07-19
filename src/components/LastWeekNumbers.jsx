import React, { useEffect, useState } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import NumberBall from './NumberBall';
import SectionEyebrow, { cardStyle, sectionTitleStyle } from './SectionEyebrow';

export default function LastWeekNumbers() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadLatest() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/lotto');
      if (!res.ok) throw new Error('요청 실패');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('당첨번호를 불러오지 못했어요. 로컬(npm run dev)에서는 이 기능이 동작하지 않고, 배포된 사이트에서만 확인할 수 있어요.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLatest();
  }, []);

  return (
    <section aria-labelledby="lastweek-heading" style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <SectionEyebrow icon={<Trophy className="icon" style={{ width: 16, height: 16 }} />}>지난 회차 결과</SectionEyebrow>
          <h2 id="lastweek-heading" style={sectionTitleStyle}>
            {loading ? '불러오는 중...' : result ? `${result.round}회 당첨번호` : '당첨번호'}
          </h2>
          <p style={{ color: 'var(--sub)', margin: '4px 0 20px', fontSize: 14 }}>
            {result ? `추첨일 ${result.date}` : '\u00A0'}
          </p>
        </div>
        <button
          onClick={loadLatest}
          aria-label="당첨번호 새로고침"
          className="btn btn-outline"
          disabled={loading}
          style={{ padding: '8px 10px', flexShrink: 0 }}
        >
          <RefreshCw className="icon" style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {error && (
        <p role="alert" style={{ color: '#DD2A7B', fontSize: 13, fontWeight: 500, margin: '0 0 12px' }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {result.numbers.map((n) => (
            <NumberBall key={n} n={n} size={42} />
          ))}
          <span style={{ fontSize: 20, color: 'var(--sub)', fontWeight: 700 }}>+</span>
          <NumberBall n={result.bonus} size={42} />
          <span style={{ fontSize: 13, color: 'var(--sub)', marginLeft: 4 }}>보너스</span>
        </div>
      )}
    </section>
  );
}
