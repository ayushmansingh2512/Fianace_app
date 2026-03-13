import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const quickPrompts = [
    "Analyze my budget",
    "Current Market Update",
    "How to save for a house?",
    "Log a $50 grocery expense"
];

const Chat = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello! I'm ready to help with your financial questions. To provide you with the most relevant advice, could you please tell me what's on your mind? For example, are you interested in: \n* Budgeting or saving? \n* Investing? \n* Debt management? \n* Retirement planning? \n* Or a specific financial goal?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Modal Bottom Sheet State
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [bottomSheetData, setBottomSheetData] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (textToSend = input) => {
        if (!textToSend.trim()) return;

        const userMessage = { role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const contextData = localStorage.getItem('finance_ai_context');
            const payload = {
                message: textToSend,
                context: contextData ? JSON.parse(contextData) : null
            };

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await axios.post(`${API_URL}/api/chat`, payload);
            setMessages(prev => [...prev, { role: 'assistant', text: response.data.response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error. Is the backend running?' }]);
        } finally {
            setLoading(false);
        }
    };

    const handlePromptClick = (prompt) => {
        handleSend(prompt);
    };

    const openBottomSheet = (data) => {
        setBottomSheetData(data);
        setShowBottomSheet(true);
    };

    const closeBottomSheet = () => {
        setShowBottomSheet(false);
        setTimeout(() => setBottomSheetData(null), 300); // clear after animation
    };

    // Helper to extract JSON and render the rest
    const renderMessageContent = (text) => {
        const jsonRegex = /```json\n([\s\S]*?)\n```/;
        const match = text.match(jsonRegex);
        
        if (match) {
            const cleanText = text.replace(jsonRegex, '').trim();
            let parsedData = null;
            try {
                parsedData = JSON.parse(match[1]);
            } catch (e) {
                console.error("Failed to parse JSON from AI", e);
            }

            return (
                <div>
                     <ReactMarkdown
                        components={{
                            p: ({ node, ...props }) => <p style={{ margin: '0 0 0.75rem 0' }} {...props} />,
                            ul: ({ node, ...props }) => <ul style={{ margin: '0 0 0.75rem 1.5rem', padding: 0 }} {...props} />,
                            ol: ({ node, ...props }) => <ol style={{ margin: '0 0 0.75rem 1.5rem', padding: 0 }} {...props} />,
                            li: ({ node, ...props }) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
                            h1: ({ node, ...props }) => <h3 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--md-sys-color-primary)' }} {...props} />,
                            h2: ({ node, ...props }) => <h4 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--md-sys-color-secondary)' }} {...props} />
                        }}
                    >
                        {cleanText}
                    </ReactMarkdown>
                    {parsedData && (
                        <button 
                            onClick={() => openBottomSheet(parsedData)}
                            className="m3-btn-filled"
                            style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', background: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)' }}
                        >
                            <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>bar_chart</span>
                            View Data Projection
                        </button>
                    )}
                </div>
            );
        }

        return (
             <ReactMarkdown
                components={{
                    p: ({ node, ...props }) => <p style={{ margin: '0 0 0.75rem 0' }} {...props} />,
                    ul: ({ node, ...props }) => <ul style={{ margin: '0 0 0.75rem 1.5rem', padding: 0 }} {...props} />,
                    ol: ({ node, ...props }) => <ol style={{ margin: '0 0 0.75rem 1.5rem', padding: 0 }} {...props} />,
                    li: ({ node, ...props }) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
                    h1: ({ node, ...props }) => <h3 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--md-sys-color-primary)' }} {...props} />,
                    h2: ({ node, ...props }) => <h4 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--md-sys-color-secondary)' }} {...props} />
                }}
            >
                {text}
            </ReactMarkdown>
        );
    };

    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            paddingBottom: '160px', // space for fixed input bar at bottom
        }}>
            {/* Chat History Area - scrolls with the page */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                padding: '1rem 0.5rem',
            }}>
                {messages.map((msg, i) => (
                    <div key={i} className="fade-in-up" style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-end', // anchor to bottom of message
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    }}>
                        {/* Avatar */}
                        {msg.role === 'assistant' ? (
                             <div className="glowing-gradient-bg" style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                color: '#111'
                            }}>
                                 <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>smart_toy</span>
                            </div>
                        ) : (
                             <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                background: 'var(--md-sys-color-surface-container-high)',
                                color: 'var(--md-sys-color-on-surface)'
                            }}>
                                 <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>person</span>
                            </div>
                        )}

                        {/* Message Bubble */}
                        <div style={{
                            maxWidth: '85%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <div style={{
                                padding: msg.role === 'user' ? '0.75rem 1rem' : '0.5rem 1rem',
                                borderRadius: msg.role === 'user' ? 'var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)' : 'var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)',
                                background: msg.role === 'user' ? 'var(--md-sys-color-surface-container-high)' : 'var(--md-sys-color-surface-container-low)',
                                color: 'var(--md-sys-color-on-background)',
                                fontSize: '1rem',
                                lineHeight: '1.5',
                                boxShadow: msg.role === 'user' ? 'none' : 'var(--elevation-low)',
                                border: msg.role === 'user' ? 'none' : '1px solid var(--md-sys-color-surface-container)',
                                overflowX: 'hidden'
                            }}>
                                {renderMessageContent(msg.text)}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="fade-in-up" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                        <div className="glowing-gradient-bg" style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#111'
                        }}>
                            <span className="material-symbols-rounded animate-spin" style={{ fontSize: '18px' }}>sync</span>
                        </div>
                        <div style={{ padding: '0.5rem 1rem', background: 'var(--md-sys-color-surface-container-low)', borderRadius: '8px 24px 24px 24px' }}>
                            <div className="glowing-gradient-text" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Analyzing data...</div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Fixed Bottom Input Bar */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, var(--md-sys-color-background) 75%, transparent)',
                paddingTop: '2rem',
                paddingBottom: '1.25rem',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                alignItems: 'center',
            }}>
                {/* Horizontal Scrolling Chips */}
                {!loading && messages.length < 3 && (
                    <div style={{
                        display: 'flex',
                        overflowX: 'auto',
                        padding: '0 0.5rem',
                        gap: '0.5rem',
                        msOverflowStyle: 'none',  /* IE and Edge */
                        scrollbarWidth: 'none',  /* Firefox */
                        WebkitOverflowScrolling: 'touch'
                    }} className="no-scrollbar fade-in-up">
                         <style>{`
                            .no-scrollbar::-webkit-scrollbar { display: none; }
                        `}</style>
                        {quickPrompts.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handlePromptClick(prompt)}
                                style={{
                                    background: 'var(--md-sys-color-surface-container)',
                                    border: '1px solid var(--md-sys-color-outline-variant)',
                                    borderRadius: 'var(--radius-pill)',
                                    padding: '0.5rem 1rem',
                                    color: 'var(--md-sys-color-on-surface)',
                                    fontSize: '0.9rem',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    minHeight: '40px', // Touch target min
                                }}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Field with Pulsing Gradient Border */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    width: '100%',
                    maxWidth: '800px',
                    margin: '0 auto',
                    background: 'var(--md-sys-color-surface-container)',
                    borderRadius: '32px',
                    padding: '4px', // Space for gradient border
                    boxShadow: 'var(--elevation-mid)',
                    alignItems: 'center',
                    // The Gemini pulsing effect when loading
                    position: 'relative',
                }}>
                    {loading && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            borderRadius: '32px',
                            background: 'linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary), var(--md-sys-color-primary))',
                            backgroundSize: '200% 200%',
                            animation: 'gradientPulse 2s ease infinite',
                            zIndex: -1,
                            margin: '-2px' // explode out slightly
                        }} />
                    )}
                    <style>{`
                        @keyframes gradientPulse {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                    `}</style>
                    
                    <div style={{ display: 'flex', width: '100%', background: 'var(--md-sys-color-surface)', borderRadius: '28px', padding: '0.3rem', alignItems: 'center' }}>
                         <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Message AI Advisor..."
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                padding: '0.8rem 1.2rem',
                                color: 'var(--md-sys-color-on-background)',
                                outline: 'none',
                                fontSize: '1rem',
                                fontFamily: 'var(--font-family-sans)'
                            }}
                        />
                        <button
                            onClick={() => handleSend(input)}
                            disabled={loading || !input.trim()}
                            className={input.trim() ? "glowing-gradient-bg" : ""}
                            style={{
                                width: '48px', // M3 min touch target
                                height: '48px',
                                borderRadius: '50%',
                                border: 'none',
                                background: input.trim() ? '' : 'transparent',
                                color: input.trim() ? '#111' : 'var(--md-sys-color-outline)',
                                cursor: loading || !input.trim() ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span className="material-symbols-rounded">
                                {input.trim() ? 'send' : 'mic'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Bottom Sheet */}
            {showBottomSheet && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}>
                    <div className="fade-in-up" style={{
                        background: 'var(--md-sys-color-surface)',
                        borderTopLeftRadius: '28px',
                        borderTopRightRadius: '28px',
                        padding: '1.5rem',
                        height: '70vh', // Takes up 70% of screen
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 'var(--elevation-high)'
                    }}>
                        {/* Drag Handle */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <div style={{ width: '32px', height: '4px', background: 'var(--md-sys-color-outline-variant)', borderRadius: '2px' }} />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 className="heading" style={{ margin: 0, fontSize: '1.5rem', color: 'var(--md-sys-color-on-surface)' }}>Data Projection</h3>
                            <button onClick={closeBottomSheet} style={{ background: 'transparent', border: 'none', color: 'var(--md-sys-color-on-surface-variant)', cursor: 'pointer', padding: '0.5rem' }}>
                                <span className="material-symbols-rounded">close</span>
                            </button>
                        </div>

                        <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                            {bottomSheetData && Array.isArray(bottomSheetData) ? (
                                <ResponsiveContainer>
                                    <AreaChart data={bottomSheetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                        <linearGradient id="colorSheet" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--md-sys-color-primary)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--md-sys-color-primary)" stopOpacity={0} />
                                        </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--md-sys-color-surface-container-high)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--md-sys-color-outline)', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--md-sys-color-outline)', fontSize: 12 }} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'var(--md-sys-color-surface)', border: '1px solid var(--md-sys-color-outline)', borderRadius: 'var(--radius-md)' }}
                                            itemStyle={{ color: 'var(--md-sys-color-primary)' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="var(--md-sys-color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSheet)" animationDuration={1000} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                 <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--md-sys-color-outline)' }}>
                                     Invalid graph data format received from AI.
                                 </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
