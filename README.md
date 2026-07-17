# Bboggl Lotto

나만의 로또 번호 생성기 · Supabase Auth(이메일 + Google + Kakao) 연동 버전

## 로컬에서 실행하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

`.env` 파일에 이미 여러분의 Supabase 프로젝트 값이 채워져 있어요:

```
VITE_SUPABASE_URL=https://oohipeplezvbdisncpef.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## 배포할 때 꼭 확인할 것

1. **Vercel/Netlify 등에 배포하면 도메인이 바뀝니다.** 새 도메인이 생기면:
   - Google Cloud Console → OAuth 클라이언트 → 승인된 JavaScript 원본에 새 도메인 추가
   - Kakao Developers → 플랫폼 키 → REST API 키 → 카카오 로그인 리다이렉트 URI는 그대로 두어도 됩니다 (Supabase 콜백 URL은 고정이라 안 바뀜)
   - Supabase → Authentication → URL Configuration → **Redirect URLs**에 새 배포 도메인을 추가해야 로그인 후 정상적으로 돌아옵니다. (`AuthModal.jsx`에서 `redirectTo: window.location.origin`으로 자동 처리하지만, Supabase 쪽 허용 목록에는 미리 등록해야 해요.)

2. **`.env` 파일은 git에 커밋하지 마세요.** `.gitignore`에 이미 포함되어 있습니다. 배포 플랫폼(Vercel 등)의 환경변수 설정 화면에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`를 따로 등록해 주세요.

3. **커뮤니티 게시판은 아직 더미 데이터입니다.** 새로고침하면 초기화돼요. 실제로 글이 저장되게 하려면 Supabase에 `posts` 테이블을 만들고 `CommunityBoard.jsx`의 `handleSend` 함수에서 `supabase.from('posts').insert(...)`를 호출하도록 바꾸면 됩니다. 원하시면 이 부분도 다음 단계로 만들어 드릴게요.

## 폴더 구조

```
src/
├─ main.jsx
├─ App.jsx                 # 세션 관리 + 전체 레이아웃
├─ index.css                # 디자인 시스템 (인스타 그라데이션 · 알약 버튼 · Montserrat)
├─ lib/
│  └─ supabaseClient.js     # Supabase 클라이언트 초기화
├─ components/
│  ├─ Header.jsx            # 로그인 상태에 따른 프로필/로그인 버튼
│  ├─ AuthModal.jsx         # 이메일 + Google + Kakao 로그인/회원가입
│  ├─ NumberBall.jsx        # 로또 번호 볼 (공용)
│  ├─ SectionEyebrow.jsx    # 섹션 라벨 (공용)
│  ├─ LottoGenerator.jsx    # 섹션1: 번호 생성기
│  ├─ LastWeekNumbers.jsx   # 섹션2: 지난 회차 당첨번호
│  └─ CommunityBoard.jsx    # 섹션3: 기록 게시판
└─ data/
   └─ dummyData.js
```
