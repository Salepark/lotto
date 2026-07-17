-- ============================================================
-- Bboggl Lotto: 마이페이지용 profiles 테이블
-- Supabase 대시보드 > SQL Editor 에서 이 파일 내용을 그대로 붙여넣고 Run 하세요.
-- ============================================================

-- 1) 프로필 테이블
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  nickname text,
  bio text,
  updated_at timestamptz default now()
);

-- 2) 행 단위 보안(RLS) 활성화 — 이게 켜져 있어야 "본인 데이터만 접근" 규칙이 작동해요
alter table public.profiles enable row level security;

-- 기존 정책이 있다면 충돌 방지를 위해 먼저 제거 (없으면 에러 없이 무시됨)
drop policy if exists "본인 프로필 조회" on public.profiles;
drop policy if exists "본인 프로필 수정" on public.profiles;
drop policy if exists "본인 프로필 생성" on public.profiles;

-- 3) 정책: 로그인한 본인만 자기 프로필을 조회/수정/생성할 수 있음
create policy "본인 프로필 조회"
  on public.profiles for select
  using (auth.uid() = id);

create policy "본인 프로필 수정"
  on public.profiles for update
  using (auth.uid() = id);

create policy "본인 프로필 생성"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 4) 회원가입(이메일/Google/Kakao 공통) 시 자동으로 프로필 행을 만들어주는 트리거
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'nickname',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5) 이미 가입되어 있던 기존 사용자(박루이, Louis Park 등)를 위한 1회성 백필
insert into public.profiles (id, nickname)
select
  id,
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'nickname', split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;
