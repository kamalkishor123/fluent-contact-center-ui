
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MOCK_QUEUES, MOCK_AGENTS } from '../constants/mockData';
import { formatTime } from '../utils/dashboardUtils';

export const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Calls Waiting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {MOCK_QUEUES.reduce((acc, queue) => acc + queue.callsWaiting, 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all queues
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Longest Wait</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatTime(Math.max(...MOCK_QUEUES.map(q => q.longestWaitTime)))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            In {MOCK_QUEUES.find(q => q.longestWaitTime === Math.max(...MOCK_QUEUES.map(q => q.longestWaitTime)))?.name}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Available Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {MOCK_AGENTS.filter(agent => agent.status === 'ready').length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Out of {MOCK_AGENTS.length} total agents
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current SLA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            94%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Target: 90% answered within 60s
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
