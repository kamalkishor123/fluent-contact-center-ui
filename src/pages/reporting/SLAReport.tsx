
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// Mock SLA data by queue
const MOCK_SLA_DATA = [
  { 
    id: 'q1', 
    name: 'General Inquiries', 
    target: 90,
    answerThreshold: 60,
    performance: 92,
    daysBelow: 1,
    trend: 'stable',
    abandonRate: 6.1,
    avgAnswerTime: 42
  },
  { 
    id: 'q2', 
    name: 'Technical Support', 
    target: 90,
    answerThreshold: 45,
    performance: 94,
    daysBelow: 0,
    trend: 'improving',
    abandonRate: 5.3,
    avgAnswerTime: 38
  },
  { 
    id: 'q3', 
    name: 'Billing', 
    target: 95,
    answerThreshold: 30,
    performance: 95,
    daysBelow: 2,
    trend: 'stable',
    abandonRate: 6.0,
    avgAnswerTime: 27
  },
  { 
    id: 'q4', 
    name: 'Sales', 
    target: 90,
    answerThreshold: 30,
    performance: 98,
    daysBelow: 0,
    trend: 'improving',
    abandonRate: 5.6,
    avgAnswerTime: 22
  },
];

// Mock daily SLA performance data
const MOCK_DAILY_SLA = [
  { date: 'Apr 5', 'General Inquiries': 88, 'Technical Support': 92, 'Billing': 94, 'Sales': 96, target: 90 },
  { date: 'Apr 6', 'General Inquiries': 90, 'Technical Support': 93, 'Billing': 95, 'Sales': 97, target: 90 },
  { date: 'Apr 7', 'General Inquiries': 91, 'Technical Support': 94, 'Billing': 93, 'Sales': 98, target: 90 },
  { date: 'Apr 8', 'General Inquiries': 93, 'Technical Support': 91, 'Billing': 94, 'Sales': 97, target: 90 },
  { date: 'Apr 9', 'General Inquiries': 92, 'Technical Support': 93, 'Billing': 96, 'Sales': 98, target: 90 },
  { date: 'Apr 10', 'General Inquiries': 94, 'Technical Support': 95, 'Billing': 95, 'Sales': 99, target: 90 },
  { date: 'Apr 11', 'General Inquiries': 92, 'Technical Support': 94, 'Billing': 95, 'Sales': 98, target: 90 },
];

// Mock answer time distribution data
const MOCK_ANSWER_TIME_DISTRIBUTION = [
  { time: '0-15s', percentage: 42 },
  { time: '16-30s', percentage: 28 },
  { time: '31-45s', percentage: 15 },
  { time: '46-60s', percentage: 8 },
  { time: '61-90s', percentage: 4 },
  { time: '91-120s', percentage: 2 },
  { time: '>120s', percentage: 1 },
];

// Mock hourly SLA data
const MOCK_HOURLY_SLA = [
  { hour: '8AM', sla: 96, calls: 65 },
  { hour: '9AM', sla: 94, calls: 98 },
  { hour: '10AM', sla: 88, calls: 132 },
  { hour: '11AM', sla: 91, calls: 125 },
  { hour: '12PM', sla: 95, calls: 86 },
  { hour: '1PM', sla: 97, calls: 78 },
  { hour: '2PM', sla: 90, calls: 112 },
  { hour: '3PM', sla: 89, calls: 126 },
  { hour: '4PM', sla: 93, calls: 108 },
  { hour: '5PM', sla: 96, calls: 67 },
];

interface SLAReportProps {
  queue?: string;
}

