import React from 'react';
import { Trophy } from 'lucide-react';
import NumberBall from './NumberBall';
import SectionEyebrow, { cardStyle, sectionTitleStyle } from './SectionEyebrow';
import { LAST_WEEK } from '../data/dummyData';

export default function LastWeekNumbers() {
  return (
    <section aria-labelledby="lastweek-heading" style={cardStyle}>
      <SectionEyebrow icon={<Trophy className="icon" style={{ width: 16, height: 16 }} />}>지난 회차 결과</SectionEyebrow>
      <h2 id="lastweek-heading" style={sectionTitleStyle}>
        {LAST_WEEK.round}회 당첨번호
      </h2>
      <p style={{ color: 'var(--sub)', margin: '4px 0 20px', fontSize: 14 }}>추첨일 {LAST_WEEK.date}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {LAST_WEEK.numbers.map((n) => (
          <NumberBall key={n} n={n} size={42} />
        ))}
        <span style={{ fontSize: 20, color: 'var(--sub)', fontWeight: 700 }}>+</span>
        <NumberBall n={LAST_WEEK.bonus} size={42} />
        <span style={{ fontSize: 13, color: 'var(--sub)', marginLeft: 4 }}>보너스</span>
      </div>
    </section>
  );
}
