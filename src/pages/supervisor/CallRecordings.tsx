
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, RefreshCw, Search, Play, Download, Mic, Pause, Volume2, VolumeX } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

// Sample recordings data
const sampleRecordings = [
  { 
    id: 'rec_123', 
    date: new Date('2023-05-20T09:34:12'), 
    agent: 'John Doe',
    agentId: 'a1',
    caller: '+1234567890', 
    queue: 'Support',
    queueId: 'q1',
    duration: 325,
    disposition: 'Resolved'
  },
  { 
    id: 'rec_124', 
    date: new Date('2023-05-20T10:12:45'), 
    agent: 'Jane Smith',
    agentId: 'a2',
    caller: '+1987654321', 
    queue: 'Sales',
    queueId: 'q2',
    duration: 412,
    disposition: 'Callback'
  },
  { 
    id: 'rec_125', 
    date: new Date('2023-05-20T11:05:33'), 
    agent: 'Mike Johnson',
    agentId: 'a3',
    caller: '+1122334455', 
    queue: 'Billing',
    queueId: 'q3',
    duration: 189,
    disposition: 'Transferred'
  },
  { 
    id: 'rec_126', 
    date: new Date('2023-05-20T13:22:18'), 
    agent: 'Sara Wilson',
    agentId: 'a4',
    caller: '+1555666777', 
    queue: 'Support',
    queueId: 'q1',
    duration: 602,
    disposition: 'Resolved'
  },
  { 
    id: 'rec_127', 
    date: new Date('2023-05-20T14:45:09'), 
    agent: 'John Doe',
    agentId: 'a1',
    caller: '+1999888777', 
    queue: 'Sales',
    queueId: 'q2',
    duration: 245,
    disposition: 'Follow-up'
  },
  { 
    id: 'rec_128', 
    date: new Date('2023-05-20T16:03:57'), 
    agent: 'Jane Smith',
    agentId: 'a2',
    caller: '+1888777666', 
    queue: 'Support',
    queueId: 'q1',
    duration: 513,
    disposition: 'Resolved'
  }
];

interface PlaybackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordingId: string;
  recordingData?: any;
}

const PlaybackDialog: React.FC<PlaybackDialogProps> = ({ open, onOpenChange, recordingId, recordingData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const maxTime = recordingData?.duration || 0;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0) setMuted(false);
  };
  
  const handleMuteToggle = () => {
    setMuted(!muted);
  };
  
  // Simulate playback progression
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && currentTime < maxTime) {
      interval = setInterval(() => {
        setCurrentTime(ct => {
          const newTime = ct + 1;
          if (newTime >= maxTime) {
            setIsPlaying(false);
            return maxTime;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, maxTime]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Call Recording</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-right text-sm font-medium">Recording ID:</div>
            <div className="col-span-3 text-sm">{recordingId}</div>
            
            <div className="text-right text-sm font-medium">Agent:</div>
            <div className="col-span-3 text-sm">{recordingData?.agent}</div>
            
            <div className="text-right text-sm font-medium">Caller:</div>
            <div className="col-span-3 text-sm">{recordingData?.caller}</div>
            
            <div className="text-right text-sm font-medium">Time:</div>
            <div className="col-span-3 text-sm">{recordingData?.date ? format(recordingData.date, "MMM d, yyyy h:mm a") : ""}</div>
            
            <div className="text-right text-sm font-medium">Queue:</div>
            <div className="col-span-3 text-sm">{recordingData?.queue}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(maxTime)}</span>
            </div>
            
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${(currentTime / maxTime) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <div className="flex-1 flex items-center mx-4 space-x-2">
                <Button variant="ghost" size="icon" onClick={handleMuteToggle}>
                  {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <div className="w-full">
                  <Slider
                    value={[muted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              </div>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CallRecordings = () => {
  const { toast } = useToast();
  
  // State for search filters
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>(undefined);
  const [selectedQueue, setSelectedQueue] = useState<string | undefined>(undefined);
  const [durationRange, setDurationRange] = useState([0, 900]); // In seconds
  
  // State for playback dialog
  const [playbackOpen, setPlaybackOpen] = useState(false);
  const [currentRecordingId, setCurrentRecordingId] = useState<string>('');
  const [currentRecordingData, setCurrentRecordingData] = useState<any>(null);
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleSearch = () => {
    toast({
      title: "Search executed",
      description: "Filtering recordings based on criteria",
    });
  };
  
  const handlePlayRecording = (recordingId: string) => {
    const recording = sampleRecordings.find(r => r.id === recordingId);
    setCurrentRecordingId(recordingId);
    setCurrentRecordingData(recording);
    setPlaybackOpen(true);
  };
  
  const handleDownload = (recordingId: string) => {
    toast({
      title: "Downloading recording",
      description: `Recording ${recordingId} is being prepared for download`,
    });
  };
  
  return (
    <PageLayout 
      title="Call Recordings" 
      subtitle="Search and listen to call recordings"
      allowedRoles={['supervisor', 'admin']}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Recordings</CardTitle>
            <CardDescription>Filter recordings by date, agent, queue, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <Label className="mb-1 block">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label className="mb-1 block">Agent</Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Agents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>All Agents</SelectItem>
                    <SelectItem value="a1">John Doe</SelectItem>
                    <SelectItem value="a2">Jane Smith</SelectItem>
                    <SelectItem value="a3">Mike Johnson</SelectItem>
                    <SelectItem value="a4">Sara Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="mb-1 block">Queue</Label>
                <Select value={selectedQueue} onValueChange={setSelectedQueue}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Queues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>All Queues</SelectItem>
                    <SelectItem value="q1">Support</SelectItem>
                    <SelectItem value="q2">Sales</SelectItem>
                    <SelectItem value="q3">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="mb-1 block">Caller ID</Label>
                <Input 
                  placeholder="Enter phone number" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <Label>Call Duration (seconds)</Label>
                <span className="text-sm text-muted-foreground">
                  {formatDuration(durationRange[0])} - {formatDuration(durationRange[1])}
                </span>
              </div>
              <Slider
                defaultValue={durationRange}
                max={900}
                step={10}
                onValueChange={setDurationRange}
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recording Results</CardTitle>
            <CardDescription>Found {sampleRecordings.length} recordings</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Caller ID</TableHead>
                  <TableHead>Queue</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Disposition</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleRecordings.map((recording) => (
                  <TableRow key={recording.id}>
                    <TableCell>{format(recording.date, "MMM d, yyyy h:mm a")}</TableCell>
                    <TableCell>{recording.agent}</TableCell>
                    <TableCell>{recording.caller}</TableCell>
                    <TableCell>{recording.queue}</TableCell>
                    <TableCell>{formatDuration(recording.duration)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{recording.disposition}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handlePlayRecording(recording.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownload(recording.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <PlaybackDialog 
        open={playbackOpen}
        onOpenChange={setPlaybackOpen}
        recordingId={currentRecordingId}
        recordingData={currentRecordingData}
      />
    </PageLayout>
  );
};

export default CallRecordings;
