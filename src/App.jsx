import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import LottoGenerator from './components/LottoGenerator';
import LastWeekNumbers from './components/LastWeekNumbers';
import CommunityBoard from './components/CommunityBoard';
import MyPage from './components/MyPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [view, setView] = useState('home'); // 'home' | 'mypage'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setShowAuthModal(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setView('home');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
        onLogoutClick={handleLogout}
        onMyPageClick={() => setView('mypage')}
      />

      {view === 'mypage' && user ? (
        <MyPage user={user} onBack={() => setView('home')} />
      ) : (
        <main
          style={{
            maxWidth: 640,
            margin: '0 auto',
            padding: '28px 20px 60px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <LottoGenerator />
          <LastWeekNumbers />
          <CommunityBoard user={user} onRequireLogin={() => setShowAuthModal(true)} />
        </main>
      )}

      {!authLoading && showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
