
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatTime } from '../utils/dashboardUtils';

interface QueueStatusTableProps {
  queues: typeof import('../constants/mockData').MOCK_QUEUES;
}

export const QueueStatusTable: React.FC<QueueStatusTableProps> = ({ queues }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Queue</TableHead>
            <TableHead>Waiting</TableHead>
            <TableHead>Agents</TableHead>
            <TableHead>Longest Wait</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queues.map((queue) => (
            <TableRow key={queue.id}>
              <TableCell className="font-medium">{queue.name}</TableCell>
              <TableCell>
                <Badge variant={queue.callsWaiting > 0 ? "default" : "outline"}>
                  {queue.callsWaiting}
                </Badge>
              </TableCell>
              <TableCell>{queue.availableAgents}</TableCell>
              <TableCell>{formatTime(queue.longestWaitTime)}</TableCell>
              <TableCell>
                {queue.callsWaiting > 0 && queue.availableAgents === 0 ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle size={12} /> No Agents
                  </Badge>
                ) : queue.callsWaiting === 0 ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle size={12} className="text-cc-agent-available" /> No Wait
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock size={12} /> Active
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
