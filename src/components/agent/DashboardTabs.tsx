
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Phone,
  MailOpen,
  Search,
  User,
  Calendar,
  ClipboardList,
} from 'lucide-react';
import { CaseManagementPanel } from './CaseManagementPanel';
import { PatientSearchPanel } from './PatientSearchPanel';
import {
  DISPOSITION_CODES,
  MOCK_MISSED_CALLS,
  MOCK_VOICEMAILS,
  MOCK_DIRECTORY,
  MOCK_INTERACTION_HISTORY,
} from '@/data/agentDashboardData';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOnCall: boolean;
  agentStatus: string;
  disposition: string;
  setDisposition: (value: string) => void;
  patientData: any;
  historyFilter: string;
  setHistoryFilter: (value: string) => void;
  searchDirectory: string;
  setSearchDirectory: (value: string) => void;
  onCompleteDisposition: () => void;
  onPatientSelect: (patient: any) => void;
  onMissedCallClick: (call: any) => void;
  onOpenVoicemail: (voicemail: any) => void;
  onTransferToContact: (contact: any) => void;
}

export const DashboardTabs = ({
  activeTab,
  setActiveTab,
  isOnCall,
  agentStatus,
  disposition,
  setDisposition,
  patientData,
  historyFilter,
  setHistoryFilter,
  searchDirectory,
  setSearchDirectory,
  onCompleteDisposition,
  onPatientSelect,
  onMissedCallClick,
  onOpenVoicemail,
  onTransferToContact,
}: DashboardTabsProps) => {
  const filteredDirectory = MOCK_DIRECTORY.filter(entry => 
    entry.name.toLowerCase().includes(searchDirectory.toLowerCase()) || 
    entry.department.toLowerCase().includes(searchDirectory.toLowerCase()) ||
    entry.extension.includes(searchDirectory)
  );
  
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
    <Tabs defaultValue="call" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full mb-4">
        <TabsTrigger value="call" className="flex-1">Call Information</TabsTrigger>
        <TabsTrigger value="patientHistory" className="flex-1">Patient History</TabsTrigger>
        <TabsTrigger value="caseManagement" className="flex-1">Case Management</TabsTrigger>
        <TabsTrigger value="patientSearch" className="flex-1">Patient Search</TabsTrigger>
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
                  <Button onClick={onCompleteDisposition}>
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

      <TabsContent value="caseManagement">
        <CaseManagementPanel
          currentPatientId={patientData?.patientId}
          currentPatientName={patientData?.name}
        />
      </TabsContent>

      <TabsContent value="patientSearch">
        <PatientSearchPanel onSelectPatient={onPatientSelect} />
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
                      onClick={() => onMissedCallClick(call)}
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
                      onClick={() => onOpenVoicemail(voicemail)}
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
                    onClick={() => onTransferToContact(entry)}
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
  );
};
