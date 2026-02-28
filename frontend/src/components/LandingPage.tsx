import {CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

import React, { useEffect, useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;

}

const Shield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const Terminal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}>
    <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
  </svg>
);
const Zap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const Lock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}>
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);


 export function LandingPage({ onGetStarted }: LandingPageProps) {

  
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
    const [hovered, setHovered] = useState(null);
  
    const features = [
      {
        icon: <Terminal />,
        color: "#38bdf8",
        grad: "rgba(56,189,248,0.15)",
        glow: "rgba(56,189,248,0.25)",
        title: "One Command",
        desc: "Run a single curl command on your server. Our lightweight agent scans your infrastructure and sends encrypted data back.",
      },
      {
        icon: <Zap />,
        color: "#a78bfa",
        grad: "rgba(167,139,250,0.15)",
        glow: "rgba(167,139,250,0.25)",
        title: "AI Analysis",
        desc: "Google Gemini reads the raw scan data and translates technical findings into clear, actionable insights.",
      },
      {
        icon: <Lock />,
        color: "#34d399",
        grad: "rgba(52,211,153,0.15)",
        glow: "rgba(52,211,153,0.25)",
        title: "Executive Report",
        desc: "Get a risk score, plain-English summary, prioritized issues, and a downloadable PDF report—all in minutes.",
      },
    ];
  
    const trust = [
      { label: "Encrypted", desc: "End-to-end encryption for all scan data" },
      { label: "Non-Invasive", desc: "Read-only access, no system changes" },
      { label: "Privacy-First", desc: "Your data stays yours. No sharing." },
    ];
  
    const badges = [
      "Powered by Your AI Choice",
      "Enterprise-Ready",
      "No Credit Card Required",
    ];
  
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020818 0%, #0c1325 50%, #050d1f 100%)",
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
          .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(56,189,248,0.45) !important; }
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
          background: "rgba(2,8,24,0.8)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 36, height: 36 }}>
              <div style={{ position: "absolute", inset: 0, background: "#38bdf8", borderRadius: 9, filter: "blur(8px)", opacity: 0.5, animation: "pulse-glow 3s ease-in-out infinite" }}/>
              <div style={{ position: "relative", width: 36, height: 36, background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
                <Shield />
              </div>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, background: "linear-gradient(90deg, #7dd3fc, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AuditVault
            </span>
          </div>
          {!isMobile && (
            <button onClick={onGetStarted} className="cta-btn" style={{
              padding: "9px 22px", borderRadius: 9, fontSize: 14, fontWeight: 600,
              background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
              border: "none", color: "#fff", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(56,189,248,0.3)", transition: "all 0.2s",
              fontFamily: "inherit",
            }}>
              Get started free
            </button>
          )}
        </nav>
  
        {/* Hero */}
        <section style={{ padding: isMobile ? "56px 20px 48px" : "80px 48px 72px", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
          <div className="fade1" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 99,
            background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)",
            color: "#7dd3fc", fontSize: 12, fontWeight: 600, letterSpacing: 1.2,
            marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8", animation: "pulse-glow 2s infinite" }}/>
            AI-POWERED SERVER SECURITY AUDITING
          </div>
  
          <h1 className="fade2" style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: isMobile ? 42 : 72,
          fontWeight: 700, lineHeight: 1.18,
          letterSpacing: -0.5, marginBottom: 28,
          color: "#f8fafc",
        }}>
          Security Audits That<br/>
          <span style={{
            fontStyle: "italic",
            background: "linear-gradient(90deg, #7dd3fc 0%, #38bdf8 50%, #67e8f9 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}>
            Speak Plain English
          </span>
        </h1>
  
          <p className="fade3" style={{
            fontSize: isMobile ? 16 : 19, color: "#94a3b8", lineHeight: 1.75,
            maxWidth: 620, margin: "0 auto 40px",
          }}>
            Deploy a security agent with a single curl command. Get an AI-powered executive report
            with risk scores, plain-language summaries, and actionable recommendations — all in minutes.
          </p>
  
          <div className="fade4" style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <button onClick={onGetStarted} className="cta-btn" style={{
              padding: isMobile ? "14px 28px" : "16px 36px",
              borderRadius: 12, fontSize: isMobile ? 15 : 17, fontWeight: 700,
              background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
              border: "none", color: "#fff", cursor: "pointer",
              boxShadow: "0 6px 28px rgba(56,189,248,0.35)", transition: "all 0.2s",
              fontFamily: "inherit", display: "inline-flex", alignItems: "center",
            }}>
              Start Your First Audit
              <span className="arrow-icon" style={{ width: 18, height: 18 }}><Arrow /></span>
            </button>
          </div>
  
          {/* Badges */}
          <div className="fade4" style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center",
            gap: isMobile ? "10px 16px" : 24, marginBottom: 56,
          }}>
            {badges.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#94a3b8" }}>
                <div style={{ width: 18, height: 18, color: "#4ade80", flexShrink: 0 }}><Check /></div>
                {b}
              </div>
            ))}
          </div>
  
          {/* Terminal */}
          <div className="fade5" style={{
            background: "rgba(15,23,42,0.7)", backdropFilter: "blur(12px)",
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
              <div className="terminal-line tl4" style={{ color: "#4ade80" }}>✓ Scan complete. Report ready at app.auditvault.tech</div>
            </div>
          </div>
        </section>
  
        {/* How It Works */}
        <section style={{ padding: isMobile ? "48px 20px" : "72px 48px", maxWidth: 1100, margin: "0 auto" }}>
          <h3 style={{
            fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 26 : 34,
            fontWeight: 800, textAlign: "center", color: "#f8fafc",
            marginBottom: isMobile ? 36 : 52, letterSpacing: -0.5,
          }}>
            How It Works
          </h3>
  
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? 16 : 24,
          }}>
            {features.map((f, i) => (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === i ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.6)",
                  backdropFilter: "blur(12px)",
                  border: hovered === i ? `1px solid ${f.color}55` : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 18, padding: isMobile ? "24px 22px" : "32px 28px",
                  transition: "all 0.25s",
                  boxShadow: hovered === i ? `0 16px 40px ${f.glow}` : "none",
                  cursor: "default",
                }}
              >
                <div style={{
                  width: 48, height: 48,
                  background: f.grad,
                  borderRadius: 12, padding: 12,
                  color: f.color, marginBottom: 20,
                  transition: "transform 0.25s",
                  transform: hovered === i ? "scale(1.12)" : "scale(1)",
                }}>
                  {f.icon}
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 10, fontFamily: "'Syne', sans-serif" }}>
                  {f.title}
                </h4>
                <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
  
        {/* Trust / Security */}
        <section style={{ padding: isMobile ? "0 20px 64px" : "0 48px 96px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            background: "rgba(15,23,42,0.6)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20,
            padding: isMobile ? "32px 24px" : "40px 48px",
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isMobile ? 28 : 0,
              alignItems: "center",
            }}>
              {trust.map((t, i) => (
                <div key={i} style={{
                  textAlign: "center",
                  paddingLeft: (!isMobile && i > 0) ? 32 : 0,
                  paddingRight: (!isMobile && i < trust.length - 1) ? 32 : 0,
                  borderRight: (!isMobile && i < trust.length - 1) ? "1px solid rgba(255,255,255,0.07)" : "none",
                  borderBottom: (isMobile && i < trust.length - 1) ? "1px solid rgba(255,255,255,0.07)" : "none",
                  paddingBottom: (isMobile && i < trust.length - 1) ? 28 : 0,
                }}>
                  <div style={{
                    width: 44, height: 44, margin: "0 auto 14px",
                    background: "rgba(74,222,128,0.12)", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 11, color: "#4ade80",
                  }}>
                    <Check />
                  </div>
                  <h5 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 6, fontFamily: "'Syne', sans-serif" }}>
                    {t.label}
                  </h5>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }
