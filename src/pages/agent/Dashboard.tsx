
import React, { useState, useEffect } from 'react';
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
  Search,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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

// Mock patient data
const MOCK_PATIENT_DATA = {
  name: 'Martha Johnson',
  patientId: 'MRN-78912345',
  dob: '05/12/1968',
  contactNumber: '+1 555-876-5432',
  lastAppointment: {
    date: '2025-04-15',
    type: 'Annual Physical'
  },
  nextAppointment: {
    date: '2025-05-20',
    type: 'Follow-up Consultation'
  },
  alerts: [
    { type: 'Language', value: 'Spanish Preferred' },
    { type: 'Balance', value: '$125.00 Outstanding' }
  ],
  lastInteraction: 'Called about prescription refill on 04/10/2025'
};

// Mock interaction history
const MOCK_INTERACTION_HISTORY = [
  {
    id: 'int1',
    type: 'call',
    date: '2025-04-10T14:30:00',
    description: 'Called about prescription refill',
    notes: 'Patient requested refill for hypertension medication. Transferred to pharmacy.',
    agent: 'Alex Rivera'
  },
  {
    id: 'int2',
    type: 'appointment',
    date: '2025-04-15T09:00:00',
    description: 'Annual Physical Examination',
    notes: 'Completed with Dr. Peterson. Follow-up scheduled for May.',
    provider: 'Dr. Sarah Peterson'
  },
  {
    id: 'int3',
    type: 'message',
    date: '2025-04-02T11:15:00',
    description: 'Portal Message',
    notes: 'Requested information about lab results. Response sent same day.',
    agent: 'Taylor Wong'
  },
  {
    id: 'int4',
    type: 'call',
    date: '2025-03-22T15:45:00',
    description: 'Billing Question',
    notes: 'Patient had questions about recent invoice. Explained charges and payment options.',
    agent: 'Jordan Smith'
  },
  {
    id: 'int5',
    type: 'appointment',
    date: '2025-03-15T13:30:00',
    description: 'Specialist Consultation',
    notes: 'Referred to cardiology for further evaluation.',
    provider: 'Dr. Michael Chen'
  }
];

// Healthcare-specific disposition codes
const DISPOSITION_CODES = [
  { value: 'appointment-scheduled', label: 'Appointment Scheduled' },
  { value: 'appointment-modified', label: 'Appointment Modified' },
  { value: 'appointment-cancelled', label: 'Appointment Cancelled' },
  { value: 'inquiry-resolved', label: 'Inquiry Resolved' },
  { value: 'prescription-refill', label: 'Prescription Refill Request' },
  { value: 'billing-question', label: 'Billing Question' },
  { value: 'insurance-verification', label: 'Insurance Verification' },
  { value: 'transferred-to-clinical', label: 'Transferred to Clinical Staff' },
  { value: 'transferred-to-billing', label: 'Transferred to Billing Department' },
  { value: 'message-taken', label: 'Message Taken' },
  { value: 'follow-up-required', label: 'Follow-up Required' },
  { value: 'other', label: 'Other' }
];

