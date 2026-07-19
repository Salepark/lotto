-- ============================================================
-- Bboggl Lotto: 커뮤니티 게시판용 posts 테이블
-- Supabase 대시보드 > SQL Editor 에서 이 파일 내용을 그대로 붙여넣고 Run 하세요.
-- ============================================================

create table if not exists public.posts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  author text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table public.posts enable row level security;

drop policy if exists "누구나 게시글 조회" on public.posts;
drop policy if exists "로그인한 본인만 작성" on public.posts;

-- 게시글은 로그인 여부와 상관없이 누구나 읽을 수 있음
create policy "누구나 게시글 조회"
  on public.posts for select
  using (true);

-- 글쓰기는 로그인한 사용자가 자기 user_id로만 가능 (다른 사람 이름으로 못 씀)
create policy "로그인한 본인만 작성"
  on public.posts for insert
  with check (auth.uid() = user_id);

-- 실시간 업데이트(새 글이 바로 보이게)를 위해 Realtime publication에 추가
alter publication supabase_realtime add table public.posts;
