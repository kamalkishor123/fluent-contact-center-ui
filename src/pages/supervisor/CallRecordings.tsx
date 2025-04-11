
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  Search, 
  PlayCircle, 
  Download, 
  MoreVertical, 
  FastForward, 
  Rewind,
  Pause,
  Volume2,
  RefreshCw,
  Filter,
  Star,
  StarOff
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

// Mock data for the recordings
const MOCK_RECORDINGS = [
  { 
    id: 'r1', 
    date: '2023-04-11', 
    time: '09:45:22', 
    agent: 'John Doe',
    callerId: '+1 555-123-4567', 
    duration: 240, 
    direction: 'inbound',
    queue: 'General Inquiries',
    disposition: 'Resolved',
    starred: false
  },
  { 
    id: 'r2', 
    date: '2023-04-11', 
    time: '10:12:05', 
    agent: 'Jane Smith',
    callerId: '+1 555-987-6543', 
    duration: 185, 
    direction: 'outbound',
    queue: 'Technical Support',
    disposition: 'Callback Required',
    starred: true
  },
  { 
    id: 'r3', 
    date: '2023-04-10', 
    time: '15:30:11', 
    agent: 'Mike Johnson',
    callerId: '+1 555-456-7890', 
    duration: 412, 
    direction: 'inbound',
    queue: 'Billing',
    disposition: 'Escalated',
    starred: false
  },
  { 
    id: 'r4', 
    date: '2023-04-10', 
    time: '11:05:33', 
    agent: 'Sara Wilson',
    callerId: '+1 555-234-5678', 
    duration: 178, 
    direction: 'inbound',
    queue: 'General Inquiries',
    disposition: 'Resolved',
    starred: false
  },
  { 
    id: 'r5', 
    date: '2023-04-09', 
    time: '14:22:45', 
    agent: 'John Doe',
    callerId: '+1 555-345-6789', 
    duration: 325, 
    direction: 'outbound',
    queue: 'Technical Support',
    disposition: 'Resolved',
    starred: false
  },
];

// Mock agents
const MOCK_AGENTS = [
  { id: 'a1', name: 'John Doe' },
  { id: 'a2', name: 'Jane Smith' },
  { id: 'a3', name: 'Mike Johnson' },
  { id: 'a4', name: 'Sara Wilson' },
];

// Mock queues
const MOCK_QUEUES = [
  { id: 'q1', name: 'General Inquiries' },
  { id: 'q2', name: 'Technical Support' },
  { id: 'q3', name: 'Billing' },
  { id: 'q4', name: 'Sales' },
];

