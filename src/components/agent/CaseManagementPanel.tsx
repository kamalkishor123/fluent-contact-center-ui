
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  Plus,
  Search,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CaseData {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed';
  assignedTo: string;
  createdDate: string;
  lastUpdated: string;
  description: string;
  notes: Array<{
    id: string;
    timestamp: string;
    author: string;
    content: string;
    type: 'note' | 'action' | 'resolution';
  }>;
}

interface CaseManagementPanelProps {
  currentPatientId?: string;
  currentPatientName?: string;
}

const MOCK_CASES: CaseData[] = [
  {
    id: 'CASE-001',
    patientId: 'MRN-78912345',
    patientName: 'Martha Johnson',
    type: 'Billing Inquiry',
    priority: 'medium',
    status: 'in-progress',
    assignedTo: 'Alex Rivera',
    createdDate: '2025-06-10T09:00:00Z',
    lastUpdated: '2025-06-12T14:30:00Z',
    description: 'Patient inquiring about outstanding balance and payment options',
    notes: [
      {
        id: 'note1',
        timestamp: '2025-06-10T09:15:00Z',
        author: 'Alex Rivera',
        content: 'Initial call regarding $125 outstanding balance. Patient requesting payment plan.',
        type: 'note'
      },
      {
        id: 'note2',
        timestamp: '2025-06-12T14:30:00Z',
        author: 'Taylor Wong',
        content: 'Contacted billing department. Payment plan approved for 3 months.',
        type: 'action'
      }
    ]
  },
  {
    id: 'CASE-002',
    patientId: 'MRN-78912345',
    patientName: 'Martha Johnson',
    type: 'Appointment Scheduling',
    priority: 'low',
    status: 'resolved',
    assignedTo: 'Jordan Smith',
    createdDate: '2025-06-08T11:00:00Z',
    lastUpdated: '2025-06-08T11:30:00Z',
    description: 'Patient needs to schedule follow-up appointment',
    notes: [
      {
        id: 'note3',
        timestamp: '2025-06-08T11:30:00Z',
        author: 'Jordan Smith',
        content: 'Scheduled follow-up appointment for May 20, 2025 at 2:00 PM with Dr. Peterson.',
        type: 'resolution'
      }
    ]
  }
];

const CASE_TYPES = [
  'Billing Inquiry',
  'Appointment Scheduling',
  'Prescription Refill',
  'Insurance Verification',
  'Medical Records Request',
  'Technical Support',
  'Complaint Resolution',
  'General Inquiry',
  'Emergency Contact',
  'Other'
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
];

export const CaseManagementPanel = ({ currentPatientId, currentPatientName }: CaseManagementPanelProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCaseDetails, setShowCaseDetails] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Filter cases
  const filteredCases = MOCK_CASES.filter(caseItem => {
    if (currentPatientId && caseItem.patientId !== currentPatientId) return false;
    if (searchQuery) {
      return (
        caseItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

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

  const handleCreateCase = () => {
    setShowCreateDialog(true);
  };

  const handleViewCase = (caseItem: CaseData) => {
    setSelectedCase(caseItem);
    setShowCaseDetails(true);
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedCase) return;

    toast({
      title: "Note added",
      description: `Note added to case ${selectedCase.id}`,
    });

    setNewNote('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Case Management
              </CardTitle>
              <CardDescription>
                {currentPatientName ? 
                  `Cases for ${currentPatientName}` : 
                  'Manage patient cases and inquiries'
                }
              </CardDescription>
            </div>
            <Button onClick={handleCreateCase}>
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases by ID, type, or description..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Cases List */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {filteredCases.map((caseItem) => (
                <Card key={caseItem.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewCase(caseItem)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Case #{caseItem.id}</span>
                          <Badge variant="outline">{caseItem.type}</Badge>
                          <Badge className={PRIORITY_LEVELS.find(p => p.value === caseItem.priority)?.color}>
                            {PRIORITY_LEVELS.find(p => p.value === caseItem.priority)?.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {caseItem.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {caseItem.assignedTo}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(caseItem.lastUpdated)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(caseItem.status)}
                        <span className="text-sm capitalize">{caseItem.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredCases.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No cases found</p>
                  {currentPatientName && (
                    <Button className="mt-2" onClick={handleCreateCase}>
                      Create first case for {currentPatientName}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Case Details Dialog */}
      <Dialog open={showCaseDetails} onOpenChange={setShowCaseDetails}>
        {selectedCase && (
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Case #{selectedCase.id} - {selectedCase.type}</DialogTitle>
              <DialogDescription>
                Patient: {selectedCase.patientName} | Created: {formatDateTime(selectedCase.createdDate)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className={PRIORITY_LEVELS.find(p => p.value === selectedCase.priority)?.color}>
                  {PRIORITY_LEVELS.find(p => p.value === selectedCase.priority)?.label} Priority
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {selectedCase.status.replace('-', ' ')}
                </Badge>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="text-sm mt-1">{selectedCase.description}</p>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-base">Case Notes & Activity</Label>
                <ScrollArea className="h-[200px] mt-2 border rounded p-2">
                  <div className="space-y-3">
                    {selectedCase.notes.map((note) => (
                      <div key={note.id} className="border-l-2 border-muted pl-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{note.author}</span>
                          <span>{formatDateTime(note.timestamp)}</span>
                        </div>
                        <p className="text-sm mt-1">{note.content}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {note.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div>
                <Label htmlFor="new-note">Add Note</Label>
                <Textarea
                  id="new-note"
                  placeholder="Add a note to this case..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="mt-1"
                />
                <Button size="sm" onClick={handleAddNote} className="mt-2" disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCaseDetails(false)}>
                Close
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Case updated",
                  description: `Case ${selectedCase.id} has been updated`,
                });
              }}>
                Update Case
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Create Case Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Case</DialogTitle>
            <DialogDescription>
              {currentPatientName ? 
                `Creating a new case for ${currentPatientName}` :
                'Create a new patient case'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="case-type">Case Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  {CASE_TYPES.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase().replace(' ', '-')}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_LEVELS.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the case details..."
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Case created",
                description: "New case has been created successfully",
              });
              setShowCreateDialog(false);
            }}>
              Create Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
