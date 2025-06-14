
// Mock data for the agent dashboard
export const MOCK_QUEUES = [
  { id: 'q1', name: 'General Inquiries', waitingCalls: 3 },
  { id: 'q2', name: 'Technical Support', waitingCalls: 1 },
  { id: 'q3', name: 'Billing', waitingCalls: 0 },
];

export const MOCK_MISSED_CALLS = [
  { id: 'm1', caller: '+1 555-123-4567', time: '10:32 AM', queue: 'General Inquiries' },
  { id: 'm2', caller: '+1 555-987-6543', time: '09:45 AM', queue: 'Technical Support' },
];

export const MOCK_VOICEMAILS = [
  { id: 'v1', caller: '+1 555-222-3333', timestamp: '2023-04-11 09:15', duration: '0:45' },
  { id: 'v2', caller: '+1 555-444-5555', timestamp: '2023-04-10 16:30', duration: '1:22' },
];

export const MOCK_DIRECTORY = [
  { id: 'd1', name: 'John Smith', department: 'Sales', extension: '101' },
  { id: 'd2', name: 'Sarah Johnson', department: 'Support', extension: '102' },
  { id: 'd3', name: 'Mike Williams', department: 'Billing', extension: '103' },
  { id: 'd4', name: 'Emily Davis', department: 'IT', extension: '104' },
  { id: 'd5', name: 'Robert Wilson', department: 'HR', extension: '105' },
];

// Enhanced mock patient data with additional fields
export const ENHANCED_MOCK_PATIENT_DATA = {
  name: 'Martha Johnson',
  patientId: 'MRN-78912345',
  dob: '05/12/1968',
  contactNumber: '+1 555-876-5432',
  email: 'martha.johnson@email.com',
  address: '123 Main St, Springfield, IL 62701',
  emergencyContact: 'John Johnson (Spouse) - +1 555-876-5433',
  primaryProvider: 'Dr. Sarah Peterson',
  insuranceProvider: 'Blue Cross Blue Shield',
  policyNumber: 'BCBS-123456789',
  lastAppointment: {
    date: '2025-04-15',
    type: 'Annual Physical',
    provider: 'Dr. Sarah Peterson'
  },
  nextAppointment: {
    date: '2025-05-20',
    type: 'Follow-up Consultation',
    provider: 'Dr. Sarah Peterson'
  },
  alerts: [
    { type: 'Language', value: 'Spanish Preferred', priority: 'medium' as const },
    { type: 'Balance', value: '$125.00 Outstanding', priority: 'high' as const }
  ],
  medicalAlerts: [
    { type: 'Allergy', description: 'Penicillin - severe reaction', severity: 'critical' as const },
    { type: 'Condition', description: 'Hypertension - controlled', severity: 'warning' as const }
  ],
  lastInteraction: 'Called about prescription refill on 04/10/2025',
  activeCase: {
    id: 'CASE-001',
    type: 'Billing Inquiry',
    status: 'in-progress',
    assignedTo: 'Alex Rivera'
  }
};

// Enhanced mock queue data with detailed statistics
export const ENHANCED_MOCK_QUEUES = [
  { 
    id: 'q1', 
    name: 'General Inquiries', 
    waitingCalls: 3,
    averageWaitTime: 85,
    longestWaitTime: 180,
    agentsAvailable: 2,
    agentsOnCall: 5,
    callsHandledToday: 47,
    slaPerformance: 92,
    trend: 'up' as const
  },
  { 
    id: 'q2', 
    name: 'Emergency Line', 
    waitingCalls: 1,
    averageWaitTime: 15,
    longestWaitTime: 15,
    agentsAvailable: 3,
    agentsOnCall: 1,
    callsHandledToday: 8,
    slaPerformance: 98,
    trend: 'stable' as const
  },
  { 
    id: 'q3', 
    name: 'Appointment Scheduling', 
    waitingCalls: 5,
    averageWaitTime: 125,
    longestWaitTime: 300,
    agentsAvailable: 1,
    agentsOnCall: 3,
    callsHandledToday: 73,
    slaPerformance: 78,
    trend: 'down' as const
  },
  { 
    id: 'q4', 
    name: 'Billing Department', 
    waitingCalls: 0,
    averageWaitTime: 45,
    longestWaitTime: 0,
    agentsAvailable: 2,
    agentsOnCall: 1,
    callsHandledToday: 31,
    slaPerformance: 95,
    trend: 'up' as const
  }
];

