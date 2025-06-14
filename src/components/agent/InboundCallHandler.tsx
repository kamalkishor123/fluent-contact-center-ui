
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Phone,
  PhoneIncoming,
  PhoneOff,
  User,
  Clock,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IncomingCall {
  id: string;
  callerNumber: string;
  callerName?: string;
  queue: string;
  waitTime: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  location?: string;
  callType: 'general' | 'emergency' | 'appointment' | 'billing' | 'clinical';
  patientId?: string;
}

interface InboundCallHandlerProps {
  agentStatus: string;
  onAnswerCall: (call: IncomingCall) => void;
  onRejectCall: (callId: string) => void;
  isOnCall: boolean;
}

export const InboundCallHandler = ({ 
  agentStatus, 
  onAnswerCall, 
  onRejectCall, 
  isOnCall 
}: InboundCallHandlerProps) => {
  const { toast } = useToast();
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [showIncomingDialog, setShowIncomingDialog] = useState(false);
  const [ringTime, setRingTime] = useState(0);
  const [ringTimer, setRingTimer] = useState<NodeJS.Timeout | null>(null);

  // Simulate incoming calls based on agent status
  useEffect(() => {
    if (agentStatus !== 'ready' || isOnCall) return;

    const simulateIncomingCall = () => {
      const mockCalls: IncomingCall[] = [
        {
          id: `call-${Date.now()}`,
          callerNumber: '+1 555-123-4567',
          callerName: 'Martha Johnson',
          queue: 'General Inquiries',
          waitTime: 45,
          priority: 'normal',
          location: 'Springfield, IL',
          callType: 'general',
          patientId: 'MRN-78912345'
        },
        {
          id: `call-${Date.now()}`,
          callerNumber: '+1 555-987-6543',
          queue: 'Emergency Line',
          waitTime: 12,
          priority: 'urgent',
          callType: 'emergency'
        },
        {
          id: `call-${Date.now()}`,
          callerNumber: '+1 555-456-7890',
          callerName: 'Robert Wilson',
          queue: 'Appointment Scheduling',
          waitTime: 120,
          priority: 'normal',
          callType: 'appointment',
          patientId: 'MRN-45612378'
        },
        {
          id: `call-${Date.now()}`,
          callerNumber: '+1 555-321-0987',
          callerName: 'Sarah Davis',
          queue: 'Billing Department',
          waitTime: 78,
          priority: 'low',
          callType: 'billing',
          patientId: 'MRN-98765432'
        }
      ];

      const randomCall = mockCalls[Math.floor(Math.random() * mockCalls.length)];
      handleIncomingCall(randomCall);
    };

    // Random incoming call every 30-60 seconds when ready
    const callInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        simulateIncomingCall();
      }
    }, 30000);

    return () => clearInterval(callInterval);
  }, [agentStatus, isOnCall]);

  const handleIncomingCall = (call: IncomingCall) => {
    setIncomingCall(call);
    setShowIncomingDialog(true);
    setRingTime(0);

    // Start ring timer
    const timer = setInterval(() => {
      setRingTime(prev => prev + 1);
    }, 1000);
    setRingTimer(timer);

    // Auto-reject after 30 seconds
    setTimeout(() => {
      if (showIncomingDialog) {
        handleRejectCall(call.id);
        toast({
          title: "Call missed",
          description: `Call from ${call.callerNumber} was not answered`,
          variant: "destructive"
        });
      }
    }, 30000);

    // Play ring sound notification
    toast({
      title: "Incoming Call",
      description: `${call.callerNumber} via ${call.queue}`,
    });
  };

  const handleAnswerCall = () => {
    if (!incomingCall) return;

    // Clear ring timer
    if (ringTimer) {
      clearInterval(ringTimer);
      setRingTimer(null);
    }

    setShowIncomingDialog(false);
    onAnswerCall(incomingCall);
    
    toast({
      title: "Call answered",
      description: `Connected to ${incomingCall.callerNumber}`,
    });

    // Reset state
    setIncomingCall(null);
    setRingTime(0);
  };

  const handleRejectCall = (callId: string) => {
    // Clear ring timer
    if (ringTimer) {
      clearInterval(ringTimer);
      setRingTimer(null);
    }

    setShowIncomingDialog(false);
    onRejectCall(callId);
    
    // Reset state
    setIncomingCall(null);
    setRingTime(0);
  };

  const formatWaitTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'normal':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getCallTypeIcon = (callType: string) => {
    switch (callType) {
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'appointment':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'billing':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'clinical':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Incoming Call Dialog */}
      <Dialog open={showIncomingDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneIncoming className="h-5 w-5 text-green-500 animate-bounce" />
              Incoming Call
            </DialogTitle>
          </DialogHeader>
          
          {incomingCall && (
            <div className="space-y-4">
              {/* Caller Information */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center mb-4">
                    <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      <User className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      {incomingCall.callerName || 'Unknown Caller'}
                    </h3>
                    <p className="text-muted-foreground">{incomingCall.callerNumber}</p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Queue</p>
                      <p className="font-medium">{incomingCall.queue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wait Time</p>
                      <p className="font-medium">{formatWaitTime(incomingCall.waitTime)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <Badge variant={getPriorityColor(incomingCall.priority)}>
                        {incomingCall.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Call Type</p>
                      <div className="flex items-center gap-1">
                        {getCallTypeIcon(incomingCall.callType)}
                        <span className="capitalize">{incomingCall.callType}</span>
                      </div>
                    </div>
                  </div>
                  
                  {incomingCall.location && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <p className="font-medium">{incomingCall.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {incomingCall.patientId && (
                    <div className="mt-4 p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-700">
                        <strong>Patient ID:</strong> {incomingCall.patientId}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Ring Timer */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Ringing for: <span className="font-mono">{formatWaitTime(ringTime)}</span>
                </p>
              </div>
              
              {/* Call Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleAnswerCall}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Answer Call
                </Button>
                <Button 
                  onClick={() => handleRejectCall(incomingCall.id)}
                  variant="destructive"
                  size="lg"
                  className="flex-1"
                >
                  <PhoneOff className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
