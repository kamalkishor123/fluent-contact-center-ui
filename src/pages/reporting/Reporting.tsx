
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Calendar as CalendarIcon,
  Download,
  FileText,
  RefreshCw,
  Save,
  Share2,
  Printer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Import the report components
import AgentPerformanceReport from './AgentPerformanceReport';
import QueuePerformanceReport from './QueuePerformanceReport';
import CallVolumeReport from './CallVolumeReport';
import SLAReport from './SLAReport';

const Reporting = () => {
  const { toast } = useToast();
  
  // State for report settings
  const [reportType, setReportType] = useState('agent-performance');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: new Date(),
  });
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>(undefined);
  const [selectedQueue, setSelectedQueue] = useState<string | undefined>(undefined);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  
  const handleGenerateReport = () => {
    toast({
      title: "Report generated",
      description: "The report data has been refreshed",
    });
  };
  
  const handleExportReport = (format: 'csv' | 'pdf' | 'excel') => {
    toast({
      title: `Exporting ${format.toUpperCase()}`,
      description: `Your report is being prepared for download`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Your ${format.toUpperCase()} report is ready for download`,
      });
    }, 1500);
  };
  
  const handleSaveReport = () => {
    setShowSaveDialog(true);
  };
  
  const confirmSaveReport = () => {
    toast({
      title: "Report saved",
      description: `"${reportName}" has been saved to your reports`,
    });
    setShowSaveDialog(false);
    setReportName('');
    setReportDescription('');
  };
  
  const handlePrintReport = () => {
    toast({
      title: "Printing report",
      description: "Preparing report for printing",
    });
    window.print();
  };

  return (
    <PageLayout 
      title="Reporting" 
      subtitle="Generate and view contact center reports"
      allowedRoles={['supervisor', 'admin']}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>Configure and generate your reports</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSaveReport}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Report
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agent-performance">Agent Performance</SelectItem>
                    <SelectItem value="queue-performance">Queue Performance</SelectItem>
                    <SelectItem value="call-volume">Call Volume</SelectItem>
                    <SelectItem value="sla">SLA/Service Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
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
                        <span>Select date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
                {(reportType === 'agent-performance') && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Agent</label>
                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Agents" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>All Agents</SelectItem>
                        <SelectGroup>
                          <SelectLabel>Agents</SelectLabel>
                          <SelectItem value="a1">John Doe</SelectItem>
                          <SelectItem value="a2">Jane Smith</SelectItem>
                          <SelectItem value="a3">Mike Johnson</SelectItem>
                          <SelectItem value="a4">Sara Wilson</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {(reportType === 'queue-performance' || reportType === 'sla') && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Queue</label>
                    <Select value={selectedQueue} onValueChange={setSelectedQueue}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Queues" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>All Queues</SelectItem>
                        <SelectGroup>
                          <SelectLabel>Queues</SelectLabel>
                          <SelectItem value="q1">General Inquiries</SelectItem>
                          <SelectItem value="q2">Technical Support</SelectItem>
                          <SelectItem value="q3">Billing</SelectItem>
                          <SelectItem value="q4">Sales</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {reportType === 'call-volume' && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Grouping</label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue placeholder="Select grouping" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedAgent(undefined);
                  setSelectedQueue(undefined);
                }}
              >
                Reset Filters
              </Button>
              <Button 
                onClick={handleGenerateReport}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="print:shadow-none" id="report-content">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 print:pb-2">
            <div>
              <CardTitle>
                {reportType === 'agent-performance' && 'Agent Performance Report'}
                {reportType === 'queue-performance' && 'Queue Performance Report'}
                {reportType === 'call-volume' && 'Call Volume Report'}
                {reportType === 'sla' && 'SLA/Service Level Report'}
              </CardTitle>
              <CardDescription className="print:text-black">
                {dateRange.from && dateRange.to && (
                  <>
                    {format(dateRange.from, "MMMM dd, yyyy")} to {format(dateRange.to, "MMMM dd, yyyy")}
                  </>
                )}
                {selectedAgent && ' • Filtered by Agent'}
                {selectedQueue && ' • Filtered by Queue'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('csv')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('pdf')}
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrintReport}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Render the appropriate report based on type */}
            {reportType === 'agent-performance' && <AgentPerformanceReport agent={selectedAgent} />}
            {reportType === 'queue-performance' && <QueuePerformanceReport queue={selectedQueue} />}
            {reportType === 'call-volume' && <CallVolumeReport />}
            {reportType === 'sla' && <SLAReport queue={selectedQueue} />}
          </CardContent>
          
          <CardFooter className="text-sm text-muted-foreground print:text-gray-700">
            Report generated on {format(new Date(), "MMMM dd, yyyy 'at' h:mm a")}
          </CardFooter>
        </Card>
      </div>
      
      {/* Save Report Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Report</DialogTitle>
            <DialogDescription>
              Save this report configuration for future use
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <input
                id="name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="My Report"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <textarea
                id="description"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Description of this report"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSaveReport} disabled={!reportName}>
              Save Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Reporting;
