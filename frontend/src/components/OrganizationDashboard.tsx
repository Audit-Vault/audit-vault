import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Server,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Package,
  Rocket,
  Home,
  Plus,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  DeploymentsContent,
  SystemsContent,
  ReportsContent,
  AgentsContent,
  AdminContent,
  SupportContent,
} from './DashboardSections';

interface OrganizationDashboardProps {
  onStartNewAudit: () => void;
}

type NavItem = 'home' | 'threats' | 'patches' | 'deployments' | 'systems' | 'reports' | 'agents' | 'admin' | 'support';

const COLORS = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#f59e0b',
  low: '#84cc16',
};

// Mock data for visualizations
const vulnerabilityTimelineData = [
  { date: 'Jan', critical: 12, high: 28, medium: 45, low: 23 },
  { date: 'Feb', critical: 15, high: 32, medium: 48, low: 20 },
  { date: 'Mar', critical: 10, high: 25, medium: 42, low: 25 },
  { date: 'Apr', critical: 8, high: 22, medium: 38, low: 28 },
  { date: 'May', critical: 5, high: 18, medium: 35, low: 30 },
  { date: 'Jun', critical: 3, high: 15, medium: 30, low: 32 },
];

const severityDistribution = [
  { name: 'Critical', value: 8, color: COLORS.critical },
  { name: 'High', value: 24, color: COLORS.high },
  { name: 'Medium', value: 45, color: COLORS.medium },
  { name: 'Low', value: 38, color: COLORS.low },
];

const ageMatrixData = [
  { ageRange: '0-30 days', critical: 2, high: 5, medium: 12, low: 15 },
  { ageRange: '31-60 days', critical: 3, high: 8, medium: 15, low: 10 },
  { ageRange: '61-90 days', critical: 2, high: 6, medium: 10, low: 8 },
  { ageRange: '90+ days', critical: 1, high: 5, medium: 8, low: 5 },
];

const zeroDay = [
  { id: 1, cve: 'CVE-2024-1234', severity: 'critical', system: 'Apache HTTP Server 2.4', discovered: '2 days ago' },
  { id: 2, cve: 'CVE-2024-5678', severity: 'high', system: 'OpenSSL 3.0.x', discovered: '1 week ago' },
];

