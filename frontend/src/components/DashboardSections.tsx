import { 
  Plus, 
  Rocket, 
  Server, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle, 
  Download, 
  Shield, 
  AlertTriangle,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function DeploymentsContent() {
  const deployments = [
    { id: 1, patch: 'Apache HTTP Server 2.4.58', systems: 12, status: 'completed', startTime: '2024-02-28 10:30', endTime: '2024-02-28 11:15', success: 12, failed: 0 },
    { id: 2, patch: 'OpenSSL Security Update', systems: 8, status: 'in-progress', startTime: '2024-02-28 14:00', endTime: '-', success: 5, failed: 0 },
    { id: 3, patch: 'Node.js LTS Update', systems: 18, status: 'pending', startTime: '-', endTime: '-', success: 0, failed: 0 },
    { id: 4, patch: 'PostgreSQL Driver Patch', systems: 5, status: 'completed', startTime: '2024-02-27 09:00', endTime: '2024-02-27 09:45', success: 5, failed: 0 },
    { id: 5, patch: 'Linux Kernel Security Patch', systems: 25, status: 'failed', startTime: '2024-02-26 15:30', endTime: '2024-02-26 16:20', success: 20, failed: 5 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Patch Deployments</h2>
          <p className="text-slate-600">Track and manage patch deployment status</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Rocket className="w-5 h-5 mr-2" />
          Schedule Deployment
        </Button>
      </div>

      {/* Deployment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Total Deployments</p>
          <p className="text-3xl font-bold text-slate-900">127</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">3</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Success Rate</p>
          <p className="text-3xl font-bold text-green-600">98%</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Failed Today</p>
          <p className="text-3xl font-bold text-red-600">5</p>
        </Card>
      </div>

      {/* Deployments Table */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Deployments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Patch Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Target Systems</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Start Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">End Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Success/Failed</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((deployment) => (
                <tr key={deployment.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{deployment.patch}</td>
                  <td className="py-3 px-4 text-sm text-slate-900">{deployment.systems} systems</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      deployment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      deployment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      deployment.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {deployment.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{deployment.startTime}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{deployment.endTime}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className="text-green-600 font-semibold">{deployment.success}</span>
                    <span className="text-slate-400"> / </span>
                    <span className="text-red-600 font-semibold">{deployment.failed}</span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">View Logs</Button>
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

export function SystemsContent() {
  const systems = [
    { id: 1, name: 'production-web-01', ip: '192.168.1.10', os: 'Ubuntu 22.04', score: 72, vulnerabilities: 15, lastAudit: '2 hours ago', agent: 'active' },
    { id: 2, name: 'api-server-02', ip: '192.168.1.15', os: 'Ubuntu 22.04', score: 85, vulnerabilities: 8, lastAudit: '1 day ago', agent: 'active' },
    { id: 3, name: 'database-primary', ip: '192.168.1.20', os: 'Ubuntu 20.04', score: 58, vulnerabilities: 28, lastAudit: '3 days ago', agent: 'active' },
    { id: 4, name: 'staging-env-01', ip: '192.168.1.25', os: 'Ubuntu 22.04', score: 91, vulnerabilities: 5, lastAudit: '5 hours ago', agent: 'active' },
    { id: 5, name: 'dev-server-01', ip: '192.168.1.30', os: 'Ubuntu 22.04', score: 68, vulnerabilities: 18, lastAudit: '1 week ago', agent: 'inactive' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">System Inventory</h2>
          <p className="text-slate-600">Manage and monitor all connected systems</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-5 h-5 mr-2" />
          Add System
        </Button>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Total Systems</p>
          <p className="text-3xl font-bold text-slate-900">42</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Active Agents</p>
          <p className="text-3xl font-bold text-green-600">38</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">High Risk</p>
          <p className="text-3xl font-bold text-red-600">7</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Avg Score</p>
          <p className="text-3xl font-bold text-blue-600">74</p>
        </Card>
      </div>

      {/* Systems Table */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">All Systems</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">System Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">IP Address</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">OS</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Security Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Vulnerabilities</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Last Audit</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Agent</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((system) => (
                <tr key={system.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{system.name}</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600">{system.ip}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{system.os}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`font-semibold ${system.score >= 80 ? 'text-green-600' : system.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {system.score}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-900">{system.vulnerabilities}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{system.lastAudit}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${system.agent === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-slate-600 capitalize">{system.agent}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">Audit Now</Button>
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

export function ReportsContent() {
  const reports = [
    { id: 1, title: 'Monthly Security Report - February 2024', type: 'monthly', generated: '2024-02-28', systems: 42, status: 'completed' },
    { id: 2, title: 'Critical Vulnerabilities Report', type: 'vulnerability', generated: '2024-02-26', systems: 8, status: 'completed' },
    { id: 3, title: 'Compliance Audit Report', type: 'compliance', generated: '2024-02-25', systems: 42, status: 'completed' },
    { id: 4, title: 'Patch Deployment Summary', type: 'deployment', generated: '2024-02-23', systems: 35, status: 'completed' },
    { id: 5, title: 'Weekly Security Summary', type: 'weekly', generated: '2024-02-21', systems: 42, status: 'completed' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Security Reports</h2>
          <p className="text-slate-600">Generate and download comprehensive security reports</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <FileText className="w-5 h-5 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Report Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Total Reports</p>
          <p className="text-3xl font-bold text-slate-900">156</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">This Month</p>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Scheduled</p>
          <p className="text-3xl font-bold text-orange-600">5</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Avg Generation Time</p>
          <p className="text-3xl font-bold text-green-600">2m</p>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Report Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Generated Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Systems Covered</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{report.title}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                      {report.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{report.generated}</td>
                  <td className="py-3 px-4 text-sm text-slate-900">{report.systems} systems</td>
                  <td className="py-3 px-4 text-sm">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                      {report.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">Download PDF</Button>
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

export function AgentsContent() {
  const agents = [
    { id: 1, name: 'production-web-01-agent', system: 'production-web-01', version: '2.4.1', status: 'active', lastHeartbeat: '30s ago', dataCollected: '2.3 GB' },
    { id: 2, name: 'api-server-02-agent', system: 'api-server-02', version: '2.4.1', status: 'active', lastHeartbeat: '45s ago', dataCollected: '1.8 GB' },
    { id: 3, name: 'database-primary-agent', system: 'database-primary', version: '2.3.8', status: 'active', lastHeartbeat: '1m ago', dataCollected: '4.2 GB' },
    { id: 4, name: 'staging-env-01-agent', system: 'staging-env-01', version: '2.4.1', status: 'active', lastHeartbeat: '25s ago', dataCollected: '1.5 GB' },
    { id: 5, name: 'dev-server-01-agent', system: 'dev-server-01', version: '2.2.5', status: 'inactive', lastHeartbeat: '2 days ago', dataCollected: '890 MB' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Security Agents</h2>
          <p className="text-slate-600">Monitor and manage all deployed security agents</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="w-5 h-5 mr-2" />
          Download Agent
        </Button>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Total Agents</p>
          <p className="text-3xl font-bold text-slate-900">42</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">38</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Inactive</p>
          <p className="text-3xl font-bold text-red-600">4</p>
        </Card>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Updates Available</p>
          <p className="text-3xl font-bold text-orange-600">8</p>
        </Card>
      </div>

      {/* Agents Table */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Agent Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Agent Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">System</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Version</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Last Heartbeat</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Data Collected</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{agent.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{agent.system}</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600">{agent.version}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-slate-600 capitalize">{agent.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{agent.lastHeartbeat}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{agent.dataCollected}</td>
                  <td className="py-3 px-4 text-sm">
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">Configure</Button>
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

export function AdminContent() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Administration Settings</h2>

      {/* Settings Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* User Management */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">User Management</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">Manage user accounts, roles, and permissions</p>
          <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
            Manage Users
          </Button>
        </Card>

        {/* Organization Settings */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Organization Settings</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">Configure organization-wide preferences</p>
          <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
            Configure
          </Button>
        </Card>

        {/* API Keys */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">API Keys</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">Generate and manage API access keys</p>
          <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
            Manage Keys
          </Button>
        </Card>

        {/* Audit Logs */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Audit Logs</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">View system activity and security logs</p>
          <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
            View Logs
          </Button>
        </Card>
      </div>

      {/* System Info */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">System Information</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-600 mb-1">Platform Version</p>
            <p className="text-base font-semibold text-slate-900">2.4.1</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">License Type</p>
            <p className="text-base font-semibold text-slate-900">Enterprise</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">License Expiry</p>
            <p className="text-base font-semibold text-slate-900">Dec 31, 2024</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function SupportContent() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Support Center</h2>
      <p className="text-slate-600 mb-8">Get help and access resources</p>

      {/* Support Options */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Documentation */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Documentation</h3>
          <p className="text-sm text-slate-600 mb-4">Browse our comprehensive documentation and guides</p>
          <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
            View Docs
          </Button>
        </Card>

        {/* Contact Support */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
            <HelpCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Contact Support</h3>
          <p className="text-sm text-slate-600 mb-4">Get help from our support team</p>
          <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
            Contact Us
          </Button>
        </Card>

        {/* Community */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Community</h3>
          <p className="text-sm text-slate-600 mb-4">Join discussions with other users</p>
          <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
            Visit Forum
          </Button>
        </Card>
      </div>

      {/* FAQs */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="pb-4 border-b border-slate-200">
            <h4 className="font-medium text-slate-900 mb-2">How do I install an agent on a new server?</h4>
            <p className="text-sm text-slate-600">Navigate to the "Connect Server" section and follow the installation instructions. You'll receive a unique curl command to run on your server.</p>
          </div>
          <div className="pb-4 border-b border-slate-200">
            <h4 className="font-medium text-slate-900 mb-2">How often are vulnerability databases updated?</h4>
            <p className="text-sm text-slate-600">Our vulnerability databases are updated in real-time as new CVEs are published. Agents check for updates every 6 hours.</p>
          </div>
          <div className="pb-4 border-b border-slate-200">
            <h4 className="font-medium text-slate-900 mb-2">Can I schedule automatic patch deployments?</h4>
            <p className="text-sm text-slate-600">Yes! Navigate to the Patches section and select "Schedule Deployment" to configure automated patching with your preferred maintenance windows.</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-900 mb-2">What happens if an agent goes offline?</h4>
            <p className="text-sm text-slate-600">You'll receive an alert when an agent is offline for more than 15 minutes. The system will continue to show the last known state until the agent reconnects.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
