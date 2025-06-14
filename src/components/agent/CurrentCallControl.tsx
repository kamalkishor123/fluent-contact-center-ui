
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  PhoneOff,
  Pause,
  Mic,
  PhoneForwarded,
  Users,
  ParkingSquare,
  PhoneIncoming,
} from 'lucide-react';
import { PatientInfoCard } from './PatientInfoCard';
import { CALL_SCRIPTS } from '@/data/agentDashboardData';

interface CurrentCallControlProps {
  agentStatus: string;
  isOnCall: boolean;
  callDuration: number;
  holdTime: number;
  isHolding: boolean;
  isMuted: boolean;
  currentCaller: string | null;
  currentQueue: string | null;
  dialpadValue: string;
  setDialpadValue: (value: string) => void;
  callType: string;
  isPatientInfoLoading: boolean;
  patientData: any;
  onAnswerCall: () => void;
  onHangupCall: () => void;
  onToggleHold: () => void;
  onToggleMute: () => void;
  onParkCall: () => void;
  onInitiateTransfer: () => void;
  onDialNumber: () => void;
  onViewFullRecord: () => void;
  onCreateCase: () => void;
  onViewActiveCase: () => void;
}

export const CurrentCallControl = ({
  agentStatus,
  isOnCall,
  callDuration,
  holdTime,
  isHolding,
  isMuted,
  currentCaller,
  currentQueue,
  dialpadValue,
  setDialpadValue,
  callType,
  isPatientInfoLoading,
  patientData,
  onAnswerCall,
  onHangupCall,
  onToggleHold,
  onToggleMute,
  onParkCall,
  onInitiateTransfer,
  onDialNumber,
  onViewFullRecord,
  onCreateCase,
  onViewActiveCase,
}: CurrentCallControlProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            Current Call
            {agentStatus === 'ready' && !isOnCall && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <PhoneIncoming className="h-3 w-3 mr-1" />
                Ready for calls
              </Badge>
            )}
          </div>
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
            agentStatus === 'ready' ? "Waiting for incoming calls..." : "No active calls"
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
                onClick={onHangupCall}
              >
                <PhoneOff size={20} />
                Hang Up
              </Button>
              <Button 
                variant={isHolding ? "secondary" : "outline"} 
                className={`flex items-center gap-2 ${isHolding ? "bg-amber-100 border-amber-200" : ""}`}
                onClick={onToggleHold}
              >
                <Pause size={20} />
                {isHolding ? "Resume" : "Hold"}
              </Button>
              <Button 
                variant={isMuted ? "secondary" : "outline"} 
                className={`flex items-center gap-2 ${isMuted ? "bg-red-100 border-red-200" : ""}`}
                onClick={onToggleMute}
              >
                <Mic size={20} />
                {isMuted ? "Unmute" : "Mute"}
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={onInitiateTransfer}
              >
                <PhoneForwarded size={20} />
                Transfer
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={onParkCall}
              >
                <ParkingSquare size={20} />
                Park
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => {}}
              >
                <Users size={20} />
                Conference
              </Button>
            </div>
            
            {/* Patient Information */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium flex items-center justify-between mb-4">
                <span>Patient Information</span>
              </h3>
              
              {isPatientInfoLoading ? (
                <div className="bg-muted p-4 rounded flex items-center justify-center">
                  <p>Loading patient information...</p>
                </div>
              ) : patientData ? (
                <PatientInfoCard
                  patientData={patientData}
                  onViewFullRecord={onViewFullRecord}
                  onCreateCase={onCreateCase}
                  onViewActiveCase={onViewActiveCase}
                />
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
                onClick={onAnswerCall}
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
                  onClick={onDialNumber}
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
  );
};
