import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Save } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { cardStyle, sectionTitleStyle } from './SectionEyebrow';

const PROVIDER_LABEL = {
  email: '이메일',
  google: 'Google',
  kakao: 'Kakao',
};

export default function MyPage({ user, onBack }) {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const provider = user?.app_metadata?.provider;
  const joinedAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-';
  const avatarUrl = (user?.user_metadata?.avatar_url || user?.user_metadata?.picture)?.replace(/^http:\/\//, 'https://');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('nickname, bio')
        .eq('id', user.id)
        .maybeSingle();

      if (!active) return;

      if (fetchError) {
        setError('프로필을 불러오지 못했어요. supabase/profiles.sql을 실행했는지 확인해 주세요.');
      } else if (data) {
        setNickname(data.nickname || '');
        setBio(data.bio || '');
      } else {
        // 트리거가 아직 안 만들어졌거나 첫 로그인 직후인 경우를 대비한 폴백
        const fallbackNickname =
          user?.user_metadata?.full_name || user?.user_metadata?.nickname || user?.email?.split('@')[0] || '';
        setNickname(fallbackNickname);
      }
      setLoading(false);
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');

    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: user.id,
      nickname: nickname.trim(),
      bio: bio.trim(),
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      setError('저장에 실패했어요: ' + upsertError.message);
    } else {
      setNotice('저장됐어요.');
    }
    setSaving(false);
  }

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '28px 20px 60px' }}>
      <button
        onClick={onBack}
        aria-label="로또 생성기로 돌아가기"
        className="btn btn-outline"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '8px 16px', fontSize: 13 }}
      >
        <ArrowLeft className="icon" style={{ width: 16, height: 16 }} />
        돌아가기
      </button>

      <section style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" width={56} height={56} style={{ borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <span
              aria-hidden="true"
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--grad)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User className="icon" style={{ width: 26, height: 26, color: '#fff' }} />
            </span>
          )}
          <div>
            <h2 style={sectionTitleStyle}>마이페이지</h2>
            <p style={{ margin: '2px 0 0', color: 'var(--sub)', fontSize: 13 }}>
              {PROVIDER_LABEL[provider] || provider} 계정 · {joinedAt} 가입
            </p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--sub)', fontSize: 14 }}>불러오는 중...</p>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="mypage-email" style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                이메일
              </label>
              <input
                id="mypage-email"
                type="text"
                value={user.email || '(이메일 없음)'}
                disabled
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 999,
                  border: '1px solid var(--border)',
                  fontSize: 15,
                  background: 'var(--bg)',
                  color: 'var(--sub)',
                }}
              />
            </div>

            <div>
              <label htmlFor="mypage-nickname" style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                닉네임
              </label>
              <input
                id="mypage-nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 999,
                  border: '1px solid var(--border)',
                  fontSize: 15,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label htmlFor="mypage-bio" style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                자기소개
              </label>
              <textarea
                id="mypage-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={140}
                rows={3}
                placeholder="한 줄 소개를 남겨보세요 (선택)"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  fontSize: 15,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            {error && (
              <p role="alert" style={{ color: '#DD2A7B', fontSize: 13, fontWeight: 500, margin: 0 }}>
                {error}
              </p>
            )}
            {notice && (
              <p role="status" style={{ color: '#0095F6', fontSize: 13, fontWeight: 500, margin: 0 }}>
                {notice}
              </p>
            )}

            <button
              type="submit"
              className="btn"
              disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}
            >
              <Save className="icon" style={{ width: 16, height: 16 }} />
              {saving ? '저장 중...' : '저장'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
