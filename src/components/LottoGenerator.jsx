import React, { useState, useMemo } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import NumberBall from './NumberBall';
import SectionEyebrow, { cardStyle, sectionTitleStyle } from './SectionEyebrow';

function randomSet(luckyNumbers) {
  const set = new Set(luckyNumbers);
  while (set.size < 6) {
    set.add(1 + Math.floor(Math.random() * 45));
  }
  return Array.from(set).sort((a, b) => a - b);
}

export default function LottoGenerator() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [sets, setSets] = useState([]);

  const parsedLucky = useMemo(() => {
    return input
      .split(/[,\s]+/)
      .filter(Boolean)
      .map((s) => parseInt(s, 10));
  }, [input]);

  function handleGenerate() {
    setError('');
    const unique = Array.from(new Set(parsedLucky));
    if (unique.length !== parsedLucky.length) {
      setError('중복된 숫자가 있어요. 서로 다른 숫자를 입력해 주세요.');
      return;
    }
    if (unique.some((n) => Number.isNaN(n) || n < 1 || n > 45)) {
      setError('1부터 45 사이의 숫자만 입력할 수 있어요.');
      return;
    }
    if (unique.length > 5) {
      setError('최대 5개까지만 지정할 수 있어요. (최소 1자리는 랜덤으로 남겨야 5세트가 서로 달라져요)');
      return;
    }
    setSets(Array.from({ length: 5 }, () => randomSet(unique)));
  }

  return (
    <section aria-labelledby="generator-heading" style={cardStyle}>
      <SectionEyebrow icon={<Sparkles className="icon" style={{ width: 16, height: 16 }} />}>번호 생성</SectionEyebrow>
      <h2 id="generator-heading" style={sectionTitleStyle}>
        나만의 로또 번호 생성기
      </h2>
      <p style={{ color: 'var(--sub)', margin: '4px 0 20px', fontSize: 14 }}>
        꼭 넣고 싶은 숫자가 있다면 쉼표나 띄어쓰기로 구분해서 입력해 주세요 (최대 5개, 최소 1자리는 항상 랜덤으로 채워져요). 비워두면 완전 랜덤으로 생성돼요.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
        <label htmlFor="lucky-input" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          원하는 숫자 입력
        </label>
        <input
          id="lucky-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="예: 7, 14, 23"
          style={{
            flex: '1 1 220px',
            padding: '12px 16px',
            borderRadius: 999,
            border: '1px solid var(--border)',
            fontSize: 15,
            color: 'var(--text)',
            outline: 'none',
          }}
        />
        <button className="btn" onClick={handleGenerate} aria-label="5세트 로또 번호 생성하기">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <RefreshCw className="icon" style={{ width: 18, height: 18 }} />
            5세트 생성
          </span>
        </button>
      </div>

      {error && (
        <p role="alert" style={{ color: '#DD2A7B', fontSize: 13, fontWeight: 500, margin: '8px 0 0' }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sets.length === 0 && (
          <p style={{ color: 'var(--sub)', fontSize: 14 }}>아직 생성된 번호가 없어요. 위 버튼을 눌러 시작해 보세요.</p>
        )}
        {sets.map((set, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 16,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                background: 'var(--grad)',
                borderRadius: 999,
                padding: '4px 10px',
                flexShrink: 0,
              }}
            >
              SET {i + 1}
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {set.map((n) => (
                <NumberBall key={n} n={n} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
