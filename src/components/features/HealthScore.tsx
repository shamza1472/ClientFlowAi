import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Heart, Minus } from 'lucide-react';
import { useClients } from '@/lib/store';

export function HealthScore() {
  const { clients } = useClients();

  // Calculate average health score
  const averageHealth = clients.length > 0 
    ? Math.round(clients.reduce((sum, client) => sum + client.healthScore.score, 0) / clients.length)
    : 0;

  // Count clients at risk (health score < 60)
  const clientsAtRisk = clients.filter(client => client.healthScore.score < 60).length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Good</Badge>;
      case 'at-risk':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">At Risk</Badge>;
      case 'critical':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-400" />;
      default:
        return <Minus className="h-3 w-3 text-slate-400" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-white">Client Health Score</CardTitle>
        </div>
        <CardDescription>
          AI-powered sentiment analysis and engagement tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Heart className="h-12 w-12 text-slate-600 mb-4" />
              <div className="text-slate-400 mb-2">No clients found</div>
              <div className="text-sm text-slate-500">Add some clients to track their health scores</div>
            </div>
          ) : (
            clients.map((client, index) => (
              <div key={client.id || index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{client.company}</span>
                    {getTrendIcon(client.healthScore.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getScoreColor(client.healthScore.score)}`}>
                      {client.healthScore.score}%
                    </span>
                    {client.healthScore.issues > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-orange-400" />
                        <span className="text-xs text-orange-400">{client.healthScore.issues}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Progress 
                  value={client.healthScore.score} 
                  className="h-2 bg-slate-700"
                />
                
                <div className="flex items-center justify-between">
                  {getStatusBadge(client.healthScore.status)}
                  <span className="text-xs text-slate-400">{client.healthScore.lastActivity}</span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">
                {averageHealth}%
              </div>
              <div className="text-xs text-slate-400">Avg Health</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">{clientsAtRisk}</div>
              <div className="text-xs text-slate-400">At Risk</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}