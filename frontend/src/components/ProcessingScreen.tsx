
import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { AuditReport } from '../types';

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

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 100; // ~5 minutes

export function ProcessingScreen({ serverName, onComplete }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pollCountRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Step animations — purely visual, run regardless of poll state
    let totalDuration = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach((step, index) => {
      totalDuration += step.duration;
      timers.push(setTimeout(() => setCurrentStep(index + 1), totalDuration));
    });

    // Poll the backend for the completed report
    const poll = async () => {
      if (pollCountRef.current >= MAX_POLLS) {
        setError('Analysis is taking longer than expected. Please refresh and try again.');
        return;
      }
      pollCountRef.current += 1;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/data/report/by-name/${encodeURIComponent(serverName)}`
        );
        if (!res.ok) return; // Not ready yet, keep polling

        const data = await res.json();
        if (data.ready && data.report) {
          clearInterval(intervalId);
          onCompleteRef.current(data.report);
        }
      } catch {
        // Network error — keep polling silently
      }
    };

    const intervalId = setInterval(poll, POLL_INTERVAL_MS);
    poll(); // Immediate first check

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(intervalId);
    };
  }, [serverName]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Analysis Failed</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

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
