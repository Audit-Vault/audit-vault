import { useState, useEffect } from 'react';
import { Download, AlertTriangle, ChevronDown, ChevronUp, Shield, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { AuditReport } from '../App';

interface ExecutiveDashboardProps {
  report: AuditReport;
  serverName: string;
  onBack: () => void;
}
const SEV = {
  critical: { label: 'Critical', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' },
  high:     { label: 'High',     color: '#fb923c', bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.25)'  },
  medium:   { label: 'Medium',   color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.25)'  },
  low:      { label: 'Low',      color: '#a3e635', bg: 'rgba(163,230,53,0.08)',  border: 'rgba(163,230,53,0.25)'  },
};
const RISK_COLOR = { low: '#4ade80', medium: '#fbbf24', high: '#fb923c', critical: '#f87171' };

const severityColors = {
  low: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  medium: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  high: 'text-red-400 bg-red-500/10 border-red-500/30',
  critical: 'text-purple-400 bg-pgiturple-500/10 border-purple-500/30',
};

const riskLevelColors = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};
function useTypewriter(text, speed = 14) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(''); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++; setShown(text.slice(0, i));
      if (i >= text.length) { setDone(true); clearInterval(iv); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return { shown, done };
}
  function ScoreRing({ score, size = 130 }) {
    const r = size * 0.37, circ = 2 * Math.PI * r;
    const [p, setP] = useState(0);
    useEffect(() => { const t = setTimeout(() => setP(score), 300); return () => clearTimeout(t); }, [score]);
    const color = score >= 75 ? '#4ade80' : score >= 50 ? '#fbbf24' : score >= 30 ? '#fb923c' : '#f87171';
    const label = score >= 75 ? 'Good' : score >= 50 ? 'Fair' : score >= 30 ? 'Poor' : 'Critical';
    return (
      <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.07}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.07}
            strokeDasharray={`${(p/100)*circ} ${circ}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 8px ${color}88)` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size*0.3, fontWeight: 800, color, lineHeight: 1, fontFamily: "'Syne', sans-serif" }}>{score}</span>
          <span style={{ fontSize: size*0.1, color: 'rgba(255,255,255,0.35)', marginTop: 2, letterSpacing: 1 }}>{label}</span>
        </div>
      </div>
    );
  }
