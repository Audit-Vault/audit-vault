import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from './hooks/useCurrentUser';

interface LandingPageProps {
  onGetStarted: () => void;

}

const Shield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}>
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);


 export function LandingPage({ onGetStarted }: LandingPageProps) {
  const navigate = useNavigate();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const isLoggedIn = !isLoadingUser && currentUser;

  function useIsMobile() {
    const [mobile, setMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
      const fn = () => setMobile(window.innerWidth < 768);
      window.addEventListener("resize", fn);
      return () => window.removeEventListener("resize", fn);
    }, []);
    return mobile;
  }

    const isMobile = useIsMobile();

    return (
      <div style={{
        minHeight: "100vh",
        background: "#f5ebe0",
        color: "#e2e8f0",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        overflowX: "hidden",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse-glow { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.08); } }
          @keyframes blink { 50% { opacity: 0; } }
          @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
          .fade1 { animation: fadeUp 0.6s ease both 0.0s; }
          .fade2 { animation: fadeUp 0.6s ease both 0.15s; }
          .fade3 { animation: fadeUp 0.6s ease both 0.3s; }
          .fade4 { animation: fadeUp 0.6s ease both 0.45s; }
          .fade5 { animation: fadeUp 0.6s ease both 0.6s; }
          .cta-btn:hover { transform: scale(1.05); }
          .cta-btn:hover .arrow-icon { transform: translateX(4px); }
          .arrow-icon { transition: transform 0.2s; display: inline-flex; vertical-align: middle; margin-left: 8px; }
          .terminal-line { animation: slideIn 0.4s ease both; }
          .tl1 { animation-delay: 0.8s; }
          .tl2 { animation-delay: 1.1s; }
          .tl3 { animation-delay: 1.4s; }
          .tl4 { animation-delay: 1.7s; }
        `}</style>

        {/* Nav */}
        <nav style={{
          padding: isMobile ? "16px 20px" : "20px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 50,
          background: "#e3d5ca",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 36, height: 36 }}>
              <div style={{ position: "relative", width: 36, height: 36, background: "linear-gradient(135deg, #6B625E, #67493c)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
                <Shield />
              </div>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 26, fontWeight: 800, color: "#6B625E", }}>
              AuditVault
            </span>
          </div>
          {!isMobile && (
            <button onClick={() => navigate(isLoggedIn ? '/dashboard' : '/auth')} className="cta-btn" style={{
              padding: "9px 22px", borderRadius: 9, fontSize: 14, fontWeight: 600,
              background: "#d5bdaf",
              border: "solid 2px #f5ebe0", color: "#fff", cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit"
            }}>
              {isLoggedIn ? 'Go to Dashboard' : 'Get started free'}
            </button>
          )}
        </nav>

        {/* Hero */}
        <section style={{ padding: isMobile ? "56px 20px 48px" : "80px 48px 72px", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
          <div className="fade1" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 99,
            background: "#d5bdaf",
            color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: 1.2,
            marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "pulse-glow 2s infinite" }}/>
            AI-POWERED SERVER SECURITY AUDITING
          </div>

          <h1 className="fade2" style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: isMobile ? 42 : 72,
          fontWeight: 700, lineHeight: 1.5,
          letterSpacing: -0.5, marginBottom: 28,
          color: "#f8fafc",
            textShadow: "0 5px 13px #c1b7ad"
        }}>
          Security Audits That<br/>
          <span style={{
            fontStyle: "italic",
              background: "#d6ccc2",
            display: "inline-block", textShadow: "none"
          }}>
            Speak Plain English
          </span>
        </h1>

          <p className="fade3" style={{
            fontSize: isMobile ? 16 : 19, color: "#888888", lineHeight: 1.75,
            maxWidth: 620, margin: "0 auto 40px",
          }}>
            Deploy a security agent with a single curl command. Get an AI-powered report
            with risk scores, summaries, and actionable recommendations.
          </p>

          <div className="fade4" style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <button onClick={() => navigate(isLoggedIn ? '/dashboard' : '/auth')} className="cta-btn" style={{
              padding: isMobile ? "14px 28px" : "16px 36px",
              borderRadius: 12, fontSize: isMobile ? 15 : 17, fontWeight: 700,
              background: "#d5bdaf",
              border: "none", color: "#fff", cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit", display: "inline-flex", alignItems: "center",
            }}>
              {isLoggedIn ? 'Go to Dashboard' : 'Start Your First Audit'}
              <span className="arrow-icon" style={{ width: 18, height: 18 }}><Arrow /></span>
            </button>
          </div>

          {/* Terminal */}
          <div className="fade5" style={{
            background: "rgba(15,23,42, .9)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
            overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            maxWidth: 680, margin: "0 auto",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "12px 18px",
              background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              {["#f87171","#fbbf24","#4ade80"].map(c => (
                <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.85 }}/>
              ))}
              <span style={{ marginLeft: 8, fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>terminal</span>
            </div>
            <div style={{ padding: isMobile ? "20px 18px" : "24px 28px", fontFamily: "'DM Mono', monospace", fontSize: isMobile ? 12 : 13, textAlign: "left", lineHeight: 1.9 }}>
              <div className="terminal-line tl1">
                <span style={{ color: "#4ade80" }}>$ </span>
                <span style={{ color: "#e2e8f0" }}>curl -fsSL https://auditvault.tech/install.sh | sh </span>
                <span style={{ color: "#38bdf8" }}>a4f2-9b3c-e71d-28af</span>
              </div>
              <div className="terminal-line tl2" style={{ color: "#64748b" }}>→ Installing AuditVault agent...</div>
              <div className="terminal-line tl3" style={{ color: "#64748b" }}>→ Scanning system configuration...</div>
              <div className="terminal-line tl4" style={{ color: "#4ade80" }}>✓ Scan complete. Report ready at https://auditvault.tech</div>
            </div>
          </div>
        </section>
      </div>
    );
  }
