import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import axios from 'axios';

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/dashboard');
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
    <div className="min-h-screen">
      <Navbar />

      <main className="container">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            className={activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('dashboard')}
            style={{ padding: '0.6rem 2rem', opacity: activeTab === 'dashboard' ? 1 : 0.6 }}
          >
            Dashboard
          </button>
          <button
            className={activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('chat')}
            style={{ padding: '0.6rem 2rem', opacity: activeTab === 'chat' ? 1 : 0.6 }}
          >
            AI Advisor
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>Loading your financial data...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard data={dashboardData} />}
            {activeTab === 'chat' && <Chat />}
          </>
        )}
      </main>

      <footer style={{
        marginTop: '5rem',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <p>© 2024 FinGlass - Premium AI Finance Assistant</p>
      </footer>
    </div>
  );
}

export default App;
