import React, { useState, useEffect } from 'react';

const ProfileModal = ({ onClose }) => {
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
    const [hasData, setHasData] = useState(false);

    // Load from cache on mount
    useEffect(() => {
        const cachedData = localStorage.getItem('finance_ai_context');
        if (cachedData) {
            try {
                setFormData(JSON.parse(cachedData));
                setHasData(true);
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
        setHasData(true);
        setTimeout(() => {
            setSaved(false);
            if (onClose) onClose();
        }, 1000);
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
        setHasData(false);
    };

    const iconContainerStyle = {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--md-sys-color-outline)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 1
    };

    const formGroupStyle = {
        marginBottom: '1.5rem',
        position: 'relative'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.4rem',
        color: 'var(--md-sys-color-on-surface)',
        fontWeight: '500',
        fontSize: '0.9rem'
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            overflowY: 'auto'
        }}>
            <div className="fade-in-up m3-card-elevated" style={{ 
                maxWidth: '800px', 
                width: '100%', 
                maxHeight: '90vh', 
                overflowY: 'auto',
                position: 'relative',
                backgroundColor: 'var(--md-sys-color-surface)'
            }}>
                
                {hasData && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <button 
                            onClick={onClose}
                            style={{
                                background: 'var(--md-sys-color-surface-container-high)',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--md-sys-color-on-surface-variant)',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <span className="material-symbols-rounded">close</span>
                        </button>
                    </div>
                )}

                {/* Warning Banner */}
                <div style={{
                    background: 'rgba(242, 184, 181, 0.1)',
                    border: '1px solid var(--md-sys-color-error)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    marginBottom: '2.5rem',
                    color: 'var(--md-sys-color-error)'
                }}>
                    <span className="material-symbols-rounded" style={{ flexShrink: 0, marginTop: '2px', color: 'inherit' }}>warning</span>
                    <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '600', fontFamily: 'var(--font-family-display)' }}>No Database Connected</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.9 }}>
                            Your data is not being saved to a permanent database. Instead, it is <b>temporarily cached in your browser</b> so the AI can use it to give you personalized advice. If you clear your browser data, this information will be lost.
                        </p>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h2 className="heading" style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '0.5rem', fontSize: '2rem' }}>Financial Context Profile</h2>
                    <p style={{ color: 'var(--md-sys-color-outline)', margin: 0 }}>Provide your baseline numbers so the AI Advisor can give you hyper-personalized recommendations.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0 2rem' }}>

                    {/* Income, Goals & Location */}
                    <div>
                        <h3 className="heading" style={{ color: 'var(--md-sys-color-primary)', marginBottom: '1.5rem', fontSize: '1.2rem', borderBottom: '1px solid var(--md-sys-color-surface-container-high)', paddingBottom: '0.5rem' }}>Core Info</h3>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>City of Residence</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><span className="material-symbols-rounded" style={{ fontSize: '20px' }}>location_on</span></div>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="m3-input-outlined"
                                    style={{ paddingLeft: '2.8rem', cursor: 'pointer', appearance: 'auto' }}
                                >
                                    <option value="" disabled>Select your city (Tier 1/2)</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi NCR">Delhi NCR</option>
                                    <option value="Pune">Pune</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value=" Chennai">Chennai</option>
                                    <option value="Kolkata">Kolkata</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Monthly Salary (After Tax)</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><span className="material-symbols-rounded" style={{ fontSize: '20px' }}>payments</span></div>
                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="50000"
                                    className="m3-input-outlined"
                                    style={{ paddingLeft: '2.8rem' }}
                                />
                            </div>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Monthly Savings Goal</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><span className="material-symbols-rounded" style={{ fontSize: '20px' }}>savings</span></div>
                                <input
                                    type="text"
                                    name="savingsGoal"
                                    value={formData.savingsGoal}
                                    onChange={handleChange}
                                    placeholder="10000"
                                    className="m3-input-outlined"
                                    style={{ paddingLeft: '2.8rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fixed Expenses */}
                    <div>
                        <h3 className="heading" style={{ color: 'var(--md-sys-color-primary)', marginBottom: '1.5rem', fontSize: '1.2rem', borderBottom: '1px solid var(--md-sys-color-surface-container-high)', paddingBottom: '0.5rem' }}>Fixed Expenses</h3>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Monthly Rent / Mortgage</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><span className="material-symbols-rounded" style={{ fontSize: '20px' }}>home</span></div>
                                <input
                                    type="text"
                                    name="rent"
                                    value={formData.rent}
                                    onChange={handleChange}
                                    placeholder="15000"
                                    className="m3-input-outlined"
                                    style={{ paddingLeft: '2.8rem' }}
                                />
                            </div>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Groceries & Food</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><span className="material-symbols-rounded" style={{ fontSize: '20px' }}>shopping_cart</span></div>
                                <input
                                    type="text"
                                    name="groceries"
                                    value={formData.groceries}
                                    onChange={handleChange}
                                    placeholder="6000"
                                    className="m3-input-outlined"
                                    style={{ paddingLeft: '2.8rem' }}
                                />
                            </div>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Utilities & Internet</label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconContainerStyle}><span className="material-symbols-rounded" style={{ fontSize: '20px' }}>bolt</span></div>
                                <input
                                    type="text"
                                    name="utilities"
                                    value={formData.utilities}
                                    onChange={handleChange}
                                    placeholder="2500"
                                    className="m3-input-outlined"
                                    style={{ paddingLeft: '2.8rem' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--md-sys-color-surface-container-high)', paddingTop: '1.5rem' }}>
                    {saved && <span className="fade-in-up" style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><span className="material-symbols-rounded" style={{ fontSize: '18px' }}>check</span> Saved!</span>}

                    <button
                        onClick={handleClear}
                        className="m3-btn-outlined"
                        style={{ color: 'var(--md-sys-color-error)', borderColor: 'var(--md-sys-color-error)' }}
                    >
                        <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>delete</span>
                        Clear Cache
                    </button>

                    <button
                        onClick={handleSave}
                        className="m3-btn-filled"
                        disabled={!formData.salary}
                    >
                        <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>save</span>
                        Save Context
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
