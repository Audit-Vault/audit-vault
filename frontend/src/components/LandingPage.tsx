import { Shield, Terminal, Zap, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 rounded-full"></div>
              <Shield className="w-16 h-16 text-blue-400 relative z-10" strokeWidth={1.5} />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AuditVault
            </h1>
          </div>

          {/* Hero Text */}
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Security Audits That
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Speak Plain English
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed">
            Drop a single curl command on your DigitalOcean server. Get an AI-powered executive report 
            in minutes—no security PhD required.
          </p>

          {/* CTA */}
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 group"
          >
            Start Your First Audit
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Terminal Preview */}
          <div className="mt-16 w-full max-w-3xl">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-slate-400">terminal</span>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="text-green-400">$ curl -sL auditvault.sh | bash -s YOUR_TOKEN</div>
                <div className="text-slate-400 mt-2">→ Scanning system configuration...</div>
                <div className="text-slate-400">→ Analyzing security posture...</div>
                <div className="text-blue-400 mt-2">✓ Audit complete. View report at dashboard.auditvault.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center text-white mb-16">
          How It Works
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">One Command</h4>
            <p className="text-slate-400 leading-relaxed">
              Run a single curl command on your server. Our lightweight agent scans your infrastructure 
              and sends encrypted data back.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">AI Analysis</h4>
            <p className="text-slate-400 leading-relaxed">
              Google Gemini reads the raw scan data and translates technical findings into clear, 
              actionable insights.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">Executive Report</h4>
            <p className="text-slate-400 leading-relaxed">
              Get a risk score, plain-English summary, prioritized issues, and a downloadable PDF 
              report—all in minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-900/50 to-blue-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h5 className="text-lg font-semibold text-white mb-1">Encrypted</h5>
                <p className="text-sm text-slate-400">End-to-end encryption for all scan data</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h5 className="text-lg font-semibold text-white mb-1">Non-Invasive</h5>
                <p className="text-sm text-slate-400">Read-only access, no system changes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h5 className="text-lg font-semibold text-white mb-1">Privacy-First</h5>
                <p className="text-sm text-slate-400">Your data stays yours. No sharing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 py-8 border-t border-slate-800">
        <p className="text-center text-slate-500 text-sm">
          © 2026 AuditVault. Powered by Google Gemini AI.
        </p>
      </div>
    </div>
  );
}
