import { useState, useEffect } from 'react';
import { Download, AlertTriangle, ChevronDown, ChevronUp, Shield, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { AuditReport } from '../App';

interface ExecutiveDashboardProps {
  report: AuditReport;
  serverName: string;
  onBack: () => void;
}

const severityColors = {
  low: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  medium: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  high: 'text-red-400 bg-red-500/10 border-red-500/30',
  critical: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
};

const riskLevelColors = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

export function ExecutiveDashboard({ report, serverName, onBack }: ExecutiveDashboardProps) {
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [summaryText, setSummaryText] = useState('');
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (report.score / 100) * circumference;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-slate-300 hover:text-white hover:bg-slate-800/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Security Audit Report</h1>
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

        {/* Score Card */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Score Ring */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 mb-4">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-slate-800"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={`${getScoreColor(report.score)} transition-all duration-1000`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(report.score)}`}>
                    {report.score}
                  </div>
                  <div className="text-sm text-slate-400">/ 100</div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Security Score</h3>
          </div>

          {/* Risk Level */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              <AlertTriangle className={`w-16 h-16 ${riskLevelColors[report.riskLevel]}`} />
            </div>
            <h3 className={`text-2xl font-bold ${riskLevelColors[report.riskLevel]} uppercase mb-1`}>
              {report.riskLevel}
            </h3>
            <p className="text-slate-400 text-sm">Risk Level</p>
          </div>

          {/* Issues Count */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-white mb-2">{report.issues.length}</div>
            <h3 className="text-lg font-semibold text-white mb-1">Issues Found</h3>
            <div className="flex gap-2 text-xs mt-2">
              <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded">
                {report.issues.filter(i => i.severity === 'high').length} High
              </span>
              <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded">
                {report.issues.filter(i => i.severity === 'medium').length} Medium
              </span>
              <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded">
                {report.issues.filter(i => i.severity === 'low').length} Low
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded"></div>
            Executive Summary
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg">
            {summaryText}
            {isTyping && <span className="inline-block w-1 h-5 bg-blue-400 ml-1 animate-pulse"></span>}
          </p>
        </div>

        {/* Issues List */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded"></div>
            Security Issues
          </h2>
          <div className="space-y-4">
            {report.issues.map((issue, index) => (
              <div
                key={index}
                className={`border rounded-xl overflow-hidden transition-all ${severityColors[issue.severity]}`}
              >
                <button
                  onClick={() => setExpandedIssue(expandedIssue === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${severityColors[issue.severity]}`}>
                      {issue.severity}
                    </span>
                    <span className="text-white font-medium text-left">{issue.title}</span>
                  </div>
                  {expandedIssue === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedIssue === index && (
                  <div className="px-4 pb-4 space-y-4 border-t border-slate-700/50">
                    <div className="pt-4">
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">Description</h4>
                      <p className="text-slate-300 leading-relaxed">{issue.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">Recommendation</h4>
                      <p className="text-slate-300 leading-relaxed">{issue.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded"></div>
            Recommended Action Plan
          </h2>
          <div className="space-y-3">
            {report.actionPlan.map((action, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-slate-300 leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Report generated by AuditVault • Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}