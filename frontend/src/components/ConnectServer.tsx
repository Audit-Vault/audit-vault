import { useState } from 'react';
import { Server, Copy, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import React from 'react';

interface ConnectServerProps {
  userToken: string;
  onServerConnected: (serverName: string) => void;
  onBack: () => void;
}

export function ConnectServer({ userToken, onServerConnected, onBack }: ConnectServerProps) {
  const [serverName, setServerName] = useState('');
  const [copied, setCopied] = useState(false);

  const curlCommand = `curl -sL https://install.auditvault.com/agent.sh | bash -s ${userToken} ${serverName}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback method for clipboard API failures
      const textArea = document.createElement('textarea');
      textArea.value = curlCommand;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err2) {
        console.error('Failed to copy text:', err2);
        alert('Unable to copy automatically. Please manually select and copy the command.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleConnect = () => {
    if (serverName.trim()) {
      onServerConnected(serverName);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl mb-6">
            <Server className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Connect Your Server
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Give your server a name, then run the command below to install the AuditVault agent
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Server Name Input */}
          <div className="space-y-2 mb-8">
            <Label htmlFor="serverName" className="text-slate-300 text-lg">
              Server Name
            </Label>
            <Input
              id="serverName"
              type="text"
              placeholder="e.g., production-web-01"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 text-lg py-6"
            />
          </div>

          {/* Curl Command */}
          <div className="space-y-2 mb-6">
            <Label className="text-slate-300 text-lg">
              Installation Command
            </Label>
            <div className="relative">
              <div className="bg-slate-950 border border-slate-700/50 rounded-xl p-4 pr-14 overflow-x-auto">
                <code className="text-green-400 font-mono text-sm break-all">
                  {curlCommand}
                </code>
              </div>
              <Button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
                size="sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">1</span>
              SSH into your DigitalOcean server
            </h3>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">2</span>
              Paste and run the command above
            </h3>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">3</span>
              Click "Start Audit" below once the agent finishes installing
            </h3>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleConnect}
            disabled={!serverName.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-6 text-lg rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            Start Audit
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Info Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            The agent is read-only and makes no changes to your server
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white py-6 text-lg rounded-xl shadow-lg shadow-gray-500/50 hover:shadow-xl hover:shadow-gray-500/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <ArrowLeft className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}