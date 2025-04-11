
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Shield, 
  Database, 
  Save, 
  AlertCircle, 
  CheckCircle,
  RefreshCcw
} from 'lucide-react';

// Define schema for general settings form
const generalSettingsSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  supportEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  supportPhone: z.string().min(5, {
    message: "Please enter a valid phone number.",
  }),
  timezone: z.string(),
  dateFormat: z.string(),
  language: z.string(),
  maintenanceMode: z.boolean().default(false)
});

// Define schema for call settings form
const callSettingsSchema = z.object({
  maxQueueTime: z.number().min(30).max(1800),
  agentWrapUpTime: z.number().min(0).max(300),
  recordAllCalls: z.boolean().default(true),
  enableTranscription: z.boolean().default(false),
  afterHoursMessage: z.string().min(10),
  holidayMessage: z.string().min(10),
  maxVoicemailLength: z.number().min(30).max(300)
});

// Define schema for notification settings form
const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  missedCallAlerts: z.boolean().default(true),
  systemAlerts: z.boolean().default(true),
  performanceReports: z.boolean().default(true),
  reportFrequency: z.string()
});

const SystemSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('general');
  
  // General settings form
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: 'Contact Center Inc.',
      supportEmail: 'support@contactcenter.com',
      supportPhone: '+1 (555) 123-4567',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      language: 'en-US',
      maintenanceMode: false
    }
  });

  // Call settings form
  const callForm = useForm<z.infer<typeof callSettingsSchema>>({
    resolver: zodResolver(callSettingsSchema),
    defaultValues: {
      maxQueueTime: 300, // 5 minutes
      agentWrapUpTime: 60, // 60 seconds
      recordAllCalls: true,
      enableTranscription: false,
      afterHoursMessage: 'Thank you for calling. Our office is currently closed. Please call back during our normal business hours.',
      holidayMessage: 'Thank you for calling. Our office is closed for the holiday. Please call back during our normal business hours.',
      maxVoicemailLength: 120 // 2 minutes
    }
  });
  
  // Notification settings form
  const notificationForm = useForm<z.infer<typeof notificationSettingsSchema>>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      missedCallAlerts: true,
      systemAlerts: true,
      performanceReports: true,
      reportFrequency: 'weekly'
    }
  });

  const onSubmitGeneralSettings = (data: z.infer<typeof generalSettingsSchema>) => {
    console.log('General settings:', data);
    toast({
      title: "General settings updated",
      description: "Your system settings have been saved successfully."
    });
  };

  const onSubmitCallSettings = (data: z.infer<typeof callSettingsSchema>) => {
    console.log('Call settings:', data);
    toast({
      title: "Call settings updated",
      description: "Your call settings have been saved successfully."
    });
  };

  const onSubmitNotificationSettings = (data: z.infer<typeof notificationSettingsSchema>) => {
    console.log('Notification settings:', data);
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved successfully."
    });
  };

  const handleSystemCache = () => {
    toast({
      title: "System cache cleared",
      description: "The system cache has been cleared successfully."
    });
  };

  const handleSystemBackup = () => {
    toast({
      title: "System backup initiated",
      description: "A system backup has been initiated. You will be notified when complete."
    });
  };

  return (
    <PageLayout 
      title="System Settings" 
      subtitle="Configure global system preferences and parameters"
      allowedRoles={['admin']}
    >
      <div className="space-y-6">
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="call">Call Settings</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" /> General Settings
                </CardTitle>
                <CardDescription>Configure basic system settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(onSubmitGeneralSettings)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={generalForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="supportEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Support Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="supportPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Support Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a timezone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="dateFormat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Format</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a date format" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>System Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en-US">English (US)</SelectItem>
                                <SelectItem value="es-ES">Spanish</SelectItem>
                                <SelectItem value="fr-FR">French</SelectItem>
                                <SelectItem value="de-DE">German</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <FormField
                      control={generalForm.control}
                      name="maintenanceMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Maintenance Mode</FormLabel>
                            <FormDescription>
                              When enabled, the system will be unavailable to regular users.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* System Maintenance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" /> System Maintenance
                </CardTitle>
                <CardDescription>Manage system cache and backups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h4 className="text-sm font-medium">System Cache</h4>
                      <p className="text-sm text-muted-foreground">Clear system cache to resolve performance issues</p>
                    </div>
                    <Button variant="outline" onClick={handleSystemCache}>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Clear Cache
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h4 className="text-sm font-medium">System Backup</h4>
                      <p className="text-sm text-muted-foreground">Backup all system data including configurations</p>
                    </div>
                    <Button variant="outline" onClick={handleSystemBackup}>
                      <Database className="mr-2 h-4 w-4" />
                      Backup Now
                    </Button>
                  </div>
                  
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Last Automated Backup</h4>
                        <p className="text-sm text-muted-foreground">April 10, 2025 at 02:00 AM</p>
                        <p className="text-sm text-muted-foreground mt-1">System backups are automatically performed daily at 2 AM.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Call Settings Tab */}
          <TabsContent value="call" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5" /> Call Settings
                </CardTitle>
                <CardDescription>Configure call handling and recording preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...callForm}>
                  <form onSubmit={callForm.handleSubmit(onSubmitCallSettings)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={callForm.control}
                        name="maxQueueTime"
                        render={({ field: { value, onChange } }) => (
                          <FormItem>
                            <div className="flex justify-between">
                              <FormLabel>Maximum Queue Time (seconds)</FormLabel>
                              <span className="text-sm">{value} seconds</span>
                            </div>
                            <FormControl>
                              <Slider 
                                min={30} 
                                max={1800} 
                                step={30} 
                                value={[value]} 
                                onValueChange={(vals) => onChange(vals[0])}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum time callers can wait in queue before being redirected
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={callForm.control}
                        name="agentWrapUpTime"
                        render={({ field: { value, onChange } }) => (
                          <FormItem>
                            <div className="flex justify-between">
                              <FormLabel>Agent Wrap-Up Time (seconds)</FormLabel>
                              <span className="text-sm">{value} seconds</span>
                            </div>
                            <FormControl>
                              <Slider 
                                min={0} 
                                max={300} 
                                step={10} 
                                value={[value]} 
                                onValueChange={(vals) => onChange(vals[0])}
                              />
                            </FormControl>
                            <FormDescription>
                              Time allowed for agents to complete tasks after ending a call
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid gap-4 md:grid-cols-2 pt-2">
                        <FormField
                          control={callForm.control}
                          name="recordAllCalls"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Record All Calls</FormLabel>
                                <FormDescription>
                                  Automatically record all incoming and outgoing calls
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={callForm.control}
                          name="enableTranscription"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Enable Call Transcription</FormLabel>
                                <FormDescription>
                                  Automatically transcribe recorded calls
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <FormField
                        control={callForm.control}
                        name="afterHoursMessage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>After Hours Message</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Message played to callers outside of business hours
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={callForm.control}
                        name="holidayMessage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Holiday Message</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Message played to callers during holidays
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={callForm.control}
                        name="maxVoicemailLength"
                        render={({ field: { value, onChange } }) => (
                          <FormItem>
                            <div className="flex justify-between">
                              <FormLabel>Max Voicemail Length (seconds)</FormLabel>
                              <span className="text-sm">{value} seconds</span>
                            </div>
                            <FormControl>
                              <Slider 
                                min={30} 
                                max={300} 
                                step={10} 
                                value={[value]} 
                                onValueChange={(vals) => onChange(vals[0])}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum recording length for voicemails
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Call Settings
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" /> Notification Settings
                </CardTitle>
                <CardDescription>Configure system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onSubmitNotificationSettings)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive important system notifications via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">SMS Notifications</FormLabel>
                              <FormDescription>
                                Receive urgent alerts via SMS
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <Separator className="my-2" />
                      
                      <h3 className="text-lg font-medium">Alert Types</h3>
                      
                      <FormField
                        control={notificationForm.control}
                        name="missedCallAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Missed Call Alerts</FormLabel>
                              <FormDescription>
                                Notify when calls are missed or abandoned
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="systemAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>System Alerts</FormLabel>
                              <FormDescription>
                                Receive notifications about system issues
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="performanceReports"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Performance Reports</FormLabel>
                              <FormDescription>
                                Receive scheduled performance reports
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="reportFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Report Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How often to receive scheduled reports
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Notification Settings
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

const Bell = Mail; // Using Mail as a placeholder for Bell icon

export default SystemSettings;
