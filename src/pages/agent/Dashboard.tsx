
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AgentStatusControl } from '@/components/agent/AgentStatusControl';
import { InboundCallHandler } from '@/components/agent/InboundCallHandler';
import { CurrentCallControl } from '@/components/agent/CurrentCallControl';
import { DashboardTabs } from '@/components/agent/DashboardTabs';
import { PerformanceSidebar } from '@/components/agent/PerformanceSidebar';
import { DashboardDialogs } from '@/components/agent/DashboardDialogs';
import { ENHANCED_MOCK_PATIENT_DATA } from '@/data/agentDashboardData';

const AgentDashboard = () => {
  const { user, updateStatus } = useAuth();
  const { toast } = useToast();
  
  // State management
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
  const [dialpadValue, setDialpadValue] = useState('');
  const [showVoicemailDialog, setShowVoicemailDialog] = useState(false);
  const [currentVoicemail, setCurrentVoicemail] = useState<any>(null);
  const [disposition, setDisposition] = useState<string>('');
  const [callType, setCallType] = useState('general');
  const [isPatientInfoLoading, setIsPatientInfoLoading] = useState(false);
  const [patientData, setPatientData] = useState<typeof ENHANCED_MOCK_PATIENT_DATA | null>(null);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchDirectory, setSearchDirectory] = useState('');

  // Format time utility
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Status change handler
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
  
  // Patient info loading
  const loadPatientInfo = () => {
    setIsPatientInfoLoading(true);
    setTimeout(() => {
      setPatientData(ENHANCED_MOCK_PATIENT_DATA);
      setIsPatientInfoLoading(false);
      if (currentQueue?.toLowerCase().includes('billing')) {
        setCallType('billing');
      } else if (currentQueue?.toLowerCase().includes('appointment')) {
        setCallType('appointment');
      } else if (currentQueue?.toLowerCase().includes('clinical')) {
        setCallType('clinical');
      } else {
        setCallType('general');
      }
    }, 1200);
  };
  
  // Call handlers
  const handleAnswerInboundCall = (call: any) => {
    setCurrentCaller(call.callerNumber);
    setCurrentQueue(call.queue);
    answerCall();
  };
  
  const handleRejectInboundCall = (callId: string) => {
    toast({
      title: "Call rejected",
      description: "Call has been sent to voicemail or callback queue",
    });
  };
  
  const answerCall = () => {
    setIsOnCall(true);
    updateStatus('on-call');
    setAgentStatus('on-call');
    
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setCallTimer(timer);
    loadPatientInfo();
  };
  
  const hangupCall = () => {
    setIsOnCall(false);
    
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    
    if (holdTimer) {
      clearInterval(holdTimer);
      setHoldTimer(null);
    }
    
    setCallDuration(0);
    setHoldTime(0);
    setIsHolding(false);
    setIsMuted(false);
    setCurrentCaller(null);
    setCurrentQueue(null);
    setPatientData(null);
    
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
      const timer = setInterval(() => {
        setHoldTime(prev => prev + 1);
      }, 1000);
      setHoldTimer(timer);
      toast({
        title: "Call on hold",
        description: "The caller has been placed on hold",
      });
    } else {
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
    
    toast({
      title: "Wrap-up completed",
      description: `Call dispositioned`,
    });
    
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
  
  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setPatientData({
      ...ENHANCED_MOCK_PATIENT_DATA,
      name: patient.name,
      patientId: patient.id,
      contactNumber: patient.contactNumber,
      email: patient.email
    });
    toast({
      title: "Patient selected",
      description: `Loaded information for ${patient.name}`,
    });
  };

  const handleViewFullRecord = () => {
    toast({
      title: "Opening patient record",
      description: "Launching electronic health record system...",
    });
  };

  const handleCreateCase = () => {
    toast({
      title: "Creating new case",
      description: "Opening case creation form...",
    });
  };

  const handleViewActiveCase = () => {
    toast({
      title: "Opening active case",
      description: "Loading case details...",
    });
  };

  const handleTransferToContact = (contact: any) => {
    if (isOnCall) {
      completeTransfer(`${contact.name} (Ext: ${contact.extension})`);
    } else {
      setDialpadValue(contact.extension);
      dialNumber();
    }
  };

  const handleVoicemailAction = (action: string) => {
    if (action === 'callback') {
      setDialpadValue(currentVoicemail.caller);
      setShowVoicemailDialog(false);
      dialNumber();
    } else if (action === 'delete') {
      toast({
        title: "Voicemail deleted",
        description: `Voicemail from ${currentVoicemail.caller} has been deleted`,
      });
      setShowVoicemailDialog(false);
    }
  };

  return (
    <PageLayout 
      title="Agent Dashboard" 
      subtitle={user?.name ? `Welcome back, ${user.name}` : undefined}
      allowedRoles={['agent']}
      rightContent={
        <AgentStatusControl 
          agentStatus={agentStatus}
          isOnCall={isOnCall}
          user={user}
          onChangeStatus={handleChangeStatus}
        />
      }
    >
      {/* Inbound Call Handler Component */}
      <InboundCallHandler
        agentStatus={agentStatus}
        onAnswerCall={handleAnswerInboundCall}
        onRejectCall={handleRejectInboundCall}
        isOnCall={isOnCall}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Call Control and Info Section */}
        <div className="col-span-1 xl:col-span-2">
          <CurrentCallControl
            agentStatus={agentStatus}
            isOnCall={isOnCall}
            callDuration={callDuration}
            holdTime={holdTime}
            isHolding={isHolding}
            isMuted={isMuted}
            currentCaller={currentCaller}
            currentQueue={currentQueue}
            dialpadValue={dialpadValue}
            setDialpadValue={setDialpadValue}
            callType={callType}
            isPatientInfoLoading={isPatientInfoLoading}
            patientData={patientData}
            onAnswerCall={answerCall}
            onHangupCall={hangupCall}
            onToggleHold={toggleHold}
            onToggleMute={toggleMute}
            onParkCall={parkCall}
            onInitiateTransfer={initiateTransfer}
            onDialNumber={dialNumber}
            onViewFullRecord={handleViewFullRecord}
            onCreateCase={handleCreateCase}
            onViewActiveCase={handleViewActiveCase}
          />
          
          <DashboardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOnCall={isOnCall}
            agentStatus={agentStatus}
            disposition={disposition}
            setDisposition={setDisposition}
            patientData={patientData}
            historyFilter={historyFilter}
            setHistoryFilter={setHistoryFilter}
            searchDirectory={searchDirectory}
            setSearchDirectory={setSearchDirectory}
            onCompleteDisposition={completeDisposition}
            onPatientSelect={handlePatientSelect}
            onMissedCallClick={handleMissedCallClick}
            onOpenVoicemail={openVoicemail}
            onTransferToContact={handleTransferToContact}
          />
        </div>
        
        {/* Enhanced Sidebar for Queue Status */}
        <PerformanceSidebar />
      </div>
      
      {/* All Dialogs */}
      <DashboardDialogs
        showStatusDialog={showStatusDialog}
        setShowStatusDialog={setShowStatusDialog}
        showTransferDialog={showTransferDialog}
        setShowTransferDialog={setShowTransferDialog}
        showVoicemailDialog={showVoicemailDialog}
        setShowVoicemailDialog={setShowVoicemailDialog}
        showFullHistory={showFullHistory}
        setShowFullHistory={setShowFullHistory}
        currentVoicemail={currentVoicemail}
        patientData={patientData}
        historyFilter={historyFilter}
        setHistoryFilter={setHistoryFilter}
        onNotReadyReason={handleNotReadyReason}
        onCompleteTransfer={completeTransfer}
        onVoicemailAction={handleVoicemailAction}
      />
    </PageLayout>
  );
};

export default AgentDashboard;
