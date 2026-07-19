// Vercel Serverless Function: /api/lotto
// 동행복권 비공식 엔드포인트를 서버에서 대신 호출해서 브라우저 CORS 문제를 피합니다.
// 참고: 동행복권이 공식적으로 공개한 API가 아니라, 언제든 바뀌거나 막힐 수 있어요.

function estimateLatestRound() {
  // 로또 1회차 추첨: 2002-12-07 20:45 KST (UTC로는 11:45)
  const FIRST_DRAW_UTC = Date.UTC(2002, 11, 7, 11, 45, 0);
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const round = Math.floor((Date.now() - FIRST_DRAW_UTC) / WEEK_MS) + 1;
  return Math.max(round, 1);
}

async function fetchRound(round) {
  const url = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = await response.json();
  if (data.returnValue !== 'success') return null;
  return data;
}

export default async function handler(req, res) {
  try {
    let round = estimateLatestRound();
    let data = null;

    // 이번 주 추첨이 아직 안 됐을 수도 있으니, 최대 3회차까지 거슬러 올라가며 시도
    for (let attempts = 0; attempts < 3 && round > 0 && !data; attempts += 1) {
      // eslint-disable-next-line no-await-in-loop
      data = await fetchRound(round);
      if (!data) round -= 1;
    }

    if (!data) {
      res.status(502).json({ error: '당첨번호를 가져오지 못했어요. 잠시 후 다시 시도해 주세요.' });
      return;
    }

    const numbers = [
      data.drwtNo1,
      data.drwtNo2,
      data.drwtNo3,
      data.drwtNo4,
      data.drwtNo5,
      data.drwtNo6,
    ].sort((a, b) => a - b);

    // 1시간 동안은 캐시된 응답을 써서 동행복권 서버에 매번 요청하지 않도록 함
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({
      round: data.drwNo,
      date: data.drwNoDate,
      numbers,
      bonus: data.bnusNo,
    });
  } catch (err) {
    res.status(500).json({ error: '서버에서 오류가 발생했어요.' });
  }
}
