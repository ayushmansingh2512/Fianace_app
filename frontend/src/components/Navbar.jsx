import React from 'react';

const Navbar = ({ onProfileClick }) => {
  return (
    <nav className="m3-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <span className="material-symbols-rounded" style={{ fontSize: '32px', color: 'var(--md-sys-color-primary)' }}>
          wallet
        </span>
        <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.5px' }}>FinGlass</h1>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          className="m3-btn-tonal" 
          onClick={onProfileClick}
          style={{ padding: '0.5rem', width: '40px', height: '40px', borderRadius: '50%' }}
        >
            <span className="material-symbols-rounded">account_circle</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
