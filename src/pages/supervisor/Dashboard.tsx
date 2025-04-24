import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Headphones,
  MessageSquare,
  Volume2,
  RefreshCw,
  Search,
  FileAudio,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Link } from 'react-router-dom';

const MOCK_AGENTS = [
  { id: 'a1', name: 'John Doe', status: 'on-call', statusTime: 125, currentCall: { caller: '+1 555-123-4567', duration: 125 } },
  { id: 'a2', name: 'Jane Smith', status: 'ready', statusTime: 300, currentCall: null },
  { id: 'a3', name: 'Mike Johnson', status: 'not-ready', statusTime: 600, reason: 'Break', currentCall: null },
  { id: 'a4', name: 'Sara Wilson', status: 'wrap-up', statusTime: 45, currentCall: null },
  { id: 'a5', name: 'Robert Brown', status: 'ready', statusTime: 120, currentCall: null },
  { id: 'a6', name: 'Lisa Davis', status: 'on-call', statusTime: 310, currentCall: { caller: '+1 555-987-6543', duration: 310 } },
  { id: 'a7', name: 'David Miller', status: 'not-ready', statusTime: 420, reason: 'Meeting', currentCall: null },
];

const MOCK_QUEUES = [
  { id: 'q1', name: 'General Inquiries', callsWaiting: 3, availableAgents: 2, longestWaitTime: 124 },
  { id: 'q2', name: 'Technical Support', callsWaiting: 1, availableAgents: 1, longestWaitTime: 45 },
  { id: 'q3', name: 'Billing', callsWaiting: 0, availableAgents: 2, longestWaitTime: 0 },
  { id: 'q4', name: 'Sales', callsWaiting: 2, availableAgents: 0, longestWaitTime: 230 },
];

const MOCK_CALL_VOLUME_DATA = [
  { hour: '9AM', calls: 12 },
  { hour: '10AM', calls: 19 },
  { hour: '11AM', calls: 15 },
  { hour: '12PM', calls: 8 },
  { hour: '1PM', calls: 10 },
  { hour: '2PM', calls: 14 },
  { hour: '3PM', calls: 17 },
];

const MOCK_SLA_DATA = [
  { hour: '9AM', sla: 92 },
  { hour: '10AM', sla: 88 },
  { hour: '11AM', sla: 95 },
  { hour: '12PM', sla: 98 },
  { hour: '1PM', sla: 90 },
  { hour: '2PM', sla: 93 },
  { hour: '3PM', sla: 94 },
];

const MOCK_AGENT_STATUS_DATA = [
  { name: 'Ready', value: 2 },
  { name: 'On Call', value: 2 },
  { name: 'Not Ready', value: 2 },
  { name: 'Wrap-up', value: 1 },
];

const COLORS = ['#4ade80', '#f87171', '#facc15', '#9ca3af'];

