import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Simulated stock data for a "Buy" recommendation
const data = [
  { name: 'Jan', price: 4000 },
  { name: 'Feb', price: 4200 },
  { name: 'Mar', price: 4100 },
  { name: 'Apr', price: 4600 },
  { name: 'May', price: 4800 },
  { name: 'Jun', price: 5200 },
  { name: 'Jul', price: 5900 },
];

const sectorData = [
  { name: 'Tech', perf: 4.5 },
  { name: 'Health', perf: 2.1 },
  { name: 'Fin', perf: 1.2 },
  { name: 'Energy', perf: -1.5 },
  { name: 'RE', perf: -0.8 },
];

const newsFeed = [
  { id: 1, title: 'Tech leads market rally as AI investments surge', source: 'Financial Times', time: '2 hours ago', tag: 'Tech' },
  { id: 2, title: 'Central Bank hints at stabilization of interest rates in Q4', source: 'Reuters', time: '4 hours ago', tag: 'Economy' },
  { id: 3, title: 'Energy sector faces headwinds due to global supply shifts', source: 'Bloomberg', time: '6 hours ago', tag: 'Energy' }
];

const MarketInsights = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="fade-in-up" style={{ marginTop: '1rem', paddingBottom: '3rem' }}>
        <h2 className="heading" style={{ color: 'var(--md-sys-color-on-background)', marginBottom: '1.5rem', fontSize: '2.2rem' }}>
            Market Intelligence
        </h2>

        {/* Top Grid: Main Graph + Top Movers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
            
            {/* Main AI Pick Graph */}
            <div className="m3-card-elevated" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 className="heading" style={{ color: 'var(--md-sys-color-primary)', fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="material-symbols-rounded">trending_up</span>
                            AI Top Pick: Global Tech ETF (GTX)
                        </h3>
                        <p style={{ color: 'var(--md-sys-color-outline)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>Projected 6-month growth based on current momentum.</p>
                    </div>
                    <div style={{ 
                        background: 'rgba(74, 222, 128, 0.1)', 
                        color: '#4ade80', 
                        padding: '0.4rem 1rem', 
                        borderRadius: 'var(--radius-pill)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        border: '1px solid rgba(74, 222, 128, 0.2)'
                    }}>
                        STRONG BUY
                    </div>
                </div>

                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--md-sys-color-primary)" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="var(--md-sys-color-primary)" stopOpacity={0} />
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--md-sys-color-surface-container-high)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--md-sys-color-outline)', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--md-sys-color-outline)', fontSize: 12 }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--md-sys-color-surface)', border: '1px solid var(--md-sys-color-outline)', borderRadius: 'var(--radius-md)' }}
                            itemStyle={{ color: 'var(--md-sys-color-primary)' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="var(--md-sys-color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" animationDuration={1500} animationEasing="ease-out" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--md-sys-color-on-surface-variant)' }}>
                        <strong>AI Analysis:</strong> Allocating 15% toward GTX aligns with your long-term growth horizon given the current tech shift from growth to value.
                    </p>
                </div>
            </div>

            {/* Top Movers */}
            <div className="m3-card-elevated" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                 <h3 className="heading" style={{ color: 'var(--md-sys-color-on-surface)', fontSize: '1.2rem', margin: '0 0 1rem 0' }}>Daily Top Movers</h3>
                 
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Gainer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                            <div style={{ fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>NVDA</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-outline)' }}>NVIDIA Corp</div>
                        </div>
                        <div style={{ textAlign: 'right', color: '#4ade80', fontWeight: 600 }}>
                            +4.25%
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>$135.20</div>
                        </div>
                    </div>
                    {/* Gainer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                            <div style={{ fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>TSLA</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-outline)' }}>Tesla Inc</div>
                        </div>
                        <div style={{ textAlign: 'right', color: '#4ade80', fontWeight: 600 }}>
                            +2.10%
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>$210.50</div>
                        </div>
                    </div>
                    {/* Loser */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                            <div style={{ fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>XOM</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-outline)' }}>Exxon Mobil</div>
                        </div>
                        <div style={{ textAlign: 'right', color: 'var(--md-sys-color-error)', fontWeight: 600 }}>
                            -1.85%
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>$102.30</div>
                        </div>
                    </div>
                    {/* Loser */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                            <div style={{ fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>PFE</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-outline)' }}>Pfizer Inc</div>
                        </div>
                        <div style={{ textAlign: 'right', color: 'var(--md-sys-color-error)', fontWeight: 600 }}>
                            -0.95%
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>$28.40</div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        {/* Bottom Grid: Sector Performance + News */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
            
            {/* Sector Performance */}
            <div className="m3-card-elevated" style={{ margin: 0 }}>
                <h3 className="heading" style={{ color: 'var(--md-sys-color-on-surface)', fontSize: '1.2rem', margin: '0 0 1rem 0' }}>Sector Performance</h3>
                <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                        <BarChart data={sectorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--md-sys-color-surface-container-high)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--md-sys-color-outline)', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--md-sys-color-outline)', fontSize: 12 }} />
                            <Tooltip 
                                cursor={{ fill: 'var(--md-sys-color-surface-container)' }}
                                contentStyle={{ backgroundColor: 'var(--md-sys-color-surface)', border: '1px solid var(--md-sys-color-outline)', borderRadius: 'var(--radius-md)' }}
                            />
                            <Bar 
                                dataKey="perf" 
                                radius={[4, 4, 0, 0]} 
                                fill="var(--md-sys-color-secondary)" 
                                animationDuration={1500}
                                cell={(props, index) => (
                                    <path {...props} fill={props.payload.perf > 0 ? '#4ade80' : 'var(--md-sys-color-error)'} />
                                )}
                            >
                                {
                                  sectorData.map((entry, index) => (
                                    <cell key={`cell-${index}`} fill={entry.perf > 0 ? '#4ade80' : 'var(--md-sys-color-error)'} />
                                  ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* News Feed */}
            <div className="m3-card-elevated" style={{ margin: 0 }}>
                <h3 className="heading" style={{ color: 'var(--md-sys-color-on-surface)', fontSize: '1.2rem', margin: '0 0 1rem 0' }}>AI Curated News</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {newsFeed.map((news) => (
                        <div key={news.id} style={{ borderBottom: news.id !== 3 ? '1px solid var(--md-sys-color-surface-container-high)' : 'none', paddingBottom: news.id !== 3 ? '1rem' : 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{news.tag}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-outline)' }}>{news.time}</span>
                            </div>
                            <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1rem', color: 'var(--md-sys-color-on-surface)', lineHeight: '1.4' }}>{news.title}</h4>
                            <div style={{ fontSize: '0.85rem', color: 'var(--md-sys-color-outline)' }}>{news.source}</div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    </div>
  );
};

export default MarketInsights;
