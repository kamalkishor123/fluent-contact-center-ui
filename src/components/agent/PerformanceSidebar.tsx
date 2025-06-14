
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CallQueueMonitor } from './CallQueueMonitor';
import { ENHANCED_MOCK_QUEUES } from '@/data/agentDashboardData';

export const PerformanceSidebar = () => {
  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Real-time Queue Monitor</CardTitle>
          <CardDescription>Live queue statistics and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <CallQueueMonitor queues={ENHANCED_MOCK_QUEUES} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>My Performance Today</CardTitle>
          <CardDescription>Your call statistics for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="text-muted-foreground">Calls Handled</div>
              <div className="font-medium">12</div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted-foreground">Average Handle Time</div>
              <div className="font-medium">3:45</div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted-foreground">Inbound Calls Answered</div>
              <div className="font-medium">10</div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted-foreground">Calls Transferred</div>
              <div className="font-medium">3</div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted-foreground">Missed Calls</div>
              <div className="font-medium">1</div>
            </div>
            <Separator />
            <div className="flex justify-between">
              <div className="text-muted-foreground">SLA Performance</div>
              <div className="font-medium text-green-600">94%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
