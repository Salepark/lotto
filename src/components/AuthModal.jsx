import React, { useState } from 'react';
import { X, Mail, Lock, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: 16,
};

const modalStyle = {
  background: 'var(--surface)',
  borderRadius: 24,
  padding: '32px 28px',
  width: '100%',
  maxWidth: 380,
  position: 'relative',
};

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setNotice('가입 확인 메일을 보냈어요. 메일함을 확인해 주세요.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onClose();
      }
    } catch (err) {
      setError(err.message || '문제가 발생했어요. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider) {
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (oauthError) setError(oauthError.message);
    // 성공 시 카카오/구글 인증 화면으로 리다이렉트되므로 여기서 추가 처리는 필요 없어요.
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--sub)',
          }}
        >
          <X className="icon" style={{ width: 22, height: 22 }} />
        </button>

        <h2
          id="auth-modal-title"
          style={{
            margin: '0 0 4px',
            fontSize: 22,
            backgroundImage: 'var(--grad)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {mode === 'signup' ? '회원가입' : '로그인'}
        </h2>
        <p style={{ color: 'var(--sub)', fontSize: 14, margin: '0 0 20px' }}>
          {mode === 'signup' ? '이메일로 새 계정을 만들어요' : 'Bboggl Lotto에 로그인해요'}
        </p>

        {/* 소셜 로그인 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => handleOAuth('google')}
            aria-label="Google로 계속하기"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            <LogIn className="icon" style={{ width: 18, height: 18 }} />
            Google로 계속하기
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => handleOAuth('kakao')}
            aria-label="카카오로 계속하기"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: '#FEE500',
              color: '#191600',
            }}
          >
            카카오로 계속하기
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 18px' }}>
          <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--sub)' }}>또는 이메일로</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* 이메일 로그인/가입 */}
        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Mail
              className="icon"
              style={{ width: 16, height: 16, position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--sub)' }}
            />
            <label htmlFor="auth-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
              이메일
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                borderRadius: 999,
                border: '1px solid var(--border)',
                fontSize: 15,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock
              className="icon"
              style={{ width: 16, height: 16, position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--sub)' }}
            />
            <label htmlFor="auth-password" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
              비밀번호
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 (6자 이상)"
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                borderRadius: 999,
                border: '1px solid var(--border)',
                fontSize: 15,
                outline: 'none',
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

          <button type="submit" className="btn" disabled={loading} style={{ marginTop: 6 }}>
            {loading ? '처리 중...' : mode === 'signup' ? '가입하기' : '로그인'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--sub)', marginTop: 18 }}>
          {mode === 'signup' ? '이미 계정이 있으신가요?' : '아직 계정이 없으신가요?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup');
              setError('');
              setNotice('');
            }}
            style={{ background: 'none', border: 'none', color: '#DD2A7B', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            {mode === 'signup' ? '로그인' : '회원가입'}
          </button>
        </p>
      </div>
    </div>
  );
}