const SupervisorDashboard = () => {
  const { toast } = useToast();
  const [searchAgent, setSearchAgent] = useState('');
  const [selectedQueue, setSelectedQueue] = useState<string | undefined>(undefined);
  const [showMonitorDialog, setShowMonitorDialog] = useState(false);
  const [monitoringAgent, setMonitoringAgent] = useState<any>(null);
  const [monitorMode, setMonitorMode] = useState<'listen' | 'whisper' | 'barge'>('listen');
  const [refreshKey, setRefreshKey] = useState(0);

  const filteredAgents = MOCK_AGENTS.filter(agent => 
    agent.name.toLowerCase().includes(searchAgent.toLowerCase())
  );

  const filteredQueues = selectedQueue 
    ? MOCK_QUEUES.filter(queue => queue.id === selectedQueue) 
    : MOCK_QUEUES;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleRefreshData = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Dashboard refreshed",
      description: "Real-time data has been updated",
    });
  };

  const startMonitoring = (agent: any, mode: 'listen' | 'whisper' | 'barge') => {
    setMonitoringAgent(agent);
    setMonitorMode(mode);
    setShowMonitorDialog(true);
  };

  const stopMonitoring = () => {
    toast({
      title: "Monitoring ended",
      description: `You are no longer monitoring ${monitoringAgent?.name}`,
    });
    setShowMonitorDialog(false);
    setMonitoringAgent(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-cc-agent-available text-white';
      case 'not-ready':
        return 'bg-cc-agent-away text-black';
      case 'on-call':
        return 'bg-cc-agent-busy text-white';
      case 'wrap-up':
        return 'bg-cc-agent-busy/70 text-white';
      default:
        return 'bg-cc-agent-offline text-white';
    }
  };

  const getMonitoringModeStyles = (currentMode: string, activeMode: string) => {
    const baseStyles = "flex-1 flex items-center justify-center gap-2 p-4 rounded-lg transition-all";
    const variants = {
      listen: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border-2 border-blue-500/50",
      whisper: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border-2 border-purple-500/50",
      barge: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border-2 border-red-500/50"
    };
    
    return `${baseStyles} ${currentMode === activeMode ? variants[activeMode as keyof typeof variants] : 'bg-muted/50'}`;
  };

  return (
    <PageLayout 
      title="Supervisor Dashboard" 
      subtitle="Real-time monitoring and management"
      allowedRoles={['supervisor', 'admin']}
      rightContent={
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleRefreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link to="/supervisor/call-recordings">
            <Button size="sm" variant="outline">
              <FileAudio className="mr-2 h-4 w-4" />
              Call Recordings
            </Button>
          </Link>
          <Link to="/reporting">
            <Button size="sm" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Real-time metrics cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calls Waiting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {MOCK_QUEUES.reduce((acc, queue) => acc + queue.callsWaiting, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all queues
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Longest Wait</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatTime(Math.max(...MOCK_QUEUES.map(q => q.longestWaitTime)))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In {MOCK_QUEUES.find(q => q.longestWaitTime === Math.max(...MOCK_QUEUES.map(q => q.longestWaitTime)))?.name}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {MOCK_AGENTS.filter(agent => agent.status === 'ready').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {MOCK_AGENTS.length} total agents
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current SLA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              94%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: 90% answered within 60s
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 xl:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Agent Status</CardTitle>
                <CardDescription>Real-time monitoring of agent activities</CardDescription>
              </div>
              <div className="relative w-[240px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  className="pl-8"
                  value={searchAgent}
                  onChange={(e) => setSearchAgent(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredAgents.length > 0 ? (
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
                      {filteredAgents.map((agent) => (
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
                                  onClick={() => startMonitoring(agent, 'listen')}
                                  title="Listen"
                                >
                                  <Headphones size={16} />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => startMonitoring(agent, 'whisper')}
                                  title="Whisper"
                                >
                                  <MessageSquare size={16} />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => startMonitoring(agent, 'barge')}
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
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px]">
                  <p className="text-muted-foreground">No agents match your search</p>
                  <Button 
                    variant="link" 
                    className="mt-2" 
                    onClick={() => setSearchAgent('')}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Agent Status Breakdown</CardTitle>
              <CardDescription>Current distribution of agent statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_AGENT_STATUS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {MOCK_AGENT_STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Queue Status</CardTitle>
              <CardDescription>Real-time queue metrics</CardDescription>
            </div>
            <Select value={selectedQueue} onValueChange={setSelectedQueue}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Queues" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined}>All Queues</SelectItem>
                <SelectGroup>
                  <SelectLabel>Select Queue</SelectLabel>
                  {MOCK_QUEUES.map(queue => (
                    <SelectItem key={queue.id} value={queue.id}>
                      {queue.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Queue</TableHead>
                    <TableHead>Waiting</TableHead>
                    <TableHead>Agents</TableHead>
                    <TableHead>Longest Wait</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueues.map((queue) => (
                    <TableRow key={queue.id}>
                      <TableCell className="font-medium">{queue.name}</TableCell>
                      <TableCell>
                        <Badge variant={queue.callsWaiting > 0 ? "default" : "outline"}>
                          {queue.callsWaiting}
                        </Badge>
                      </TableCell>
                      <TableCell>{queue.availableAgents}</TableCell>
                      <TableCell>{formatTime(queue.longestWaitTime)}</TableCell>
                      <TableCell>
                        {queue.callsWaiting > 0 && queue.availableAgents === 0 ? (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <XCircle size={12} /> No Agents
                          </Badge>
                        ) : queue.callsWaiting === 0 ? (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <CheckCircle size={12} className="text-cc-agent-available" /> No Wait
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock size={12} /> Active
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Today's Call Volume</CardTitle>
            <CardDescription>Hourly call distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CALL_VOLUME_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calls" fill="#6366f1" name="Calls" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-lg font-medium mb-2">SLA Performance</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_SLA_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sla" 
                      stroke="#8b5cf6" 
                      name="SLA %" 
                      strokeWidth={2} 
                    />
                    <CartesianGrid stroke="#ccc" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showMonitorDialog && !!monitoringAgent} onOpenChange={(open) => {
        if (!open) stopMonitoring();
      }}>
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
    </PageLayout>
  );
};

export default SupervisorDashboard;