export function OrganizationDashboard({ onStartNewAudit }: OrganizationDashboardProps) {
  const [activeNav, setActiveNav] = useState<NavItem>('home');

  const navigationItems: Array<{ id: NavItem; label: string; icon: any }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'threats', label: 'Threats', icon: AlertTriangle },
    { id: 'patches', label: 'Patches', icon: Package },
    { id: 'deployments', label: 'Deployments', icon: Rocket },
    { id: 'systems', label: 'Systems', icon: Server },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'admin', label: 'Admin', icon: Settings },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const renderContent = () => {
    switch (activeNav) {
      case 'home':
        return <HomeContent onStartNewAudit={onStartNewAudit} />;
      case 'threats':
        return <ThreatsContent />;
      case 'patches':
        return <PatchesContent />;
      case 'deployments':
        return <DeploymentsContent />;
      case 'systems':
        return <SystemsContent />;
      case 'reports':
        return <ReportsContent />;
      case 'agents':
        return <AgentsContent />;
      case 'admin':
        return <AdminContent />;
      case 'support':
        return <SupportContent />;
      default:
        return <HomeContent onStartNewAudit={onStartNewAudit} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-blue-600" strokeWidth={2} />
            <h1 className="text-xl font-bold text-slate-900">AuditVault</h1>
          </div>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Content Components
function HomeContent({ onStartNewAudit }: OrganizationDashboardProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Organization Overview</h2>
          <p className="text-slate-600">Real-time security insights across all systems</p>
        </div>
        <Button
          onClick={onStartNewAudit}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Audit
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Vulnerabilities</p>
              <p className="text-3xl font-bold text-slate-900">115</p>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                12% decrease
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Critical Threats</p>
              <p className="text-3xl font-bold text-red-600">8</p>
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Requires attention
              </p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Active Systems</p>
              <p className="text-3xl font-bold text-slate-900">42</p>
              <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                <Server className="w-3 h-3" />
                All monitored
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Pending Patches</p>
              <p className="text-3xl font-bold text-slate-900">23</p>
              <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Deploy ready
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Vulnerability Severity Summary & Timeline */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Severity Distribution */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Vulnerability Severity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={severityDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {severityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {severityDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-slate-600">{item.name}</span>
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Vulnerability Timeline */}
        <Card className="lg:col-span-2 p-6 bg-white border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Vulnerabilities Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={vulnerabilityTimelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="critical" stroke={COLORS.critical} strokeWidth={2} />
              <Line type="monotone" dataKey="high" stroke={COLORS.high} strokeWidth={2} />
              <Line type="monotone" dataKey="medium" stroke={COLORS.medium} strokeWidth={2} />
              <Line type="monotone" dataKey="low" stroke={COLORS.low} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Vulnerability Age Matrix */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Vulnerability Age Matrix</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageMatrixData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="ageRange" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="critical" stackId="a" fill={COLORS.critical} />
              <Bar dataKey="high" stackId="a" fill={COLORS.high} />
              <Bar dataKey="medium" stackId="a" fill={COLORS.medium} />
              <Bar dataKey="low" stackId="a" fill={COLORS.low} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Zero Day Vulnerabilities */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Zero-Day Vulnerabilities</h3>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              {zeroDay.length} Active
            </span>
          </div>
          <div className="space-y-4">
            {zeroDay.map((vuln) => (
              <div
                key={vuln.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-red-600" />
                    <span className="font-mono text-sm font-semibold text-slate-900">{vuln.cve}</span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      vuln.severity === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {vuln.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-1">{vuln.system}</p>
                <p className="text-xs text-slate-500">Discovered: {vuln.discovered}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
              View All Zero-Day Threats
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Systems */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Recently Audited Systems</h3>
          <Button variant="link" className="text-blue-600 hover:text-blue-700">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">System Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">IP Address</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Risk</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Last Audit</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'production-web-01', ip: '192.168.1.10', score: 72, risk: 'medium', lastAudit: '2 hours ago', status: 'active' },
                { name: 'api-server-02', ip: '192.168.1.15', score: 85, risk: 'low', lastAudit: '1 day ago', status: 'active' },
                { name: 'database-primary', ip: '192.168.1.20', score: 58, risk: 'high', lastAudit: '3 days ago', status: 'warning' },
                { name: 'staging-env-01', ip: '192.168.1.25', score: 91, risk: 'low', lastAudit: '5 hours ago', status: 'active' },
              ].map((system, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{system.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 font-mono">{system.ip}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`font-semibold ${system.score >= 80 ? 'text-green-600' : system.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {system.score}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      system.risk === 'low' ? 'bg-green-100 text-green-700' :
                      system.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {system.risk.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{system.lastAudit}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${system.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                      <span className="text-slate-600 capitalize">{system.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ThreatsContent() {
  const threats = [
    { id: 1, cve: 'CVE-2024-1234', title: 'Remote Code Execution in Apache', severity: 'critical', affected: 12, status: 'active', discovered: '2024-02-26' },
    { id: 2, cve: 'CVE-2024-5678', title: 'SSL/TLS Vulnerability in OpenSSL', severity: 'high', affected: 8, status: 'active', discovered: '2024-02-20' },
    { id: 3, cve: 'CVE-2024-9012', title: 'SQL Injection in PostgreSQL Driver', severity: 'high', affected: 5, status: 'patched', discovered: '2024-02-15' },
    { id: 4, cve: 'CVE-2024-3456', title: 'XSS Vulnerability in Node.js', severity: 'medium', affected: 18, status: 'active', discovered: '2024-02-10' },
    { id: 5, cve: 'CVE-2024-7890', title: 'Privilege Escalation in Linux Kernel', severity: 'critical', affected: 25, status: 'monitoring', discovered: '2024-01-28' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Active Threats</h2>
          <p className="text-slate-600">Monitor and manage security threats across your infrastructure</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-5 h-5 mr-2" />
          Manual Threat Entry
        </Button>
      </div>

      {/* Threat Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Active Threats</p>
              <p className="text-3xl font-bold text-red-600">35</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-600 opacity-20" />
          </div>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Critical</p>
              <p className="text-3xl font-bold text-red-600">8</p>
            </div>
            <Zap className="w-10 h-10 text-red-600 opacity-20" />
          </div>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Patched This Month</p>
              <p className="text-3xl font-bold text-green-600">42</p>
            </div>
            <CheckCircle2 className="w-10 h-10 text-green-600 opacity-20" />
          </div>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Systems Affected</p>
              <p className="text-3xl font-bold text-orange-600">68</p>
            </div>
            <Server className="w-10 h-10 text-orange-600 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Threats Table */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Threat Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">CVE ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Threat Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Severity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Affected Systems</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Discovered</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {threats.map((threat) => (
                <tr key={threat.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-mono text-slate-900">{threat.cve}</td>
                  <td className="py-3 px-4 text-sm text-slate-900">{threat.title}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      threat.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      threat.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-900">{threat.affected} systems</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      threat.status === 'active' ? 'bg-red-100 text-red-700' :
                      threat.status === 'patched' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {threat.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{threat.discovered}</td>
                  <td className="py-3 px-4 text-sm">
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function PatchesContent() {
  const patches = [
    { id: 1, name: 'Apache HTTP Server 2.4.58', version: '2.4.58', systems: 12, status: 'ready', priority: 'critical', size: '45 MB' },
    { id: 2, name: 'OpenSSL Security Update', version: '3.0.13', systems: 8, status: 'ready', priority: 'high', size: '12 MB' },
    { id: 3, name: 'PostgreSQL Driver Patch', version: '15.2', systems: 5, status: 'deployed', priority: 'high', size: '8 MB' },
    { id: 4, name: 'Node.js LTS Update', version: '20.11.1', systems: 18, status: 'testing', priority: 'medium', size: '32 MB' },
    { id: 5, name: 'Linux Kernel Security Patch', version: '6.1.75', systems: 25, status: 'ready', priority: 'critical', size: '120 MB' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Patch Management</h2>
          <p className="text-slate-600">Manage and deploy security patches across your systems</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Rocket className="w-5 h-5 mr-2" />
          Deploy All Ready
        </Button>
      </div>

      {/* Patch Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Ready to Deploy</p>
          <p className="text-3xl font-bold text-blue-600">23</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">In Testing</p>
          <p className="text-3xl font-bold text-yellow-600">8</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Deployed</p>
          <p className="text-3xl font-bold text-green-600">156</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Failed</p>
          <p className="text-3xl font-bold text-red-600">2</p>
        </Card>
      </div>

      {/* Patches Table */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Patches</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Patch Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Version</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Affected Systems</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Priority</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Size</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patches.map((patch) => (
                <tr key={patch.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{patch.name}</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600">{patch.version}</td>
                  <td className="py-3 px-4 text-sm text-slate-900">{patch.systems} systems</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      patch.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      patch.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {patch.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      patch.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                      patch.status === 'deployed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {patch.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{patch.size}</td>
                  <td className="py-3 px-4 text-sm">
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">Deploy</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}