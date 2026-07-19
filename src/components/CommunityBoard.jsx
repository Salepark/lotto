import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import SectionEyebrow, { cardStyle, sectionTitleStyle } from './SectionEyebrow';
import { supabase } from '../lib/supabaseClient';

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function CommunityBoard({ user, onRequireLogin }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const listEndRef = useRef(null);

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.nickname || user?.email?.split('@')[0];

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('id, author, message, created_at')
        .order('created_at', { ascending: true })
        .limit(100);

      if (!active) return;
      if (fetchError) {
        setError('게시글을 불러오지 못했어요. supabase/posts.sql을 실행했는지 확인해 주세요.');
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }

    loadPosts();

    // 새 글이 올라오면 실시간으로 반영
    const channel = supabase
      .channel('posts-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          setPosts((prev) => (prev.some((p) => p.id === payload.new.id) ? prev : [...prev, payload.new]));
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [posts.length]);

  async function handleSend() {
    if (!user) {
      onRequireLogin();
      return;
    }
    const text = message.trim();
    if (!text) return;

    setSending(true);
    setError('');
    const { error: insertError } = await supabase.from('posts').insert({
      user_id: user.id,
      author: displayName || '회원',
      message: text,
    });

    if (insertError) {
      setError('등록에 실패했어요: ' + insertError.message);
    } else {
      setMessage('');
    }
    setSending(false);
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
        {loading && <p style={{ color: 'var(--sub)', fontSize: 14 }}>불러오는 중...</p>}
        {!loading && posts.length === 0 && (
          <p style={{ color: 'var(--sub)', fontSize: 14 }}>아직 게시글이 없어요. 첫 글을 남겨보세요!</p>
        )}
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
                <span style={{ fontSize: 11, color: 'var(--sub)' }}>{formatTime(p.created_at)}</span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: 14, wordBreak: 'break-word' }}>{p.message}</p>
            </div>
          </div>
        ))}
        <div ref={listEndRef} />
      </div>

      {error && (
        <p role="alert" style={{ color: '#DD2A7B', fontSize: 13, fontWeight: 500, margin: '0 0 12px' }}>
          {error}
        </p>
      )}

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
          placeholder={user ? '메시지 입력하세요' : '로그인 후 글을 남길 수 있어요'}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 999,
            border: '1px solid var(--border)',
            fontSize: 15,
            outline: 'none',
          }}
        />
        <button className="btn" onClick={handleSend} disabled={sending} aria-label="게시글 등록">
          <Send className="icon" style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </section>
  );
}
