
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Mock queue performance data
const MOCK_QUEUE_DATA = [
  { 
    id: 'q1', 
    name: 'General Inquiries', 
    totalCalls: 428, 
    answeredCalls: 402,
    abandonedCalls: 26,
    avgWaitTime: 45,
    avgHandleTime: 235,
    slaPerformance: 92,
    peakHour: '10:00 AM',
    serviceTarget: '90% in 60s'
  },
  { 
    id: 'q2', 
    name: 'Technical Support', 
    totalCalls: 356, 
    answeredCalls: 337,
    abandonedCalls: 19,
    avgWaitTime: 38,
    avgHandleTime: 325,
    slaPerformance: 94,
    peakHour: '2:00 PM',
    serviceTarget: '90% in 45s'
  },
  { 
    id: 'q3', 
    name: 'Billing', 
    totalCalls: 284, 
    answeredCalls: 267,
    abandonedCalls: 17,
    avgWaitTime: 32,
    avgHandleTime: 198,
    slaPerformance: 95,
    peakHour: '11:00 AM',
    serviceTarget: '95% in 30s'
  },
  { 
    id: 'q4', 
    name: 'Sales', 
    totalCalls: 196, 
    answeredCalls: 185,
    abandonedCalls: 11,
    avgWaitTime: 25,
    avgHandleTime: 276,
    slaPerformance: 98,
    peakHour: '3:00 PM',
    serviceTarget: '90% in 30s'
  },
];

// Mock hourly call distribution data
const MOCK_HOURLY_DISTRIBUTION = [
  { hour: '8AM', 'General Inquiries': 32, 'Technical Support': 28, 'Billing': 22, 'Sales': 12 },
  { hour: '9AM', 'General Inquiries': 45, 'Technical Support': 35, 'Billing': 30, 'Sales': 18 },
  { hour: '10AM', 'General Inquiries': 58, 'Technical Support': 42, 'Billing': 38, 'Sales': 22 },
  { hour: '11AM', 'General Inquiries': 52, 'Technical Support': 48, 'Billing': 42, 'Sales': 24 },
  { hour: '12PM', 'General Inquiries': 40, 'Technical Support': 36, 'Billing': 32, 'Sales': 20 },
  { hour: '1PM', 'General Inquiries': 38, 'Technical Support': 32, 'Billing': 28, 'Sales': 18 },
  { hour: '2PM', 'General Inquiries': 42, 'Technical Support': 50, 'Billing': 30, 'Sales': 26 },
  { hour: '3PM', 'General Inquiries': 48, 'Technical Support': 44, 'Billing': 34, 'Sales': 30 },
  { hour: '4PM', 'General Inquiries': 50, 'Technical Support': 38, 'Billing': 26, 'Sales': 22 },
  { hour: '5PM', 'General Inquiries': 30, 'Technical Support': 28, 'Billing': 20, 'Sales': 16 },
];

// Mock SLA performance over time
const MOCK_SLA_TREND = [
  { date: 'Apr 5', 'General Inquiries': 88, 'Technical Support': 92, 'Billing': 94, 'Sales': 96 },
  { date: 'Apr 6', 'General Inquiries': 90, 'Technical Support': 93, 'Billing': 95, 'Sales': 97 },
  { date: 'Apr 7', 'General Inquiries': 91, 'Technical Support': 94, 'Billing': 93, 'Sales': 98 },
  { date: 'Apr 8', 'General Inquiries': 93, 'Technical Support': 91, 'Billing': 94, 'Sales': 97 },
  { date: 'Apr 9', 'General Inquiries': 92, 'Technical Support': 93, 'Billing': 96, 'Sales': 98 },
  { date: 'Apr 10', 'General Inquiries': 94, 'Technical Support': 95, 'Billing': 95, 'Sales': 99 },
  { date: 'Apr 11', 'General Inquiries': 92, 'Technical Support': 94, 'Billing': 95, 'Sales': 98 },
];

interface QueuePerformanceReportProps {
  queue?: string;
}

