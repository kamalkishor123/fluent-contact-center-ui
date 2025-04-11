
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Phone,
  PhoneOff,
  Pause,
  RotateCcw,
  Mic,
  PhoneForwarded,
  Users,
  ParkingSquare,
  ClipboardList,
  MailOpen,
  User,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

// Mock data for the dashboard
const MOCK_QUEUES = [
  { id: 'q1', name: 'General Inquiries', waitingCalls: 3 },
  { id: 'q2', name: 'Technical Support', waitingCalls: 1 },
  { id: 'q3', name: 'Billing', waitingCalls: 0 },
];

const MOCK_MISSED_CALLS = [
  { id: 'm1', caller: '+1 555-123-4567', time: '10:32 AM', queue: 'General Inquiries' },
  { id: 'm2', caller: '+1 555-987-6543', time: '09:45 AM', queue: 'Technical Support' },
];

const MOCK_VOICEMAILS = [
  { id: 'v1', caller: '+1 555-222-3333', timestamp: '2023-04-11 09:15', duration: '0:45' },
  { id: 'v2', caller: '+1 555-444-5555', timestamp: '2023-04-10 16:30', duration: '1:22' },
];

const MOCK_DIRECTORY = [
  { id: 'd1', name: 'John Smith', department: 'Sales', extension: '101' },
  { id: 'd2', name: 'Sarah Johnson', department: 'Support', extension: '102' },
  { id: 'd3', name: 'Mike Williams', department: 'Billing', extension: '103' },
  { id: 'd4', name: 'Emily Davis', department: 'IT', extension: '104' },
  { id: 'd5', name: 'Robert Wilson', department: 'HR', extension: '105' },
];

