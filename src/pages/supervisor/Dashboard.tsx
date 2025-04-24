
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Search, FileAudio, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricsCards } from './components/MetricsCards';
import { AgentStatusTable } from './components/AgentStatusTable';
import { QueueStatusTable } from './components/QueueStatusTable';
import { MonitoringDialog } from './components/MonitoringDialog';
import { MOCK_AGENTS, MOCK_QUEUES } from './constants/mockData';

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
      <MetricsCards />

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
                <AgentStatusTable 
                  agents={filteredAgents}
                  onStartMonitoring={startMonitoring}
                />
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
            <QueueStatusTable queues={filteredQueues} />
          </CardContent>
        </Card>
      </div>

      <MonitoringDialog
        open={showMonitorDialog && !!monitoringAgent}
        onOpenChange={(open) => {
          if (!open) stopMonitoring();
        }}
        monitoringAgent={monitoringAgent}
        monitorMode={monitorMode}
        setMonitorMode={setMonitorMode}
        stopMonitoring={stopMonitoring}
      />
    </PageLayout>
  );
};

export default SupervisorDashboard;
