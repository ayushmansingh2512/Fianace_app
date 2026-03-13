import React from 'react';
import { Wallet, PieChart, MessageSquare, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="glass-nav">
      <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Wallet className="w-8 h-8 text-accent-blue" color="#3965BF" />
        <h1 className="text-xl font-bold">FinGlass</h1>
      </div>
      
      <div className="hidden md:flex gap-8" style={{ display: 'flex', gap: '2rem' }}>
        <a href="#" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Dashboard</a>
        <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Analysis</a>
        <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>AI Assistant</a>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn-primary">Connect Wallet</button>
      </div>
    </nav>
  );
};

export default Navbar;