const CallRecordings = () => {
  const { toast } = useToast();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>(undefined);
  const [selectedQueue, setSelectedQueue] = useState<string | undefined>(undefined);
  const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedDirection, setSelectedDirection] = useState<string | undefined>(undefined);
  const [minDuration, setMinDuration] = useState(0);
  const [maxDuration, setMaxDuration] = useState(600); // 10 minutes
  const [showFilters, setShowFilters] = useState(false);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  
  // State for recording playback
  const [currentRecording, setCurrentRecording] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [volume, setVolume] = useState(80);
  
  // Filter recordings based on selected filters
  const filteredRecordings = MOCK_RECORDINGS.filter(recording => {
    // Text search
    if (
      searchQuery && 
      !recording.callerId.includes(searchQuery) && 
      !recording.agent.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !recording.disposition.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Agent filter
    if (selectedAgent && recording.agent !== MOCK_AGENTS.find(a => a.id === selectedAgent)?.name) {
      return false;
    }
    
    // Queue filter
    if (selectedQueue && recording.queue !== MOCK_QUEUES.find(q => q.id === selectedQueue)?.name) {
      return false;
    }
    
    // Direction filter
    if (selectedDirection && recording.direction !== selectedDirection) {
      return false;
    }
    
    // Date range filter
    if (selectedDateRange.from) {
      const recordingDate = new Date(recording.date);
      if (recordingDate < selectedDateRange.from) {
        return false;
      }
    }
    
    if (selectedDateRange.to) {
      const recordingDate = new Date(recording.date);
      if (recordingDate > selectedDateRange.to) {
        return false;
      }
    }
    
    // Duration filter
    if (
      recording.duration < minDuration ||
      recording.duration > maxDuration
    ) {
      return false;
    }
    
    // Starred filter
    if (showStarredOnly && !recording.starred) {
      return false;
    }
    
    return true;
  });
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleRefresh = () => {
    toast({
      title: "Refreshed",
      description: "Call recording list has been updated",
    });
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedAgent(undefined);
    setSelectedQueue(undefined);
    setSelectedDateRange({ from: undefined, to: undefined });
    setSelectedDirection(undefined);
    setMinDuration(0);
    setMaxDuration(600);
    setShowStarredOnly(false);
  };
  
  const playRecording = (recording: any) => {
    setCurrentRecording(recording);
    setIsPlaying(true);
    setPlaybackPosition(0);
    
    toast({
      title: "Playing recording",
      description: `${recording.agent}'s call with ${recording.callerId}`,
    });
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (value: number[]) => {
    setPlaybackPosition(value[0]);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const downloadRecording = (recording: any) => {
    toast({
      title: "Download started",
      description: `Recording ${recording.id} is being downloaded`,
    });
  };
  
  const toggleStarred = (recording: any, index: number) => {
    const updatedRecordings = [...MOCK_RECORDINGS];
    updatedRecordings[index].starred = !updatedRecordings[index].starred;
    
    toast({
      title: updatedRecordings[index].starred ? "Recording starred" : "Star removed",
      description: `Recording ${recording.id} has been ${updatedRecordings[index].starred ? 'added to' : 'removed from'} starred`,
    });
  };

  return (
    <PageLayout 
      title="Call Recordings" 
      subtitle="Search and review call recordings"
      allowedRoles={['supervisor', 'admin']}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>Call Recordings</CardTitle>
            <CardDescription>Search, filter, and play call recordings</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="relative w-full md:w-auto md:flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by caller ID, agent name, or disposition..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDateRange.from ? (
                    selectedDateRange.to ? (
                      <>
                        {format(selectedDateRange.from, "LLL dd, y")} -{" "}
                        {format(selectedDateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(selectedDateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={selectedDateRange}
                  onSelect={setSelectedDateRange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button
              variant={showStarredOnly ? "secondary" : "outline"}
              size="sm"
              className="w-full md:w-auto"
              onClick={() => setShowStarredOnly(!showStarredOnly)}
            >
              {showStarredOnly ? <StarOff className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
              {showStarredOnly ? "All Recordings" : "Starred Only"}
            </Button>
          </div>
          
          {showFilters && (
            <Card className="mb-4 border border-dashed">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Agent</label>
                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Agents" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>All Agents</SelectItem>
                        {MOCK_AGENTS.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Queue</label>
                    <Select value={selectedQueue} onValueChange={setSelectedQueue}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Queues" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>All Queues</SelectItem>
                        {MOCK_QUEUES.map(queue => (
                          <SelectItem key={queue.id} value={queue.id}>
                            {queue.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Direction</label>
                    <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Directions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>All Directions</SelectItem>
                        <SelectItem value="inbound">Inbound</SelectItem>
                        <SelectItem value="outbound">Outbound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="text-sm font-medium mb-1 block">
                      Duration Range: {formatTime(minDuration)} - {formatTime(maxDuration)}
                    </label>
                    <div className="px-2">
                      <Slider 
                        defaultValue={[minDuration, maxDuration]} 
                        min={0}
                        max={600}
                        step={30}
                        onValueChange={(values) => {
                          setMinDuration(values[0]);
                          setMaxDuration(values[1]);
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Caller ID</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Queue</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Disposition</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecordings.length > 0 ? (
                  filteredRecordings.map((recording, index) => (
                    <TableRow key={recording.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStarred(recording, index)}
                        >
                          {recording.starred ? (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <Star className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {recording.starred ? "Unstar" : "Star"} recording
                          </span>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{recording.date}</div>
                        <div className="text-sm text-muted-foreground">{recording.time}</div>
                      </TableCell>
                      <TableCell>{recording.agent}</TableCell>
                      <TableCell>{recording.callerId}</TableCell>
                      <TableCell>{formatTime(recording.duration)}</TableCell>
                      <TableCell>{recording.queue}</TableCell>
                      <TableCell>
                        <Badge variant={recording.direction === 'inbound' ? 'default' : 'secondary'}>
                          {recording.direction}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          recording.disposition === 'Resolved' ? 'border-green-500 text-green-700 bg-green-50' :
                          recording.disposition === 'Escalated' ? 'border-red-500 text-red-700 bg-red-50' :
                          'border-amber-500 text-amber-700 bg-amber-50'
                        }>
                          {recording.disposition}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => playRecording(recording)}
                          >
                            <PlayCircle className="h-4 w-4" />
                            <span className="sr-only">Play</span>
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => downloadRecording(recording)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost"
                              >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Add Note</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No recordings match your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredRecordings.length} of {MOCK_RECORDINGS.length} recordings
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Audio Player Dialog */}
      <Dialog open={!!currentRecording} onOpenChange={(open) => {
        if (!open) setCurrentRecording(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Playing Recording</DialogTitle>
            <DialogDescription>
              {currentRecording?.agent}'s call with {currentRecording?.callerId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-2">
            <div className="flex flex-col space-y-1.5">
              <div className="text-sm">
                <span className="font-medium">Date:</span> {currentRecording?.date} at {currentRecording?.time}
              </div>
              <div className="text-sm">
                <span className="font-medium">Queue:</span> {currentRecording?.queue}
              </div>
              <div className="text-sm">
                <span className="font-medium">Direction:</span> {currentRecording?.direction}
              </div>
              <div className="text-sm">
                <span className="font-medium">Disposition:</span> {currentRecording?.disposition}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{formatTime(playbackPosition)}</span>
                <span className="text-sm">{formatTime(currentRecording?.duration || 0)}</span>
              </div>
              <Slider 
                value={[playbackPosition]}
                max={currentRecording?.duration || 100}
                step={1}
                onValueChange={handleSeek}
              />
              <div className="flex justify-center mt-2 space-x-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const newPosition = Math.max(0, playbackPosition - 10);
                    setPlaybackPosition(newPosition);
                  }}
                >
                  <Rewind className="h-4 w-4" />
                </Button>
                <Button 
                  variant={isPlaying ? 'outline' : 'default'}
                  size="icon"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const newPosition = Math.min(currentRecording?.duration || 0, playbackPosition + 10);
                    setPlaybackPosition(newPosition);
                  }}
                >
                  <FastForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <Slider 
                value={[volume]} 
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
              <span className="w-12 text-right text-sm">{volume}%</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => downloadRecording(currentRecording)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={() => setCurrentRecording(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default CallRecordings;
