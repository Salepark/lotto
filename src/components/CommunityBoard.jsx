import React, { useState } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import SectionEyebrow, { cardStyle, sectionTitleStyle } from './SectionEyebrow';
import { INITIAL_POSTS } from '../data/dummyData';

export default function CommunityBoard({ user, onRequireLogin }) {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [message, setMessage] = useState('');

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.nickname || user?.email?.split('@')[0];

  function handleSend() {
    if (!user) {
      onRequireLogin();
      return;
    }
    const text = message.trim();
    if (!text) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setPosts((prev) => [...prev, { id: prev.length + 1, author: displayName || '회원', message: text, time }]);
    setMessage('');
    // TODO: 실제 서비스에서는 여기서 Supabase 테이블(posts)에 insert 하면 됩니다.
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <section aria-labelledby="board-heading" style={cardStyle}>
      <SectionEyebrow icon={<MessageCircle className="icon" style={{ width: 16, height: 16 }} />}>커뮤니티</SectionEyebrow>
      <h2 id="board-heading" style={sectionTitleStyle}>
        기록 게시판
      </h2>
      <p style={{ color: 'var(--sub)', margin: '4px 0 20px', fontSize: 14 }}>
        오늘 뽑은 번호나 당첨 후기를 자유롭게 남겨보세요.
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          maxHeight: 260,
          overflowY: 'auto',
          padding: '4px 2px',
          marginBottom: 16,
        }}
        aria-live="polite"
      >
        {posts.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              padding: '10px 14px',
              borderRadius: 16,
              background: 'var(--bg)',
              border: '1px solid var(--border)',
            }}
          >
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
                flexShrink: 0,
              }}
            >
              <User className="icon" style={{ width: 14, height: 14, color: '#fff' }} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{p.author}</span>
                <span style={{ fontSize: 11, color: 'var(--sub)' }}>{p.time}</span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: 14, wordBreak: 'break-word' }}>{p.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <label htmlFor="board-input" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          게시글 입력
        </label>
        <input
          id="board-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={user ? '메시지를 입력하세요' : '로그인 후 글을 남길 수 있어요'}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 999,
            border: '1px solid var(--border)',
            fontSize: 15,
            outline: 'none',
          }}
        />
        <button className="btn" onClick={handleSend} aria-label="게시글 등록">
          <Send className="icon" style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </section>
  );
}
