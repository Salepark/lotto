import React, { useEffect, useState } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import NumberBall from './NumberBall';
import SectionEyebrow, { cardStyle, sectionTitleStyle } from './SectionEyebrow';

// 로또 1회차 추첨: 2002-12-07 20:45 KST (UTC로는 11:45)
const FIRST_DRAW_UTC = Date.UTC(2002, 11, 7, 11, 45, 0);
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function estimateLatestRound() {
  return Math.max(Math.floor((Date.now() - FIRST_DRAW_UTC) / WEEK_MS) + 1, 1);
}

async function fetchRound(round) {
  const url = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.returnValue !== 'success') return null;
  return data;
}

export default function LastWeekNumbers() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadLatest() {
    setLoading(true);
    setError('');
    try {
      let round = estimateLatestRound();
      let data = null;
      for (let attempts = 0; attempts < 3 && round > 0 && !data; attempts += 1) {
        // eslint-disable-next-line no-await-in-loop
        data = await fetchRound(round);
        if (!data) round -= 1;
      }
      if (!data) throw new Error('empty');

      setResult({
        round: data.drwNo,
        date: data.drwNoDate,
        numbers: [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6].sort((a, b) => a - b),
        bonus: data.bnusNo,
      });
    } catch (err) {
      setError('당첨번호를 불러오지 못했어요. 브라우저 보안 정책(CORS)에 막혔을 수 있어요.');
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
