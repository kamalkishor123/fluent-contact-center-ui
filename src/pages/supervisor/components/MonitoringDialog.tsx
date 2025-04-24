
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Headphones, MessageSquare, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from '../utils/dashboardUtils';

interface MonitoringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monitoringAgent: any;
  monitorMode: 'listen' | 'whisper' | 'barge';
  setMonitorMode: (mode: 'listen' | 'whisper' | 'barge') => void;
  stopMonitoring: () => void;
}

export const MonitoringDialog: React.FC<MonitoringDialogProps> = ({
  open,
  onOpenChange,
  monitoringAgent,
  monitorMode,
  setMonitorMode,
  stopMonitoring,
}) => {
  const getMonitoringModeStyles = (currentMode: string, activeMode: string) => {
    const baseStyles = "flex-1 flex items-center justify-center gap-2 p-4 rounded-lg transition-all";
    const variants = {
      listen: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border-2 border-blue-500/50",
      whisper: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border-2 border-purple-500/50",
      barge: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border-2 border-red-500/50"
    };
    
    return `${baseStyles} ${currentMode === activeMode ? variants[activeMode as keyof typeof variants] : 'bg-muted/50'}`;
  };

  if (!monitoringAgent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={cn(
            monitorMode === 'listen' && "text-blue-500",
            monitorMode === 'whisper' && "text-purple-500",
            monitorMode === 'barge' && "text-red-500"
          )}>
            {monitorMode === 'listen' && 'Silent Monitoring'}
            {monitorMode === 'whisper' && 'Whisper Mode'}
            {monitorMode === 'barge' && 'Barge-in Mode'}
          </DialogTitle>
          <DialogDescription>
            Monitoring {monitoringAgent?.name}'s call with {monitoringAgent?.currentCall?.caller}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-muted/50">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Call Duration:</span>
              <span>{formatTime(monitoringAgent?.currentCall?.duration || 0)}</span>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className={cn(
                "h-2 rounded-full transition-all",
                monitorMode === 'listen' && "bg-blue-500/70 animate-pulse",
                monitorMode === 'whisper' && "bg-purple-500/70 animate-pulse",
                monitorMode === 'barge' && "bg-red-500/70 animate-pulse"
              )}></div>
              <div className={cn(
                "h-1 rounded-full transition-all",
                monitorMode === 'listen' && "bg-blue-500/50",
                monitorMode === 'whisper' && "bg-purple-500/50",
                monitorMode === 'barge' && "bg-red-500/50"
              )}></div>
              <div className={cn(
                "h-1.5 rounded-full transition-all",
                monitorMode === 'listen' && "bg-blue-500/30",
                monitorMode === 'whisper' && "bg-purple-500/30",
                monitorMode === 'barge' && "bg-red-500/30"
              )}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              className={getMonitoringModeStyles(monitorMode, 'listen')}
              onClick={() => setMonitorMode('listen')}
            >
              <Headphones className="h-4 w-4" />
              <span>Listen</span>
            </button>
            <button
              className={getMonitoringModeStyles(monitorMode, 'whisper')}
              onClick={() => setMonitorMode('whisper')}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Whisper</span>
            </button>
            <button
              className={getMonitoringModeStyles(monitorMode, 'barge')}
              onClick={() => setMonitorMode('barge')}
            >
              <Volume2 className="h-4 w-4" />
              <span>Barge</span>
            </button>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="destructive" 
            onClick={stopMonitoring}
            className="w-full sm:w-auto"
          >
            End Monitoring
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
