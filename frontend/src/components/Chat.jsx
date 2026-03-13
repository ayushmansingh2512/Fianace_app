import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
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

            const response = await axios.post('http://localhost:8000/api/chat', payload);
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
            height: 'calc(100vh - 220px)', // adjust based on top nav/tabs
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
                    <div key={i} style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                    }}>
                        {/* Avatar */}
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: msg.role === 'user' ? '#444' : '#222',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            border: '1px solid #333'
                        }}>
                            {msg.role === 'user' ? <User size={20} color="#ccc" /> : <Bot size={20} color="#ececec" />}
                        </div>

                        {/* Message Bubble */}
                        <div style={{
                            maxWidth: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <div style={{
                                padding: msg.role === 'user' ? '1rem 1.25rem' : '0.5rem 0',
                                borderRadius: '16px',
                                background: msg.role === 'user' ? '#2f2f2f' : 'transparent',
                                color: '#ececec',
                                fontSize: '1.05rem',
                                lineHeight: '1.6'
                            }}>
                                <ReactMarkdown
                                    components={{
                                        p: ({ node, ...props }) => <p style={{ margin: '0 0 0.5rem 0' }} {...props} />,
                                        ul: ({ node, ...props }) => <ul style={{ margin: '0 0 0.5rem 1.5rem', padding: 0 }} {...props} />,
                                        ol: ({ node, ...props }) => <ol style={{ margin: '0 0 0.5rem 1.5rem', padding: 0 }} {...props} />,
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
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#222',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            border: '1px solid #333'
                        }}>
                            <Bot size={20} color="#ececec" />
                        </div>
                        <div style={{ padding: '0.5rem 0' }}>
                            <Loader2 className="animate-spin" size={24} color="#888" />
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
                background: 'linear-gradient(to top, #1A1A1A 60%, transparent)',
                paddingTop: '2rem',
                paddingBottom: '1rem'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    width: '100%',
                    maxWidth: '800px',
                    margin: '0 auto',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '24px',
                    padding: '0.5rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
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
                            color: '#fff',
                            outline: 'none',
                            fontSize: '1.05rem'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        style={{
                            padding: '0.8rem',
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            background: input.trim() ? '#ECECEC' : '#444',
                            border: 'none',
                            color: input.trim() ? '#111' : '#888',
                            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            flexShrink: 0
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: '0.75rem', color: '#666' }}>
                    AI Advisor can make mistakes. Consider verifying important information.
                </div>
            </div>
        </div>
    );
};

export default Chat;
