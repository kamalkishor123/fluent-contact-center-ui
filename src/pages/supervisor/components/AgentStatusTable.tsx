
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Headphones, MessageSquare, Volume2 } from 'lucide-react';
import { getStatusColor, formatTime } from '../utils/dashboardUtils';

interface AgentStatusTableProps {
  agents: typeof import('../constants/mockData').MOCK_AGENTS;
  onStartMonitoring: (agent: any, mode: 'listen' | 'whisper' | 'barge') => void;
}

export const AgentStatusTable: React.FC<AgentStatusTableProps> = ({ agents, onStartMonitoring }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time in Status</TableHead>
            <TableHead>Current Call</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>
                <Badge className={`uppercase ${getStatusColor(agent.status)}`}>
                  {agent.status.replace('-', ' ')}
                </Badge>
                {agent.reason && (
                  <span className="text-xs text-muted-foreground block mt-1">
                    Reason: {agent.reason}
                  </span>
                )}
              </TableCell>
              <TableCell>{formatTime(agent.statusTime)}</TableCell>
              <TableCell>
                {agent.currentCall ? (
                  <div>
                    <div>{agent.currentCall.caller}</div>
                    <div className="text-xs text-muted-foreground">
                      Duration: {formatTime(agent.currentCall.duration)}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not on call</span>
                )}
              </TableCell>
              <TableCell>
                {agent.status === 'on-call' ? (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onStartMonitoring(agent, 'listen')}
                      title="Listen"
                    >
                      <Headphones size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onStartMonitoring(agent, 'whisper')}
                      title="Whisper"
                    >
                      <MessageSquare size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onStartMonitoring(agent, 'barge')}
                      title="Barge In"
                    >
                      <Volume2 size={16} />
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs italic text-muted-foreground">
                    No actions available
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
