export interface AuditReport {
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  issues: Array<{
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }>;
  actionPlan: string[];
}
