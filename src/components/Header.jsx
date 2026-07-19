import React from 'react';
import { Dices, LogIn, LogOut, User } from 'lucide-react';

export default function Header({ user, onLoginClick, onLogoutClick, onMyPageClick }) {
  const nickname =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.user_metadata?.nickname || user?.email || '회원';
  const avatarUrl = (user?.user_metadata?.avatar_url || user?.user_metadata?.picture)?.replace(/^http:\/\//, 'https://');

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--grad)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Dices className="icon" style={{ color: '#fff', width: 20, height: 20 }} />
        </span>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
            backgroundImage: 'var(--grad)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Bboggl Lotto
        </h1>
      </div>

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onMyPageClick}
            aria-label="마이페이지로 이동"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 500,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text)',
              padding: '4px 6px',
              borderRadius: 999,
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                width={28}
                height={28}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--grad)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User className="icon" style={{ width: 14, height: 14, color: '#fff' }} />
              </span>
            )}
            {nickname}
          </button>
          <button
            className="btn btn-outline"
            onClick={onLogoutClick}
            aria-label="로그아웃"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13 }}
          >
            <LogOut className="icon" style={{ width: 16, height: 16 }} />
            로그아웃
          </button>
        </div>
      ) : (
        <button
          className="btn btn-outline"
          onClick={onLoginClick}
          aria-label="로그인 또는 회원가입"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <LogIn className="icon" style={{ width: 18, height: 18 }} />
          로그인
        </button>
      )}
    </header>
  );
}