const SLAReport: React.FC<SLAReportProps> = ({ queue }) => {
  // Filter data based on selected queue
  const filteredQueues = queue 
    ? MOCK_SLA_DATA.filter(q => q.id === queue)
    : MOCK_SLA_DATA;
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Service Level Agreement (SLA) Report</h3>
      
      {filteredQueues.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Queue</TableHead>
                  <TableHead>SLA Target</TableHead>
                  <TableHead>Current Performance</TableHead>
                  <TableHead>Avg Answer Time</TableHead>
                  <TableHead>Abandon Rate</TableHead>
                  <TableHead>Days Below Target</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueues.map((queueData) => (
                  <TableRow key={queueData.id}>
                    <TableCell className="font-medium">{queueData.name}</TableCell>
                    <TableCell>{queueData.target}% in {queueData.answerThreshold}s</TableCell>
                    <TableCell>
                      <Badge className={
                        queueData.performance >= queueData.target ? 'bg-green-500' :
                        queueData.performance >= queueData.target - 5 ? 'bg-amber-500' :
                        'bg-red-500'
                      }>
                        {queueData.performance}%
                      </Badge>
                    </TableCell>
                    <TableCell>{queueData.avgAnswerTime}s</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        queueData.abandonRate < 5 ? 'border-green-500 text-green-700 bg-green-50' :
                        queueData.abandonRate < 8 ? 'border-amber-500 text-amber-700 bg-amber-50' :
                        'border-red-500 text-red-700 bg-red-50'
                      }>
                        {queueData.abandonRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>{queueData.daysBelow}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        queueData.trend === 'improving' ? 'border-green-500 text-green-700 bg-green-50' :
                        queueData.trend === 'stable' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                        'border-red-500 text-red-700 bg-red-50'
                      }>
                        {queueData.trend}
                      </Badge>
                    </TableCell>
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
                  <CardTitle className="text-base font-medium">Daily SLA Trend</CardTitle>
                  <CardDescription>
                    SLA performance over time compared to target ({filteredQueues[0].target}%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={MOCK_DAILY_SLA}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[80, 100]} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={filteredQueues[0].target} label="Target" stroke="#ff7300" strokeDasharray="3 3" />
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
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Answer Time Distribution</CardTitle>
                  <CardDescription>Percentage of calls answered within time intervals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={MOCK_ANSWER_TIME_DISTRIBUTION}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="percentage" fill="#8b5cf6" name="% of Calls" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Hourly SLA Performance</CardTitle>
                  <CardDescription>SLA throughout the day compared to call volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={MOCK_HOURLY_SLA}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis yAxisId="left" orientation="left" domain={[85, 100]} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine yAxisId="left" y={filteredQueues[0].target} label="Target" stroke="#ff7300" strokeDasharray="3 3" />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="sla" 
                          stroke="#6366f1" 
                          name="SLA %" 
                        />
                        <Area 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="calls" 
                          stroke="#8b5cf6" 
                          fill="#8b5cf680" 
                          name="Call Volume" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Comparison view for multiple queues
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">SLA Performance by Queue</CardTitle>
                  <CardDescription>Current performance compared to targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredQueues}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barGap={0}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="performance" fill="#6366f1" name="Current SLA" />
                        <Bar dataKey="target" fill="#d4d4d8" name="Target SLA" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">SLA Trend by Queue</CardTitle>
                  <CardDescription>Daily performance trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={MOCK_DAILY_SLA}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[80, 100]} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={90} label="Target" stroke="#ff7300" strokeDasharray="3 3" />
                        {filteredQueues.map((q, index) => (
                          <Line 
                            key={q.id}
                            type="monotone" 
                            dataKey={q.name} 
                            stroke={
                              index === 0 ? '#6366f1' : 
                              index === 1 ? '#8b5cf6' : 
                              index === 2 ? '#3b82f6' : 
                              '#f59e0b'
                            }
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
          
          {/* SLA insights */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">SLA Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Performance Summary</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {filteredQueues.filter(q => q.performance >= q.target).length} of {filteredQueues.length} queues are 
                      currently meeting or exceeding their SLA targets.
                    </p>
                    <Badge>
                      {filteredQueues.filter(q => q.performance >= q.target).length === filteredQueues.length 
                        ? 'All Targets Met' 
                        : 'Some Targets Below'}
                    </Badge>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Critical Hours</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      SLA performance tends to drop during peak hours (10AM and 3PM) when call volume is highest.
                    </p>
                    <Badge variant="secondary">Staffing Opportunity</Badge>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Abandon Rate Correlation</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Queues with SLA performance below target show 35% higher abandon rates on average.
                    </p>
                    <Badge variant="outline">Improvement Area</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No SLA data available for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default SLAReport;
