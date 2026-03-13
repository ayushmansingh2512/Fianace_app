import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Chat from './components/Chat';
import MarketInsights from './components/MarketInsights';
import ProfileModal from './components/ProfileModal';
import axios from 'axios';

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    // Check if profile is filled
    const cachedData = localStorage.getItem('finance_ai_context');
    if (!cachedData) {
      setShowProfileModal(true);
    }

    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${API_URL}/api/dashboard`);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      height: activeTab === 'chat' ? '100vh' : 'auto',
      overflow: activeTab === 'chat' ? 'hidden' : 'auto'
    }}>
      <Navbar onProfileClick={() => setShowProfileModal(true)} />

      <main className="container" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0 // critical for flex children to allow inner scrolling
      }}>
        <div style={{
          display: 'flex',
          background: 'var(--md-sys-color-surface-container)',
          borderRadius: 'var(--radius-pill)',
          padding: '0.25rem',
          width: 'fit-content',
          margin: '0 auto 1.5rem', // reduced bottom margin slightly
          flexShrink: 0
        }}>
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              background: activeTab === 'chat' ? 'var(--md-sys-color-secondary-container)' : 'transparent',
              color: activeTab === 'chat' ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
              boxShadow: activeTab === 'chat' ? 'var(--elevation-low)' : 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '0.5rem 2rem',
              fontWeight: 500
            }}
          >
            AI Advisor
          </button>
          <button
            onClick={() => setActiveTab('market')}
            style={{
              background: activeTab === 'market' ? 'var(--md-sys-color-secondary-container)' : 'transparent',
              color: activeTab === 'market' ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
              boxShadow: activeTab === 'market' ? 'var(--elevation-low)' : 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '0.5rem 2rem',
              fontWeight: 500
            }}
          >
            Market Insights
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>Loading your financial data...</div>
        ) : (
          <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {activeTab === 'chat' && <Chat />}
            {activeTab === 'market' && <MarketInsights />}
          </div>
        )}
      </main>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}

export default App;
