
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InternalMessaging } from './InternalMessaging';

interface AgentStatusControlProps {
  agentStatus: string;
  isOnCall: boolean;
  user: any;
  onChangeStatus: (status: 'ready' | 'not-ready' | 'wrap-up') => void;
}

export const AgentStatusControl = ({
  agentStatus,
  isOnCall,
  user,
  onChangeStatus,
}: AgentStatusControlProps) => {
  const StatusIndicator = ({ status }: { status: string }) => {
    let bgColor = "bg-cc-agent-offline";
    
    switch (status) {
      case 'ready':
        bgColor = "bg-cc-agent-available";
        break;
      case 'not-ready':
        bgColor = "bg-cc-agent-away";
        break;
      case 'on-call':
        bgColor = "bg-cc-agent-busy animate-pulse";
        break;
      case 'wrap-up':
        bgColor = "bg-cc-agent-busy";
        break;
    }
    
    return (
      <div className="relative inline-flex">
        <div className={`w-3 h-3 rounded-full ${bgColor}`}></div>
        {status === 'on-call' && (
          <div className="absolute inset-0 w-3 h-3 rounded-full bg-cc-agent-busy animate-pulse-ring"></div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-4">
      <InternalMessaging 
        currentUserId={user?.id || 'current-user'}
        currentUserName={user?.name || 'Current User'}
      />
      <div className="flex items-center gap-2">
        <StatusIndicator status={agentStatus} />
        <Select 
          value={agentStatus} 
          onValueChange={onChangeStatus}
          disabled={isOnCall}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="not-ready">Not Ready</SelectItem>
            <SelectItem value="wrap-up">Wrap-up</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {user?.agentId && (
        <Badge variant="outline">
          Agent ID: {user.agentId}
        </Badge>
      )}
    </div>
  );
};
