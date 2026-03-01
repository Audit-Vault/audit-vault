import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Plus, AlertTriangle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { MainHeader } from './MainHeader';

interface ServerItem {
  id: string;
  name: string;
  totalScans: number;
  totalVulnerabilities: number;
  lastScan: string | null;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/data/servers', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch servers');
      }

      const data = await response.json();
      setServers(data.servers || []);
    } catch (err) {
      console.error('Error fetching servers:', err);
      setError('Failed to load servers');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (count: number) => {
    if (count === 0) return 'text-green-400';
    if (count < 5) return 'text-yellow-400';
    if (count < 10) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <MainHeader />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your Servers</h2>
          <p className="text-slate-400">Manage and monitor your server security</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-400">{error}</p>
          </div>
        ) : servers.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700/50 p-12 text-center">
            <Server className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No servers yet</h3>
            <p className="text-slate-400 mb-6">
              Get started by adding your first server to monitor
            </p>
            <Button
              onClick={() => navigate('/add-server')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Server
            </Button>
          </Card>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => navigate('/add-server')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Server
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servers.map((server) => (
                <Card
                  key={server.id}
                  className="bg-slate-900/50 border-slate-700/50 p-6 hover:border-blue-500/50 transition-all cursor-pointer group"
                  onClick={() => navigate(`/server/${server.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <Server className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {server.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-t border-slate-700/50">
                      <span className="text-slate-400 text-sm">Vulnerabilities</span>
                      <span className={`font-semibold ${getSeverityColor(server.totalVulnerabilities)}`}>
                        {server.totalVulnerabilities}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-slate-700/50">
                      <span className="text-slate-400 text-sm">Total Scans</span>
                      <span className="text-white font-semibold">{server.totalScans}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-slate-700/50">
                      <span className="text-slate-400 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Last Scan
                      </span>
                      <span className="text-slate-300 text-sm">{formatDate(server.lastScan)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
