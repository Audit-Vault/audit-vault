import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { AuditReport } from '../App';

interface ProcessingScreenProps {
  serverName: string;
  onComplete: (report: AuditReport) => void;
}

const steps = [
  { id: 1, label: 'Connecting to server', duration: 1000 },
  { id: 2, label: 'Scanning system configuration', duration: 1500 },
  { id: 3, label: 'Analyzing security posture', duration: 2000 },
  { id: 4, label: 'Checking for vulnerabilities', duration: 1800 },
  { id: 5, label: 'Generating AI-powered insights', duration: 2500 },
  { id: 6, label: 'Compiling report', duration: 1200 },
];

// Mock Gemini API response - In production, replace with real API call
const generateMockReport = (serverName: string): AuditReport => {
  return {
    score: 72,
    riskLevel: 'medium',
    summary: `Your ${serverName} server has a generally solid security foundation, but several moderate-risk issues require attention. The system is running outdated packages with known CVEs, SSH is configured with password authentication enabled (a common attack vector), and firewall rules could be more restrictive. On the positive side, automatic security updates are enabled, disk encryption is active, and no critical misconfigurations were detected. Overall, this is a manageable risk profile that can be significantly improved with the recommended actions.`,
    issues: [
      {
        title: 'Outdated System Packages',
        severity: 'high',
        description: '23 packages have available security updates, including 3 critical kernel patches. Running outdated software exposes your server to known exploits.',
        recommendation: 'Run `apt update && apt upgrade` immediately, then enable unattended-upgrades for automatic security patches.',
      },
      {
        title: 'SSH Password Authentication Enabled',
        severity: 'high',
        description: 'SSH is configured to accept password-based logins, making the server vulnerable to brute-force attacks. Key-based authentication is significantly more secure.',
        recommendation: 'Disable password authentication in /etc/ssh/sshd_config by setting "PasswordAuthentication no", and ensure you have SSH keys configured before restarting sshd.',
      },
      {
        title: 'Permissive Firewall Rules',
        severity: 'medium',
        description: 'UFW firewall is active but allows traffic on more ports than necessary. Ports 8080, 3000, and 9000 are open to the public internet with no apparent service running.',
        recommendation: 'Review and restrict firewall rules: `ufw status numbered` then `ufw delete [rule-number]` for unused ports. Follow the principle of least privilege.',
      },
      {
        title: 'No Fail2Ban Protection',
        severity: 'medium',
        description: 'Fail2Ban is not installed, leaving the server without automated defense against brute-force login attempts.',
        recommendation: 'Install and configure Fail2Ban: `apt install fail2ban`, then enable the SSH jail in /etc/fail2ban/jail.local.',
      },
      {
        title: 'Root Login Over SSH',
        severity: 'medium',
        description: 'SSH is configured to permit root logins directly. This is a security best-practice violation—root access should be obtained via sudo from a normal user account.',
        recommendation: 'Set "PermitRootLogin no" in /etc/ssh/sshd_config and restart sshd. Ensure you have a non-root user with sudo privileges first.',
      },
      {
        title: 'Missing Log Monitoring',
        severity: 'low',
        description: 'No centralized log monitoring solution detected. Without proactive log analysis, security incidents may go unnoticed.',
        recommendation: 'Consider setting up a log aggregation service like ELK Stack, or at minimum configure logwatch for daily email reports.',
      },
    ],
    actionPlan: [
      'Update all system packages and enable automatic security updates',
      'Disable SSH password authentication and enforce key-based access',
      'Review and tighten firewall rules, closing unnecessary ports',
      'Install and configure Fail2Ban with SSH jail enabled',
      'Disable root SSH login and use sudo for privileged operations',
      'Set up basic log monitoring (logwatch or a centralized solution)',
      'Schedule a follow-up audit in 30 days to verify improvements',
    ],
  };
};

export function ProcessingScreen({ serverName, onComplete }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let totalDuration = 0;

    steps.forEach((step, index) => {
      totalDuration += step.duration;
      setTimeout(() => {
        setCurrentStep(index + 1);
      }, totalDuration);
    });

    // Generate report after all steps complete
    setTimeout(() => {
      const report = generateMockReport(serverName);
      onComplete(report);
    }, totalDuration + 500);
  }, [serverName, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl mb-6 relative">
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin relative z-10" strokeWidth={2} />
          </div>
          <h2 className="text-4xl font-bold text-Black mb-4">
            Analyzing Your Infrastructure
          </h2>
          <p className="text-lg text-slate-400">
            Server: <span className="text-black font-medium">{serverName}</span>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isComplete = currentStep > index;
              const isCurrent = currentStep === index;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    isCurrent
                      ? 'bg-blue-500/10 border border-blue-500/30'
                      : isComplete
                      ? 'bg-slate-800/30'
                      : 'bg-slate-800/10'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ${
                      isComplete
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="text-sm">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-base transition-colors duration-500 ${
                      isComplete
                        ? 'text-slate-400'
                        : isCurrent
                        ? 'text-white font-medium'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-slate-400 mt-3">
              {Math.round((currentStep / steps.length) * 100)}% complete
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            This takes only 90 seconds. Please don't close this window.
          </p>
        </div>
      </div>
    </div>
  );
}
