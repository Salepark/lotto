import React from 'react';
import { Trophy, ExternalLink } from 'lucide-react';
import SectionEyebrow, { cardStyle, sectionTitleStyle } from './SectionEyebrow';

// 동행복권의 회차별 당첨번호 비공식 API가 더 이상 응답하지 않아(홈페이지로 리다이렉트됨),
// 억지로 값을 긁어오는 대신 공식 페이지로 바로 연결하는 방식을 택했습니다.
const DHLOTTERY_RESULT_URL = 'https://www.dhlottery.co.kr/gameResult.do?method=byWin';

export default function LastWeekNumbers() {
  return (
    <section aria-labelledby="lastweek-heading" style={cardStyle}>
      <SectionEyebrow icon={<Trophy className="icon" style={{ width: 16, height: 16 }} />}>지난 회차 결과</SectionEyebrow>
      <h2 id="lastweek-heading" style={sectionTitleStyle}>
        최신 당첨번호
      </h2>
      <p style={{ color: 'var(--sub)', margin: '4px 0 20px', fontSize: 14 }}>
        동행복권 공식 사이트에서 최신 회차 당첨번호를 바로 확인할 수 있어요.
      </p>

      
        href={DHLOTTERY_RESULT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
      >
        동행복권에서 확인하기
        <ExternalLink className="icon" style={{ width: 16, height: 16 }} />
      </a>
    </section>
  );
}