// Mock interaction history
export const MOCK_INTERACTION_HISTORY = [
  {
    id: 'int1',
    type: 'call',
    date: '2025-04-10T14:30:00',
    description: 'Called about prescription refill',
    notes: 'Patient requested refill for hypertension medication. Transferred to pharmacy.',
    agent: 'Alex Rivera'
  },
  {
    id: 'int2',
    type: 'appointment',
    date: '2025-04-15T09:00:00',
    description: 'Annual Physical Examination',
    notes: 'Completed with Dr. Peterson. Follow-up scheduled for May.',
    provider: 'Dr. Sarah Peterson'
  },
  {
    id: 'int3',
    type: 'message',
    date: '2025-04-02T11:15:00',
    description: 'Portal Message',
    notes: 'Requested information about lab results. Response sent same day.',
    agent: 'Taylor Wong'
  },
  {
    id: 'int4',
    type: 'call',
    date: '2025-03-22T15:45:00',
    description: 'Billing Question',
    notes: 'Patient had questions about recent invoice. Explained charges and payment options.',
    agent: 'Jordan Smith'
  },
  {
    id: 'int5',
    type: 'appointment',
    date: '2025-03-15T13:30:00',
    description: 'Specialist Consultation',
    notes: 'Referred to cardiology for further evaluation.',
    provider: 'Dr. Michael Chen'
  }
];

// Healthcare-specific disposition codes
export const DISPOSITION_CODES = [
  { value: 'appointment-scheduled', label: 'Appointment Scheduled' },
  { value: 'appointment-modified', label: 'Appointment Modified' },
  { value: 'appointment-cancelled', label: 'Appointment Cancelled' },
  { value: 'inquiry-resolved', label: 'Inquiry Resolved' },
  { value: 'prescription-refill', label: 'Prescription Refill Request' },
  { value: 'billing-question', label: 'Billing Question' },
  { value: 'insurance-verification', label: 'Insurance Verification' },
  { value: 'transferred-to-clinical', label: 'Transferred to Clinical Staff' },
  { value: 'transferred-to-billing', label: 'Transferred to Billing Department' },
  { value: 'message-taken', label: 'Message Taken' },
  { value: 'follow-up-required', label: 'Follow-up Required' },
  { value: 'other', label: 'Other' }
];

// Call scripts based on call type
export const CALL_SCRIPTS = {
  'general': [
    "Thank the caller for contacting healthcare support.",
    "Verify patient identity with name and date of birth.",
    "Ask how you can assist them today.",
    "Resolve their inquiry or route to appropriate department.",
    "Summarize the call and next steps before ending."
  ],
  'appointment': [
    "Thank the caller for contacting appointment scheduling.",
    "Verify patient identity with name and date of birth.",
    "Ask about the reason for their appointment request.",
    "Check provider availability in the scheduling system.",
    "Confirm appointment details and provide any preparation instructions.",
    "Verify contact information for appointment reminders."
  ],
  'billing': [
    "Thank the caller for contacting the billing department.",
    "Verify patient identity with name and date of birth.",
    "Ask for specific invoice or billing question.",
    "Explain charges and payment options clearly.",
    "Document any billing disputes or questions that need follow-up.",
    "Confirm the patient understands the resolution or next steps."
  ],
  'clinical': [
    "Thank the caller for contacting clinical support.",
    "Verify patient identity with name and date of birth.",
    "Note this is not for medical emergencies (direct to 911 if needed).",
    "Document symptoms or concerns clearly and thoroughly.",
    "Follow triage protocols for routing clinical questions.",
    "Provide clear next steps and timeline expectations."
  ]
};
