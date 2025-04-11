
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Mock daily call volume data
const MOCK_DAILY_CALL_VOLUME = [
  { date: 'Apr 5', inbound: 385, outbound: 142, total: 527 },
  { date: 'Apr 6', inbound: 410, outbound: 156, total: 566 },
  { date: 'Apr 7', inbound: 392, outbound: 138, total: 530 },
  { date: 'Apr 8', inbound: 374, outbound: 145, total: 519 },
  { date: 'Apr 9', inbound: 365, outbound: 132, total: 497 },
  { date: 'Apr 10', inbound: 398, outbound: 148, total: 546 },
  { date: 'Apr 11', inbound: 405, outbound: 152, total: 557 },
];

// Mock call distribution by queue
const MOCK_CALL_DISTRIBUTION = [
  { name: 'General Inquiries', value: 428 },
  { name: 'Technical Support', value: 356 },
  { name: 'Billing', value: 284 },
  { name: 'Sales', value: 196 },
];

// Mock hourly call volume data
const MOCK_HOURLY_CALL_VOLUME = [
  { hour: '8AM', calls: 65 },
  { hour: '9AM', calls: 98 },
  { hour: '10AM', calls: 132 },
  { hour: '11AM', calls: 125 },
  { hour: '12PM', calls: 86 },
  { hour: '1PM', calls: 78 },
  { hour: '2PM', calls: 112 },
  { hour: '3PM', calls: 126 },
  { hour: '4PM', calls: 108 },
  { hour: '5PM', calls: 67 },
];

// Mock call outcome distribution
const MOCK_CALL_OUTCOMES = [
  { name: 'Resolved', value: 754 },
  { name: 'Callback Required', value: 205 },
  { name: 'Escalated', value: 126 },
  { name: 'Transferred', value: 138 },
  { name: 'Abandoned', value: 52 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#f59e0b', '#f87171'];

const CallVolumeReport: React.FC = () => {
  // Calculate total calls
  const totalCalls = MOCK_DAILY_CALL_VOLUME.reduce((sum, day) => sum + day.total, 0);
  const totalInbound = MOCK_DAILY_CALL_VOLUME.reduce((sum, day) => sum + day.inbound, 0);
  const totalOutbound = MOCK_DAILY_CALL_VOLUME.reduce((sum, day) => sum + day.outbound, 0);
  
  // Find peak day and hour
  const peakDay = MOCK_DAILY_CALL_VOLUME.reduce((max, day) => day.total > max.total ? day : max, MOCK_DAILY_CALL_VOLUME[0]);
  const peakHour = MOCK_HOURLY_CALL_VOLUME.reduce((max, hour) => hour.calls > max.calls ? hour : max, MOCK_HOURLY_CALL_VOLUME[0]);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Call Volume Analysis</h3>
      
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Total Calls</div>
          <div className="text-2xl font-bold">{totalCalls}</div>
        </div>
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Inbound</div>
          <div className="text-2xl font-bold">{totalInbound} ({((totalInbound / totalCalls) * 100).toFixed(1)}%)</div>
        </div>
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Outbound</div>
          <div className="text-2xl font-bold">{totalOutbound} ({((totalOutbound / totalCalls) * 100).toFixed(1)}%)</div>
        </div>
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Daily Average</div>
          <div className="text-2xl font-bold">{Math.round(totalCalls / MOCK_DAILY_CALL_VOLUME.length)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily call trend chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Daily Call Trend</CardTitle>
            <CardDescription>
              Peak day: {peakDay.date} ({peakDay.total} calls)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MOCK_DAILY_CALL_VOLUME}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="inbound" 
                    stackId="1"
                    stroke="#6366f1" 
                    fill="#6366f1" 
                    name="Inbound"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="outbound" 
                    stackId="1"
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    name="Outbound"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Hourly distribution chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Hourly Distribution</CardTitle>
            <CardDescription>
              Peak hour: {peakHour.hour} ({peakHour.calls} calls)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MOCK_HOURLY_CALL_VOLUME}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calls" fill="#3b82f6" name="Call Volume" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Call distribution by queue */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Distribution by Queue</CardTitle>
            <CardDescription>Call volume by queue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_CALL_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {MOCK_CALL_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} calls`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Call outcomes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Call Outcomes</CardTitle>
            <CardDescription>Distribution of call resolutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={MOCK_CALL_OUTCOMES}
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#6366f1" name="Calls" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Key metrics and observations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Key Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Peak Times</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  The highest call volume occurs between 10AM and 11AM, with a secondary peak between 2PM and 3PM.
                </p>
                <Badge>Staffing Opportunity</Badge>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Queue Distribution</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  General Inquiries (34%) and Technical Support (28%) handle the majority of calls.
                </p>
                <Badge variant="secondary">Resource Allocation</Badge>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Call Outcomes</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  59% of calls are resolved on first contact, while 16% require callbacks.
                </p>
                <Badge variant="outline">Training Opportunity</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallVolumeReport;