const QueuePerformanceReport: React.FC<QueuePerformanceReportProps> = ({ queue }) => {
  // Filter data based on selected queue
  const filteredQueues = queue 
    ? MOCK_QUEUE_DATA.filter(q => q.id === queue)
    : MOCK_QUEUE_DATA;
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Queue Performance Summary</h3>
      
      {filteredQueues.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Queue</TableHead>
                  <TableHead>Total Calls</TableHead>
                  <TableHead>Abandoned</TableHead>
                  <TableHead>Avg Wait Time</TableHead>
                  <TableHead>Avg Handle Time</TableHead>
                  <TableHead>SLA Performance</TableHead>
                  <TableHead>Service Target</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueues.map((queueData) => (
                  <TableRow key={queueData.id}>
                    <TableCell className="font-medium">{queueData.name}</TableCell>
                    <TableCell>{queueData.totalCalls}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        (queueData.abandonedCalls / queueData.totalCalls) < 0.05 ? 'border-green-500 text-green-700 bg-green-50' :
                        (queueData.abandonedCalls / queueData.totalCalls) < 0.1 ? 'border-amber-500 text-amber-700 bg-amber-50' :
                        'border-red-500 text-red-700 bg-red-50'
                      }>
                        {queueData.abandonedCalls} ({((queueData.abandonedCalls / queueData.totalCalls) * 100).toFixed(1)}%)
                      </Badge>
                    </TableCell>
                    <TableCell>{formatTime(queueData.avgWaitTime)}</TableCell>
                    <TableCell>{formatTime(queueData.avgHandleTime)}</TableCell>
                    <TableCell>
                      <Badge className={
                        queueData.slaPerformance >= 95 ? 'bg-green-500' :
                        queueData.slaPerformance >= 90 ? 'bg-amber-500' :
                        'bg-red-500'
                      }>
                        {queueData.slaPerformance}%
                      </Badge>
                    </TableCell>
                    <TableCell>{queueData.serviceTarget}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredQueues.length === 1 ? (
            // Detailed view for a single queue
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Hourly Call Distribution</CardTitle>
                  <CardDescription>Call volume throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={MOCK_HOURLY_DISTRIBUTION}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey={filteredQueues[0].name} 
                          stackId="1"
                          stroke="#6366f1" 
                          fill="#6366f1" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">SLA Performance Trend</CardTitle>
                  <CardDescription>Service level trend over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={MOCK_SLA_TREND}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[85, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey={filteredQueues[0].name} 
                          stroke="#6366f1" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Key Performance Indicators</CardTitle>
                  <CardDescription>Detailed metrics for {filteredQueues[0].name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Answer Rate</div>
                      <div className="text-2xl font-bold">
                        {((filteredQueues[0].answeredCalls / filteredQueues[0].totalCalls) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Abandonment Rate</div>
                      <div className="text-2xl font-bold">
                        {((filteredQueues[0].abandonedCalls / filteredQueues[0].totalCalls) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Peak Hour</div>
                      <div className="text-2xl font-bold">{filteredQueues[0].peakHour}</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Avg Handle Time</div>
                      <div className="text-2xl font-bold">{formatTime(filteredQueues[0].avgHandleTime)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Comparison view for multiple queues
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Call Volume Comparison</CardTitle>
                  <CardDescription>Total calls by queue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredQueues}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="answeredCalls" stackId="a" fill="#4ade80" name="Answered" />
                        <Bar dataKey="abandonedCalls" stackId="a" fill="#f87171" name="Abandoned" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">SLA Performance Trend</CardTitle>
                  <CardDescription>Service level trends by queue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={MOCK_SLA_TREND}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[85, 100]} />
                        <Tooltip />
                        <Legend />
                        {filteredQueues.map((q, index) => (
                          <Line 
                            key={q.id}
                            type="monotone" 
                            dataKey={q.name} 
                            stroke={index === 0 ? '#6366f1' : index === 1 ? '#8b5cf6' : index === 2 ? '#3b82f6' : '#f59e0b'} 
                            activeDot={{ r: 8 }} 
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No queue data available for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default QueuePerformanceReport;
