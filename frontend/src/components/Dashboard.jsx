import React, { useState, useEffect } from 'react';

const Dashboard = ({ setActiveTab }) => {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const cachedData = localStorage.getItem('finance_ai_context');
        if (cachedData) {
            try {
                setProfileData(JSON.parse(cachedData));
            } catch (e) {}
        }
    }, [/* wait for modal changes */]);

    // Setup an interval to check local storage to re-render if profile is updated
    useEffect(() => {
        const interval = setInterval(() => {
            const cachedData = localStorage.getItem('finance_ai_context');
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData);
                    setProfileData(prev => JSON.stringify(prev) !== JSON.stringify(parsed) ? parsed : prev);
                } catch(e) {}
            } else {
                setProfileData(null);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fade-in-up" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0 4rem', width: '100%' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 className="heading" style={{ color: 'var(--md-sys-color-on-background)', marginBottom: '0.5rem', fontSize: '2.5rem' }}>Welcome to FinGlass</h2>
                <p style={{ color: 'var(--md-sys-color-outline)', margin: 0, fontSize: '1.1rem' }}>Your personal financial command center powered by AI.</p>
            </div>

            {profileData ? (
                <div className="m3-card-elevated" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '48px', color: 'var(--md-sys-color-primary)', marginBottom: '1rem' }}>
                        account_balance
                    </span>
                    <h3 className="heading" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Profile Active</h3>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                        Your financial context is securely cached in your browser. The AI Advisor and Market Insights are ready to provide personalized recommendations based on your {profileData.city ? `${profileData.city} location` : 'profile'}.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button 
                            className="m3-btn-filled" 
                            onClick={() => setActiveTab('chat')}
                        >
                            <span className="material-symbols-rounded">chat</span>
                            Ask AI Advisor
                        </button>
                        <button 
                            className="m3-btn-tonal" 
                            onClick={() => setActiveTab('market')}
                        >
                            <span className="material-symbols-rounded">trending_up</span>
                            View Market Insights
                        </button>
                    </div>
                </div>
            ) : (
                <div className="m3-card-elevated" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '48px', color: 'var(--md-sys-color-error)', marginBottom: '1rem' }}>
                        person_off
                    </span>
                    <h3 className="heading" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Profile Incomplete</h3>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        Please complete your financial profile by clicking the profile icon in the top right corner. This allows the AI to give you accurate advice.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
