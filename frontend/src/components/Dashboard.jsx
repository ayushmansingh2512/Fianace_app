import React, { useState, useEffect } from 'react';
import { IndianRupee, Home, CreditCard, PiggyBank, AlertTriangle, Save, Check, MapPin, Trash2 } from 'lucide-react';

const Dashboard = () => {
    // State for user financial context
    const [formData, setFormData] = useState({
        salary: '',
        rent: '',
        groceries: '',
        utilities: '',
        otherExpenses: '',
        savingsGoal: '',
        city: ''
    });

    const [saved, setSaved] = useState(false);

    // Load from cache on mount
    useEffect(() => {
        const cachedData = localStorage.getItem('finance_ai_context');
        if (cachedData) {
            try {
                setFormData(JSON.parse(cachedData));
            } catch (e) {
                console.error("Error loading cached data", e);
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Allow select (city) and numbers for others
        if (name === 'city' || value === '' || /^\d+$/.test(value)) {
            setFormData(prev => ({ ...prev, [name]: value }));
            setSaved(false);
        }
    };

    const handleSave = () => {
        localStorage.setItem('finance_ai_context', JSON.stringify(formData));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleClear = () => {
        localStorage.removeItem('finance_ai_context');
        setFormData({
            salary: '',
            rent: '',
            groceries: '',
            utilities: '',
            otherExpenses: '',
            savingsGoal: '',
            city: ''
        });
        setSaved(false);
    };

    const inputStyle = {
        width: '100%',
        background: '#2a2a2a',
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '0.8rem 1rem 0.8rem 2.8rem',
        color: '#fff',
        outline: 'none',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
        appearance: 'none' // useful for standardizing select dropdowns
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#ececec',
        fontWeight: '500',
        fontSize: '0.9rem'
    };

    const iconContainerStyle = {
        position: 'absolute',
        left: '0.8rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#888',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none'
    };

    const formGroupStyle = {
        marginBottom: '1.5rem'
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 2rem 4rem' }}>

            {/* Warning Banner */}
            <div style={{
                background: 'rgba(242, 153, 74, 0.1)',
                border: '1px solid rgba(242, 153, 74, 0.3)',
                borderRadius: '12px',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                marginBottom: '2.5rem',
                color: '#f2994a'
            }}>
                <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>No Database Connected</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.9 }}>
                        Your data is not being saved to a permanent database. Instead, it is <b>temporarily cached in your browser</b> so the AI can use it to give you personalized advice. If you clear your browser data, this information will be lost.
                    </p>
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '2rem' }}>Financial Context Profile</h2>
                <p style={{ color: '#888', margin: 0 }}>Provide your baseline numbers so the AI Advisor can give you hyper-personalized recommendations.</p>
            </div>

            <div style={{
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
            }}>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0 2rem' }}>

                    {/* Income, Goals & Location */}
                    <div>
                        <h3 style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '1.2rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Core Info</h3>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>City of Residence</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><MapPin size={18} /></div>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
                                >
                                    <option value="" disabled>Select your city (Tier 1/2)</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi NCR">Delhi NCR</option>
                                    <option value="Pune">Pune</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Kolkata">Kolkata</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Monthly Salary (After Tax)</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><IndianRupee size={18} /></div>
                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="50000"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Monthly Savings Goal</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><PiggyBank size={18} /></div>
                                <input
                                    type="text"
                                    name="savingsGoal"
                                    value={formData.savingsGoal}
                                    onChange={handleChange}
                                    placeholder="10000"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fixed Expenses */}
                    <div>
                        <h3 style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '1.2rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Fixed Expenses</h3>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Monthly Rent / Mortgage</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><Home size={18} /></div>
                                <input
                                    type="text"
                                    name="rent"
                                    value={formData.rent}
                                    onChange={handleChange}
                                    placeholder="15000"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Groceries & Food</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><CreditCard size={18} /></div>
                                <input
                                    type="text"
                                    name="groceries"
                                    value={formData.groceries}
                                    onChange={handleChange}
                                    placeholder="6000"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Utilities & Internet</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><CreditCard size={18} /></div>
                                <input
                                    type="text"
                                    name="utilities"
                                    value={formData.utilities}
                                    onChange={handleChange}
                                    placeholder="2500"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
                    {saved && <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} /> Saved to Cache</span>}

                    <button
                        onClick={handleClear}
                        style={{
                            background: 'transparent',
                            color: '#888',
                            border: '1px solid #444',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ef4444';
                            e.currentTarget.style.borderColor = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#888';
                            e.currentTarget.style.borderColor = '#444';
                        }}
                    >
                        <Trash2 size={18} />
                        Clear Cache
                    </button>

                    <button
                        onClick={handleSave}
                        style={{
                            background: '#ececec',
                            color: '#111',
                            border: 'none',
                            padding: '0.8rem 2rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        <Save size={18} />
                        Save Context
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
