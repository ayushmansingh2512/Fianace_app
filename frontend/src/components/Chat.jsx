import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello! I'm ready to help with your financial questions. To provide you with the most relevant advice, could you please tell me what's on your mind? For example, are you interested in: \n* Budgeting or saving? \n* Investing? \n* Debt management? \n* Retirement planning? \n* Or a specific financial goal?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const contextData = localStorage.getItem('finance_ai_context');
            const payload = {
                message: input,
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

    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            height: 'calc(100vh - 160px)', // adjusted to exactly fit the remaining space below navbar/tabs
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* Chat History Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem 0 8rem 0', // bottom padding ensures the last message isn't hidden by the floating input
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
            }}>
                {messages.map((msg, i) => (
                    <div key={i} className="fade-in-up" style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        animationDelay: `${Math.min(i * 0.1, 0.4)}s`
                    }}>
                        {/* Avatar */}
                        <div className={msg.role === 'assistant' ? 'glowing-gradient-bg' : ''} style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: msg.role === 'user' ? 'var(--md-sys-color-surface-container-high)' : 'var(--md-sys-color-primary-container)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            border: 'none',
                            color: msg.role === 'assistant' ? '#111' : 'var(--md-sys-color-on-surface)'
                        }}>
                             <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>
                                 {msg.role === 'user' ? 'person' : 'smart_toy'}
                             </span>
                        </div>

                        {/* Message Bubble */}
                        <div style={{
                            maxWidth: '85%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <div style={{
                                padding: msg.role === 'user' ? '1rem 1.25rem' : '0.2rem 0',
                                borderRadius: msg.role === 'user' ? 'var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)' : '0',
                                background: msg.role === 'user' ? 'var(--md-sys-color-surface-container)' : 'transparent',
                                color: 'var(--md-sys-color-on-background)',
                                fontSize: '1.05rem',
                                lineHeight: '1.6'
                            }}>
                                <ReactMarkdown
                                    components={{
                                        p: ({ node, ...props }) => <p style={{ margin: '0 0 0.75rem 0' }} {...props} />,
                                        ul: ({ node, ...props }) => <ul style={{ margin: '0 0 0.75rem 1.5rem', padding: 0 }} {...props} />,
                                        ol: ({ node, ...props }) => <ol style={{ margin: '0 0 0.75rem 1.5rem', padding: 0 }} {...props} />,
                                        li: ({ node, ...props }) => <li style={{ marginBottom: '0.25rem' }} {...props} />
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="fade-in-up" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div className="glowing-gradient-bg" style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            color: '#111'
                        }}>
                            <span className="material-symbols-rounded animate-spin">sync</span>
                        </div>
                        <div style={{ padding: '0.5rem 0' }}>
                            <div className="glowing-gradient-text" style={{ fontWeight: 600 }}>Analyzing financial data...</div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Floating Input Area */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, var(--md-sys-color-background) 60%, transparent)',
                paddingTop: '2rem',
                paddingBottom: '1rem',
                zIndex: 10
            }}>
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    width: '100%',
                    maxWidth: '800px',
                    margin: '0 auto',
                    background: 'var(--md-sys-color-surface-container)',
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.5rem',
                    boxShadow: 'var(--elevation-mid)',
                    alignItems: 'center'
                }}>
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
                            fontSize: '1.05rem',
                            fontFamily: 'var(--font-family-sans)'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className={input.trim() ? "m3-fab glowing-gradient-bg" : "m3-fab"}
                        style={{
                            width: '44px',
                            height: '44px',
                            minWidth: '44px',
                            background: input.trim() ? '' : 'var(--md-sys-color-surface-container-high)',
                            color: input.trim() ? '#111' : 'var(--md-sys-color-outline)',
                            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <span className="material-symbols-rounded">send</span>
                    </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: '0.75rem', color: 'var(--md-sys-color-outline)' }}>
                    AI Advisor can make mistakes. Consider verifying important information.
                </div>
            </div>
        </div>
    );
};

export default Chat;
