
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Mock agent performance data
const MOCK_AGENT_DATA = [
  { 
    id: 'a1', 
    name: 'John Doe', 
    calls: 142, 
    avgHandleTime: 245, 
    callsResolved: 132, 
    customerSat: 4.7,
    onlineTime: 7.5,
    readyTime: 6.2,
    notReadyTime: 0.8,
    wrapUpTime: 0.5
  },
  { 
    id: 'a2', 
    name: 'Jane Smith', 
    calls: 156, 
    avgHandleTime: 198, 
    callsResolved: 148, 
    customerSat: 4.9,
    onlineTime: 8.0,
    readyTime: 7.1,
    notReadyTime: 0.5,
    wrapUpTime: 0.4
  },
  { 
    id: 'a3', 
    name: 'Mike Johnson', 
    calls: 127, 
    avgHandleTime: 276, 
    callsResolved: 118, 
    customerSat: 4.3,
    onlineTime: 7.8,
    readyTime: 5.9,
    notReadyTime: 1.2,
    wrapUpTime: 0.7
  },
  { 
    id: 'a4', 
    name: 'Sara Wilson', 
    calls: 134, 
    avgHandleTime: 225, 
    callsResolved: 129, 
    customerSat: 4.6,
    onlineTime: 7.6,
    readyTime: 6.4,
    notReadyTime: 0.6,
    wrapUpTime: 0.6
  },
];

// Mock daily performance data
const MOCK_DAILY_PERFORMANCE = [
  { date: 'Apr 05', calls: 32, avgHandleTime: 231, callsResolved: 29 },
  { date: 'Apr 06', calls: 28, avgHandleTime: 255, callsResolved: 26 },
  { date: 'Apr 07', calls: 34, avgHandleTime: 223, callsResolved: 32 },
  { date: 'Apr 08', calls: 37, avgHandleTime: 240, callsResolved: 35 },
  { date: 'Apr 09', calls: 30, avgHandleTime: 263, callsResolved: 28 },
];

// Mock status time distribution
const MOCK_STATUS_TIME = [
  { name: 'Ready Time', value: 6.2 },
  { name: 'Not Ready', value: 0.8 },
  { name: 'Wrap Up', value: 0.5 },
];

const COLORS = ['#4ade80', '#facc15', '#f87171'];

interface AgentPerformanceReportProps {
  agent?: string;
}

const AgentPerformanceReport: React.FC<AgentPerformanceReportProps> = ({ agent }) => {
  // Filter data based on selected agent
  const filteredAgents = agent 
    ? MOCK_AGENT_DATA.filter(a => a.id === agent)
    : MOCK_AGENT_DATA;
  
  const formatTime = (minutes: number): string => {
    const mins = Math.floor(minutes % 60);
    const secs = Math.round((minutes % 1) * 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Agent Performance Summary</h3>
      
      {filteredAgents.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Total Calls</TableHead>
                  <TableHead>Avg Handle Time</TableHead>
                  <TableHead>Resolution Rate</TableHead>
                  <TableHead>Customer Satisfaction</TableHead>
                  <TableHead>Online Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agentData) => (
                  <TableRow key={agentData.id}>
                    <TableCell className="font-medium">{agentData.name}</TableCell>
                    <TableCell>{agentData.calls}</TableCell>
                    <TableCell>{formatTime(agentData.avgHandleTime)}</TableCell>
                    <TableCell>
                      <Badge className={
                        agentData.callsResolved / agentData.calls > 0.9 ? 'bg-green-500' :
                        agentData.callsResolved / agentData.calls > 0.8 ? 'bg-amber-500' :
                        'bg-red-500'
                      }>
                        {((agentData.callsResolved / agentData.calls) * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        agentData.customerSat >= 4.5 ? 'border-green-500 text-green-700 bg-green-50' :
                        agentData.customerSat >= 4.0 ? 'border-amber-500 text-amber-700 bg-amber-50' :
                        'border-red-500 text-red-700 bg-red-50'
                      }>
                        {agentData.customerSat} / 5.0
                      </Badge>
                    </TableCell>
                    <TableCell>{agentData.onlineTime.toFixed(1)} hrs</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredAgents.length === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Daily Performance</CardTitle>
                  <CardDescription>Last 5 days trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MOCK_DAILY_PERFORMANCE}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="calls" 
                          stroke="#6366f1" 
                          activeDot={{ r: 8 }} 
                          name="Calls"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="callsResolved" 
                          stroke="#4ade80" 
                          name="Resolved"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Time Distribution</CardTitle>
                  <CardDescription>How time was spent during shifts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={MOCK_STATUS_TIME}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {MOCK_STATUS_TIME.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} hrs`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {filteredAgents.length > 1 && (
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Performance Comparison</CardTitle>
                  <CardDescription>Comparing key metrics across agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredAgents}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="calls" fill="#6366f1" name="Total Calls" />
                        <Bar dataKey="callsResolved" fill="#4ade80" name="Calls Resolved" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No agent data available for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default AgentPerformanceReport;
