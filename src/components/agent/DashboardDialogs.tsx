
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Phone } from 'lucide-react';
import { MOCK_QUEUES, MOCK_INTERACTION_HISTORY, ENHANCED_MOCK_PATIENT_DATA } from '@/data/agentDashboardData';

interface DashboardDialogsProps {
  showStatusDialog: boolean;
  setShowStatusDialog: (show: boolean) => void;
  showTransferDialog: boolean;
  setShowTransferDialog: (show: boolean) => void;
  showVoicemailDialog: boolean;
  setShowVoicemailDialog: (show: boolean) => void;
  showFullHistory: boolean;
  setShowFullHistory: (show: boolean) => void;
  currentVoicemail: any;
  patientData: any;
  historyFilter: string;
  setHistoryFilter: (value: string) => void;
  onNotReadyReason: (reason: string) => void;
  onCompleteTransfer: (destination: string) => void;
  onVoicemailAction: (action: string) => void;
}

export const DashboardDialogs = ({
  showStatusDialog,
  setShowStatusDialog,
  showTransferDialog,
  setShowTransferDialog,
  showVoicemailDialog,
  setShowVoicemailDialog,
  showFullHistory,
  setShowFullHistory,
  currentVoicemail,
  patientData,
  historyFilter,
  setHistoryFilter,
  onNotReadyReason,
  onCompleteTransfer,
  onVoicemailAction,
}: DashboardDialogsProps) => {
  const filteredHistory = MOCK_INTERACTION_HISTORY.filter(item => 
    historyFilter === 'all' || item.type === historyFilter
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderHistoryItem = (item: typeof MOCK_INTERACTION_HISTORY[0]) => (
    <div key={item.id} className="flex gap-3 p-3 border-b last:border-0 hover:bg-muted/50">
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-medium">{item.description}</span>
          <span className="text-xs text-muted-foreground">{formatDateTime(item.date)}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
        {(item.agent || item.provider) && (
          <p className="text-xs text-muted-foreground mt-1">
            {item.agent ? `Agent: ${item.agent}` : `Provider: ${item.provider}`}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Not Ready Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Not Ready Reason</DialogTitle>
            <DialogDescription>
              Please select a reason for changing your status to Not Ready
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Button variant="outline" onClick={() => onNotReadyReason('Break')}>
              Break
            </Button>
            <Button variant="outline" onClick={() => onNotReadyReason('Lunch')}>
              Lunch
            </Button>
            <Button variant="outline" onClick={() => onNotReadyReason('Training')}>
              Training
            </Button>
            <Button variant="outline" onClick={() => onNotReadyReason('Meeting')}>
              Meeting
            </Button>
            <Button variant="outline" onClick={() => onNotReadyReason('Admin Work')}>
              Admin Work
            </Button>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Transfer Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Call</DialogTitle>
            <DialogDescription>
              Enter a number or select from the directory
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="transfer-number">Transfer to Number</Label>
              <div className="flex gap-2 mt-1">
                <Input id="transfer-number" placeholder="Enter extension or number" />
                <Button onClick={() => onCompleteTransfer("Manual Number")}>
                  Transfer
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Transfer to Queue</Label>
              <div className="grid gap-3 mt-1">
                {MOCK_QUEUES.map((queue) => (
                  <Button 
                    key={queue.id} 
                    variant="outline" 
                    onClick={() => onCompleteTransfer(queue.name)}
                  >
                    {queue.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowTransferDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Voicemail Dialog */}
      <Dialog open={showVoicemailDialog} onOpenChange={setShowVoicemailDialog}>
        {currentVoicemail && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Voicemail from {currentVoicemail.caller}</DialogTitle>
              <DialogDescription>
                Received on {currentVoicemail.timestamp} • Duration: {currentVoicemail.duration}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Audio Player Placeholder</p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="outline">
                      Play
                    </Button>
                    <Button size="sm" variant="outline">
                      Pause
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  onClick={() => onVoicemailAction('callback')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Back
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => onVoicemailAction('delete')}
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Full Patient History Dialog */}
      <Dialog open={showFullHistory} onOpenChange={setShowFullHistory}>
        {patientData && (
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Patient History - {patientData.name}</DialogTitle>
              <DialogDescription>
                Complete interaction history and patient information
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-3">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Patient ID</p>
                    <p className="font-medium">{patientData.patientId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{patientData.dob}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Number</p>
                    <p className="font-medium">{patientData.contactNumber}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Alerts/Flags:</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {patientData.alerts.map((alert: any, index: number) => (
                      <Badge key={index} variant="outline" className="bg-amber-50">
                        {alert.type}: {alert.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Interaction Timeline</h3>
                <div className="border rounded-md overflow-hidden">
                  <div className="flex border-b p-2 bg-muted/50">
                    <div className="font-medium flex-1">
                      <Select value={historyFilter} onValueChange={setHistoryFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All interactions</SelectItem>
                          <SelectItem value="call">Calls</SelectItem>
                          <SelectItem value="appointment">Appointments</SelectItem>
                          <SelectItem value="message">Messages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredHistory.length} interactions
                    </div>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="p-1">
                      {filteredHistory.map(item => renderHistoryItem(item))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowFullHistory(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