const AgentDashboard = () => {
  const { user, updateStatus } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('call');
  const [agentStatus, setAgentStatus] = useState(user?.status || 'ready');
  const [isOnCall, setIsOnCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  const [holdTime, setHoldTime] = useState(0);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentCaller, setCurrentCaller] = useState<string | null>(null);
  const [currentQueue, setCurrentQueue] = useState<string | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [searchDirectory, setSearchDirectory] = useState('');
  const [dialpadValue, setDialpadValue] = useState('');
  const [showVoicemailDialog, setShowVoicemailDialog] = useState(false);
  const [currentVoicemail, setCurrentVoicemail] = useState<any>(null);
  
  // Filter directory based on search term
  const filteredDirectory = MOCK_DIRECTORY.filter(entry => 
    entry.name.toLowerCase().includes(searchDirectory.toLowerCase()) || 
    entry.department.toLowerCase().includes(searchDirectory.toLowerCase()) ||
    entry.extension.includes(searchDirectory)
  );

  const handleChangeStatus = (status: 'ready' | 'not-ready' | 'wrap-up') => {
    if (status === 'not-ready') {
      setShowStatusDialog(true);
    } else {
      updateStatus(status);
      setAgentStatus(status);
      toast({
        title: `Status updated`,
        description: `You are now ${status.replace('-', ' ')}`,
      });
    }
  };
  
  const handleNotReadyReason = (reason: string) => {
    setShowStatusDialog(false);
    updateStatus('not-ready');
    setAgentStatus('not-ready');
    toast({
      title: `Status updated`,
      description: `You are now not ready: ${reason}`,
    });
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleIncomingCall = () => {
    // Simulate incoming call
    const randomCaller = `+1 555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomQueue = MOCK_QUEUES[Math.floor(Math.random() * MOCK_QUEUES.length)].name;
    
    setCurrentCaller(randomCaller);
    setCurrentQueue(randomQueue);
    
    toast({
      title: "Incoming Call",
      description: `From: ${randomCaller} via ${randomQueue}`,
    });
  };
  
  const answerCall = () => {
    if (!currentCaller) {
      handleIncomingCall(); // For demo purposes
    }
    
    setIsOnCall(true);
    updateStatus('on-call');
    setAgentStatus('on-call');
    
    // Start call timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    setCallTimer(timer);
  };
  
  const hangupCall = () => {
    setIsOnCall(false);
    
    // Clear timers
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    
    if (holdTimer) {
      clearInterval(holdTimer);
      setHoldTimer(null);
    }
    
    // Reset state
    setCallDuration(0);
    setHoldTime(0);
    setIsHolding(false);
    setIsMuted(false);
    setCurrentCaller(null);
    setCurrentQueue(null);
    
    // Set to wrap-up
    updateStatus('wrap-up');
    setAgentStatus('wrap-up');
    
    toast({
      title: "Call ended",
      description: "Please complete any post-call work",
    });
  };
  
  const toggleHold = () => {
    setIsHolding(!isHolding);
    
    if (!isHolding) {
      // Start hold timer
      const timer = setInterval(() => {
        setHoldTime(prev => prev + 1);
      }, 1000);
      
      setHoldTimer(timer);
      toast({
        title: "Call on hold",
        description: "The caller has been placed on hold",
      });
    } else {
      // Clear hold timer
      if (holdTimer) {
        clearInterval(holdTimer);
        setHoldTimer(null);
      }
      
      toast({
        title: "Call resumed",
        description: `Hold time: ${formatTime(holdTime)}`,
      });
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Microphone unmuted" : "Microphone muted",
      description: isMuted ? "The caller can hear you now" : "The caller cannot hear you",
    });
  };
  
  const parkCall = () => {
    if (!isOnCall) return;
    
    // Generate random park slot
    const parkSlot = Math.floor(100 + Math.random() * 900);
    
    hangupCall();
    
    toast({
      title: "Call parked",
      description: `Call parked at slot ${parkSlot}`,
    });
  };
  
  const initiateTransfer = () => {
    if (!isOnCall) return;
    setShowTransferDialog(true);
  };
  
  const completeTransfer = (destination: string) => {
    setShowTransferDialog(false);
    
    toast({
      title: "Call transferred",
      description: `Transferred to ${destination}`,
    });
    
    hangupCall();
  };
  
  const dialNumber = () => {
    if (dialpadValue.length === 0) return;
    
    setCurrentCaller(dialpadValue);
    setCurrentQueue('Outbound Call');
    setDialpadValue('');
    answerCall();
    
    toast({
      title: "Outbound call",
      description: `Dialing ${dialpadValue}`,
    });
  };
  
  const handleMissedCallClick = (call: any) => {
    setCurrentCaller(call.caller);
    setCurrentQueue(call.queue);
    answerCall();
    
    toast({
      title: "Returning missed call",
      description: `Calling ${call.caller}`,
    });
  };
  
  const openVoicemail = (voicemail: any) => {
    setCurrentVoicemail(voicemail);
    setShowVoicemailDialog(true);
  };

  // Status indicator component
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
    <PageLayout 
      title="Agent Dashboard" 
      subtitle={user?.name ? `Welcome back, ${user.name}` : undefined}
      allowedRoles={['agent']}
      rightContent={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StatusIndicator status={agentStatus} />
            <Select 
              value={agentStatus} 
              onValueChange={(value: 'ready' | 'not-ready' | 'wrap-up') => handleChangeStatus(value)}
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
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Call Control and Info Section */}
        <div className="col-span-1 lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>Current Call</div>
                {isOnCall && (
                  <div className="flex items-center text-sm">
                    <span className="text-cc-agent-busy mr-2">●</span>
                    <span>Duration: {formatTime(callDuration)}</span>
                    {isHolding && (
                      <span className="ml-4">Hold: {formatTime(holdTime)}</span>
                    )}
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                {isOnCall ? 
                  `On call with ${currentCaller} via ${currentQueue}` : 
                  "No active calls"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isOnCall ? (
                <div className="flex flex-col">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <Button 
                      variant="destructive" 
                      className="flex items-center gap-2" 
                      onClick={hangupCall}
                    >
                      <PhoneOff size={20} />
                      Hang Up
                    </Button>
                    <Button 
                      variant={isHolding ? "secondary" : "outline"} 
                      className={`flex items-center gap-2 ${isHolding ? "bg-amber-100 border-amber-200" : ""}`}
                      onClick={toggleHold}
                    >
                      <Pause size={20} />
                      {isHolding ? "Resume" : "Hold"}
                    </Button>
                    <Button 
                      variant={isMuted ? "secondary" : "outline"} 
                      className={`flex items-center gap-2 ${isMuted ? "bg-red-100 border-red-200" : ""}`}
                      onClick={toggleMute}
                    >
                      <Mic size={20} />
                      {isMuted ? "Unmute" : "Mute"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={initiateTransfer}
                    >
                      <PhoneForwarded size={20} />
                      Transfer
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={parkCall}
                    >
                      <ParkingSquare size={20} />
                      Park
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => toast({
                        title: "Not implemented",
                        description: "Conference feature coming soon",
                      })}
                    >
                      <Users size={20} />
                      Conference
                    </Button>
                  </div>
                  
                  {/* Caller information and scripting would go here */}
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Caller Information</h3>
                    <div className="bg-muted p-4 rounded">
                      <p>Loading patient information...</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Call Script</h3>
                    <div className="bg-muted p-4 rounded">
                      <p>Thank the caller for contacting support.</p>
                      <p>Verify their identity with name and date of birth.</p>
                      <p>Ask how you can assist them today.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-6 text-center">
                    <p className="mb-4 text-muted-foreground">
                      No active call. Answer an incoming call or dial a number.
                    </p>
                    <Button 
                      onClick={answerCall}
                      className="bg-cc-primary hover:bg-cc-secondary text-white"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Simulate Incoming Call
                    </Button>
                  </div>
                  
                  <div className="w-full max-w-md">
                    <div className="flex items-center gap-2 mb-4">
                      <Input 
                        value={dialpadValue} 
                        onChange={(e) => setDialpadValue(e.target.value)} 
                        placeholder="Enter a number to dial"
                      />
                      <Button 
                        onClick={dialNumber}
                        disabled={!dialpadValue}
                        className="whitespace-nowrap"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Dial
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Tabs for additional functionality */}
          <Tabs defaultValue="call" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="call" className="flex-1">Call Information</TabsTrigger>
              <TabsTrigger value="missedCalls" className="flex-1">Missed Calls</TabsTrigger>
              <TabsTrigger value="voicemail" className="flex-1">Voicemail</TabsTrigger>
              <TabsTrigger value="directory" className="flex-1">Directory</TabsTrigger>
            </TabsList>
            
            <TabsContent value="call">
              <Card>
                <CardHeader>
                  <CardTitle>Call Disposition</CardTitle>
                  <CardDescription>Select a category for this call</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select disabled={!isOnCall}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select disposition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inquiry">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="missedCalls">
              <Card>
                <CardHeader>
                  <CardTitle>Missed Calls</CardTitle>
                  <CardDescription>Recent calls that were not answered</CardDescription>
                </CardHeader>
                <CardContent>
                  {MOCK_MISSED_CALLS.length > 0 ? (
                    <div className="space-y-4">
                      {MOCK_MISSED_CALLS.map((call) => (
                        <div key={call.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                          <div>
                            <p className="font-medium">{call.caller}</p>
                            <p className="text-sm text-muted-foreground">{call.time} via {call.queue}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMissedCallClick(call)}
                            disabled={isOnCall}
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Call Back
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-6 text-muted-foreground">No missed calls</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="voicemail">
              <Card>
                <CardHeader>
                  <CardTitle>Voicemail</CardTitle>
                  <CardDescription>Recent voicemail messages</CardDescription>
                </CardHeader>
                <CardContent>
                  {MOCK_VOICEMAILS.length > 0 ? (
                    <div className="space-y-4">
                      {MOCK_VOICEMAILS.map((voicemail) => (
                        <div key={voicemail.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                          <div>
                            <p className="font-medium">{voicemail.caller}</p>
                            <p className="text-sm text-muted-foreground">{voicemail.timestamp} ({voicemail.duration})</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openVoicemail(voicemail)}
                          >
                            <MailOpen className="mr-2 h-4 w-4" />
                            Listen
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-6 text-muted-foreground">No voicemail messages</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="directory">
              <Card>
                <CardHeader>
                  <CardTitle>Directory</CardTitle>
                  <CardDescription>Search for contacts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, department or extension"
                        className="pl-8"
                        value={searchDirectory}
                        onChange={(e) => setSearchDirectory(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredDirectory.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div className="flex items-center">
                          <div className="bg-muted rounded-full p-2 mr-3">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{entry.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {entry.department} • Ext: {entry.extension}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (isOnCall) {
                              completeTransfer(`${entry.name} (Ext: ${entry.extension})`);
                            } else {
                              setDialpadValue(entry.extension);
                              dialNumber();
                            }
                          }}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          {isOnCall ? "Transfer" : "Call"}
                        </Button>
                      </div>
                    ))}
                    
                    {filteredDirectory.length === 0 && (
                      <p className="text-center py-6 text-muted-foreground">No contacts found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar for Queue Status */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Queue Status</CardTitle>
              <CardDescription>Calls waiting in your queues</CardDescription>
            </CardHeader>
            <CardContent>
              {MOCK_QUEUES.map((queue) => (
                <div key={queue.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>{queue.name}</div>
                  <Badge variant={queue.waitingCalls > 0 ? "default" : "outline"}>
                    {queue.waitingCalls} {queue.waitingCalls === 1 ? 'call' : 'calls'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Daily Stats</CardTitle>
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
                  <div className="text-muted-foreground">Longest Call</div>
                  <div className="font-medium">8:12</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-muted-foreground">Missed Calls</div>
                  <div className="font-medium">2</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
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
            <Button variant="outline" onClick={() => handleNotReadyReason('Break')}>
              Break
            </Button>
            <Button variant="outline" onClick={() => handleNotReadyReason('Lunch')}>
              Lunch
            </Button>
            <Button variant="outline" onClick={() => handleNotReadyReason('Training')}>
              Training
            </Button>
            <Button variant="outline" onClick={() => handleNotReadyReason('Meeting')}>
              Meeting
            </Button>
            <Button variant="outline" onClick={() => handleNotReadyReason('Admin Work')}>
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
                <Button onClick={() => completeTransfer("Manual Number")}>
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
                    onClick={() => completeTransfer(queue.name)}
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
                  onClick={() => {
                    setDialpadValue(currentVoicemail.caller);
                    setShowVoicemailDialog(false);
                    dialNumber();
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Back
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    toast({
                      title: "Voicemail deleted",
                      description: `Voicemail from ${currentVoicemail.caller} has been deleted`,
                    });
                    setShowVoicemailDialog(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </PageLayout>
  );
};

export default AgentDashboard;
