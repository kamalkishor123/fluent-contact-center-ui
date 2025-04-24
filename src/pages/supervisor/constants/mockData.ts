
export const MOCK_AGENTS = [
  { id: 'a1', name: 'John Doe', status: 'on-call', statusTime: 125, currentCall: { caller: '+1 555-123-4567', duration: 125 } },
  { id: 'a2', name: 'Jane Smith', status: 'ready', statusTime: 300, currentCall: null },
  { id: 'a3', name: 'Mike Johnson', status: 'not-ready', statusTime: 600, reason: 'Break', currentCall: null },
  { id: 'a4', name: 'Sara Wilson', status: 'wrap-up', statusTime: 45, currentCall: null },
  { id: 'a5', name: 'Robert Brown', status: 'ready', statusTime: 120, currentCall: null },
  { id: 'a6', name: 'Lisa Davis', status: 'on-call', statusTime: 310, currentCall: { caller: '+1 555-987-6543', duration: 310 } },
  { id: 'a7', name: 'David Miller', status: 'not-ready', statusTime: 420, reason: 'Meeting', currentCall: null },
];

export const MOCK_QUEUES = [
  { id: 'q1', name: 'General Inquiries', callsWaiting: 3, availableAgents: 2, longestWaitTime: 124 },
  { id: 'q2', name: 'Technical Support', callsWaiting: 1, availableAgents: 1, longestWaitTime: 45 },
  { id: 'q3', name: 'Billing', callsWaiting: 0, availableAgents: 2, longestWaitTime: 0 },
  { id: 'q4', name: 'Sales', callsWaiting: 2, availableAgents: 0, longestWaitTime: 230 },
];

export const MOCK_CALL_VOLUME_DATA = [
  { hour: '9AM', calls: 12 },
  { hour: '10AM', calls: 19 },
  { hour: '11AM', calls: 15 },
  { hour: '12PM', calls: 8 },
  { hour: '1PM', calls: 10 },
  { hour: '2PM', calls: 14 },
  { hour: '3PM', calls: 17 },
];

export const MOCK_SLA_DATA = [
  { hour: '9AM', sla: 92 },
  { hour: '10AM', sla: 88 },
  { hour: '11AM', sla: 95 },
  { hour: '12PM', sla: 98 },
  { hour: '1PM', sla: 90 },
  { hour: '2PM', sla: 93 },
  { hour: '3PM', sla: 94 },
];

export const MOCK_AGENT_STATUS_DATA = [
  { name: 'Ready', value: 2 },
  { name: 'On Call', value: 2 },
  { name: 'Not Ready', value: 2 },
  { name: 'Wrap-up', value: 1 },
];

export const COLORS = ['#4ade80', '#f87171', '#facc15', '#9ca3af'];