export function ExecutiveDashboard({ report, serverName, onBack }: ExecutiveDashboardProps) {
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState('issues');
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [summaryText, setSummaryText] = useState('');
  //const { shown: summaryShown, done: summaryDone } = useTypewriter(report.summary);
  const riskColor = RISK_COLOR[report.riskLevel] || '#fb923c';
  const critCount = report.issues.filter(i => i.severity === 'critical').length;
  const highCount = report.issues.filter(i => i.severity === 'high').length;
  const medCount  = report.issues.filter(i => i.severity === 'medium').length;
  const lowCount  = report.issues.filter(i => i.severity === 'low').length;
  const [isTyping, setIsTyping] = useState(true);


  // Typewriter effect for summary
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= report.summary.length) {
        setSummaryText(report.summary.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [report.summary]);

  const handleDownload = () => {
    // In production, this would generate and download a real PDF
    const blob = new Blob(['AuditVault Security Report - ' + serverName], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditvault-${serverName}-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

 
  

  return (
    <div className="min-h-screen p-6 bg-slate-950">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">AuditVault Security Report</h1>
            </div>
            <p className="text-slate-400">
              Server: <span className="text-white font-medium">{serverName}</span> • 
              Generated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <Button
            onClick={handleDownload}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Score Cards */}
        <div className="card" style={{ animationDelay: '0.05s', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 13, marginBottom: 14 }}>
          {/* Score */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '22px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Security Score</div>
            <ScoreRing score={report.score} size={128} />
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Out of 100</div>
          </div>

         {/* Risk */}
         <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '22px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Risk Level</div>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: `radial-gradient(circle,${riskColor}1e 0%,transparent 70%)`, border: `2px solid ${riskColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px ${riskColor}33` }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={riskColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 25, fontWeight: 800, color: riskColor, textTransform: 'uppercase', letterSpacing: 1 }}>{report.riskLevel}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>Overall assessment</div>
          </div>
          {/* Breakdown */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '22px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 2 }}>Issues Found</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 46, fontWeight: 800, color: '#f1f5f9', lineHeight: 1, marginBottom: 12 }}>{report.issues.length}</div>
            {[{ count: critCount, label: 'Critical', color: '#f87171' }, { count: highCount, label: 'High', color: '#fb923c' }, { count: medCount, label: 'Medium', color: '#fbbf24' }, { count: lowCount, label: 'Low', color: '#a3e635' }].filter(r => r.count > 0).map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.color, flexShrink: 0 }}/>
                <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                  <div style={{ height: '100%', borderRadius: 99, background: row.color, width: `${(row.count / report.issues.length) * 100}%`, transition: 'width 1s ease' }}/>
                </div>
                <div style={{ fontSize: 11, color: row.color, fontWeight: 700, minWidth: 10 }}>{row.count}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', minWidth: 44 }}>{row.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">Executive Summary</h2>
            <div className="ml-auto px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs text-cyan-400 font-semibold">
              AI Generated
            </div>
          </div>
          <p className="text-slate-300 leading-relaxed text-lg">
            {summaryText}
            {isTyping && <span className="inline-block w-1 h-5 bg-cyan-400 ml-1 animate-pulse"></span>}
          </p>
        </div>

        <div className="card" style={{ animationDelay: '0.17s', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 18px', background: 'rgba(0,0,0,0.18)' }}>
            {[{ id: 'issues', label: 'Security Issues', count: report.issues.length }, { id: 'actions', label: 'Action Plan', count: report.actionPlan.length }].map(tab => (
              <button key={tab.id} className="tab" onClick={() => setActiveTab(tab.id)} style={{ padding: '13px 13px 11px', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #38bdf8' : '2px solid transparent', color: activeTab === tab.id ? '#f1f5f9' : 'rgba(255,255,255,0.28)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                {tab.label}
                <div style={{ padding: '1px 6px', borderRadius: 20, background: activeTab === tab.id ? 'rgba(56,189,248,0.14)' : 'rgba(255,255,255,0.06)', color: activeTab === tab.id ? '#38bdf8' : 'rgba(255,255,255,0.22)', fontSize: 10, fontWeight: 700 }}>{tab.count}</div>
              </button>
            ))}
          </div>

          {activeTab === 'issues' && (
            <div style={{ padding: '4px 0' }}>
              {report.issues.map((issue, i) => {
                const sev = SEV[issue.severity] || SEV.low;
                const isOpen = expanded === i;
                return (
                  <div key={i} style={{ borderBottom: i < report.issues.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <button className="issue-row" onClick={() => setExpanded(isOpen ? null : i)} style={{ width: '100%', padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 11, background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', textAlign: 'left' }}>
                      <div style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, background: sev.bg, border: `1px solid ${sev.border}`, color: sev.color, whiteSpace: 'nowrap', flexShrink: 0, textTransform: 'uppercase' }}>{sev.label}</div>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{issue.title}</div>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '2px 18px 16px 58px', background: 'rgba(0,0,0,0.18)', borderTop: '1px solid rgba(255,255,255,0.05)', animation: 'fadeUp 0.2s ease both' }}>
                        <div style={{ paddingTop: 12, marginBottom: 10 }}>
                          <div style={{ fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,0.28)', marginBottom: 5, textTransform: 'uppercase' }}>What this means</div>
                          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>{issue.description}</p>
                        </div>
                        <div style={{ padding: '10px 13px', borderRadius: 9, background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.14)' }}>
                          <div style={{ fontSize: 10, letterSpacing: 1.5, color: '#38bdf8', marginBottom: 4, textTransform: 'uppercase' }}>Recommended fix</div>
                          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: 1.7 }}>{issue.recommendation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'actions' && (
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.actionPlan.map((action, i) => (
                <div key={i} className="action-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '11px 13px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.15s', animation: `fadeUp 0.4s ease both ${i*0.06}s` }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: 1.65, paddingTop: 2 }}>{action}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Report generated by <span className="text-cyan-400 font-semibold">AuditVault</span> • Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}