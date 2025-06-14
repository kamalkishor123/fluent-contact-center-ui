
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  Users,
  Phone,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface QueueStats {
  id: string;
  name: string;
  waitingCalls: number;
  averageWaitTime: number;
  longestWaitTime: number;
  agentsAvailable: number;
  agentsOnCall: number;
  callsHandledToday: number;
  slaPerformance: number; // percentage
  trend: 'up' | 'down' | 'stable';
}

interface CallQueueMonitorProps {
  queues: QueueStats[];
}

export const CallQueueMonitor = ({ queues }: CallQueueMonitorProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getSLAColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {queues.map((queue) => (
        <Card key={queue.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{queue.name}</CardTitle>
              <div className="flex items-center gap-2">
                {getTrendIcon(queue.trend)}
                <Badge 
                  variant={queue.waitingCalls > 5 ? "destructive" : queue.waitingCalls > 0 ? "default" : "outline"}
                >
                  {queue.waitingCalls} waiting
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Avg Wait
                </div>
                <p className="font-medium">{formatTime(queue.averageWaitTime)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" />
                  Longest Wait
                </div>
                <p className="font-medium">{formatTime(queue.longestWaitTime)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  Agents
                </div>
                <p className="font-medium">
                  {queue.agentsAvailable} available, {queue.agentsOnCall} on call
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  Calls Today
                </div>
                <p className="font-medium">{queue.callsHandledToday}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>SLA Performance</span>
                <span className={getSLAColor(queue.slaPerformance)}>
                  {queue.slaPerformance}%
                </span>
              </div>
              <Progress value={queue.slaPerformance} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