// Call scripts based on call type
const CALL_SCRIPTS = {
  'general': [
    "Thank the caller for contacting healthcare support.",
    "Verify patient identity with name and date of birth.",
    "Ask how you can assist them today.",
    "Resolve their inquiry or route to appropriate department.",
    "Summarize the call and next steps before ending."
  ],
  'appointment': [
    "Thank the caller for contacting appointment scheduling.",
    "Verify patient identity with name and date of birth.",
    "Ask about the reason for their appointment request.",
    "Check provider availability in the scheduling system.",
    "Confirm appointment details and provide any preparation instructions.",
    "Verify contact information for appointment reminders."
  ],
  'billing': [
    "Thank the caller for contacting the billing department.",
    "Verify patient identity with name and date of birth.",
    "Ask for specific invoice or billing question.",
    "Explain charges and payment options clearly.",
    "Document any billing disputes or questions that need follow-up.",
    "Confirm the patient understands the resolution or next steps."
  ],
  'clinical': [
    "Thank the caller for contacting clinical support.",
    "Verify patient identity with name and date of birth.",
    "Note this is not for medical emergencies (direct to 911 if needed).",
    "Document symptoms or concerns clearly and thoroughly.",
    "Follow triage protocols for routing clinical questions.",
    "Provide clear next steps and timeline expectations."
  ]
};

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
  const [disposition, setDisposition] = useState<string>('');
  const [callType, setCallType] = useState('general');
  const [isPatientInfoLoading, setIsPatientInfoLoading] = useState(false);
  const [patientData, setPatientData] = useState<typeof MOCK_PATIENT_DATA | null>(null);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [showFullHistory, setShowFullHistory] = useState(false);
  
  // Filter directory based on search term
  const filteredDirectory = MOCK_DIRECTORY.filter(entry => 
    entry.name.toLowerCase().includes(searchDirectory.toLowerCase()) || 
    entry.department.toLowerCase().includes(searchDirectory.toLowerCase()) ||
    entry.extension.includes(searchDirectory)
  );
  
  // Filter interaction history
  const filteredHistory = MOCK_INTERACTION_HISTORY.filter(item => 
    historyFilter === 'all' || item.type === historyFilter
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
  
  const loadPatientInfo = () => {
    setIsPatientInfoLoading(true);
    // Simulate API call to fetch patient data
    setTimeout(() => {
      setPatientData(MOCK_PATIENT_DATA);
      setIsPatientInfoLoading(false);
      // Set call type based on queue for correct scripts
      if (currentQueue?.toLowerCase().includes('billing')) {
        setCallType('billing');
      } else if (currentQueue?.toLowerCase().includes('appointment')) {
        setCallType('appointment');
      } else if (currentQueue?.toLowerCase().includes('clinical')) {
        setCallType('clinical');
      } else {
        setCallType('general');
      }
    }, 1200); // Simulate network delay
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
    
    // Load patient information
    loadPatientInfo();
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
    setPatientData(null);
    
    // Set to wrap-up
    updateStatus('wrap-up');
    setAgentStatus('wrap-up');
    
    toast({
      title: "Call ended",
      description: "Please complete disposition and wrap-up work",
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

  const completeDisposition = () => {
    if (!disposition) {
      toast({
        title: "Disposition required",
        description: "Please select a disposition code before returning to Ready",
        variant: "destructive"
      });
      return;
    }
    
    const selectedCode = DISPOSITION_CODES.find(code => code.value === disposition);
    
    toast({
      title: "Wrap-up completed",
      description: `Call dispositioned as: ${selectedCode?.label || disposition}`,
    });
    
    // Reset disposition and return to ready state
    setDisposition('');
    handleChangeStatus('ready');
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
  
  const viewFullHistory = () => {
    setShowFullHistory(true);
  };
  
  const closeFullHistory = () => {
    setShowFullHistory(false);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
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
  
  // Render interaction history item
  const renderHistoryItem = (item: typeof MOCK_INTERACTION_HISTORY[0]) => {
    const getIconForType = () => {
      switch (item.type) {
        case 'call':
          return <Phone className="h-4 w-4" />;
        case 'appointment':
          return <Calendar className="h-4 w-4" />;
        case 'message':
          return <MailOpen className="h-4 w-4" />;
        default:
          return <ClipboardList className="h-4 w-4" />;
      }
    };
    
    return (
      <div key={item.id} className="flex gap-3 p-3 border-b last:border-0 hover:bg-muted/50">
        <div className="bg-muted rounded-full p-2 h-fit">
          {getIconForType()}
        </div>
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
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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
                  
                  {/* Patient Information */}
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium flex items-center justify-between">
                      <span>Patient Information</span>
                      {patientData && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-sm"
                          onClick={viewFullHistory}
                        >
                          View Full History <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </h3>
                    
                    {isPatientInfoLoading ? (
                      <div className="bg-muted p-4 rounded flex items-center justify-center">
                        <p>Loading patient information...</p>
                      </div>
                    ) : patientData ? (
                      <div className="bg-muted p-4 rounded">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Patient Name</p>
                            <p className="font-medium">{patientData.name}</p>
                          </div>
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
                          <div>
                            <p className="text-sm text-muted-foreground">Last Appointment</p>
                            <p className="font-medium">
                              {formatDate(patientData.lastAppointment.date)} ({patientData.lastAppointment.type})
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Next Appointment</p>
                            <p className="font-medium">
                              {formatDate(patientData.nextAppointment.date)} ({patientData.nextAppointment.type})
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground">Alerts/Flags:</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {patientData.alerts.map((alert, index) => (
                              <Badge key={index} variant="outline" className="bg-amber-50">
                                {alert.type}: {alert.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground">Last Interaction:</p>
                          <p className="text-sm">{patientData.lastInteraction}</p>
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline">
                            Open Patient Record
                          </Button>
                          <Button size="sm" variant="outline">
                            Create New Case
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted p-4 rounded">
                        <p>No patient information available for this call.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Call Script</h3>
                    <div className="bg-muted p-4 rounded">
                      {CALL_SCRIPTS[callType as keyof typeof CALL_SCRIPTS].map((line, index) => (
                        <p key={index} className="mb-2 last:mb-0">{line}</p>
                      ))}
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
              <TabsTrigger value="patientHistory" className="flex-1">Patient History</TabsTrigger>
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
                  <div className="space-y-4">
                    <Select 
                      disabled={!isOnCall && agentStatus !== 'wrap-up'} 
                      value={disposition} 
                      onValueChange={setDisposition}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select disposition" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISPOSITION_CODES.map(code => (
                          <SelectItem key={code.value} value={code.value}>{code.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {agentStatus === 'wrap-up' && (
                      <div className="flex justify-end">
                        <Button onClick={completeDisposition}>
                          Complete Wrap-up
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="patientHistory">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Interaction History</CardTitle>
                  <CardDescription>View timeline of patient interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {patientData ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
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
                      
                      <ScrollArea className="h-[300px] rounded border p-1">
                        {filteredHistory.map(item => renderHistoryItem(item))}
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="py-10 text-center text-muted-foreground">
                      <p>No patient information available for this call</p>
                      <p className="text-sm mt-2">Patient information appears here when a call is active</p>
                    </div>
                  )}
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
      
      {/* Full Patient History Dialog */}
      <Dialog open={showFullHistory} onOpenChange={closeFullHistory}>
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
                    {patientData.alerts.map((alert, index) => (
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
              <Button onClick={closeFullHistory}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </PageLayout>
  );
};

export default AgentDashboard;
