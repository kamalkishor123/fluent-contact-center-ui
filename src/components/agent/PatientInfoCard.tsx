
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Phone,
  Calendar,
  AlertTriangle,
  FileText,
  ExternalLink,
  Heart,
  Shield,
  MapPin
} from 'lucide-react';

interface PatientInfoProps {
  patientData: {
    name: string;
    patientId: string;
    dob: string;
    contactNumber: string;
    email?: string;
    address?: string;
    emergencyContact?: string;
    primaryProvider?: string;
    insuranceProvider?: string;
    policyNumber?: string;
    lastAppointment: {
      date: string;
      type: string;
      provider?: string;
    };
    nextAppointment: {
      date: string;
      type: string;
      provider?: string;
    };
    alerts: Array<{
      type: string;
      value: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    medicalAlerts?: Array<{
      type: string;
      description: string;
      severity: 'critical' | 'warning' | 'info';
    }>;
    lastInteraction: string;
    activeCase?: {
      id: string;
      type: string;
      status: string;
      assignedTo: string;
    };
  };
  onViewFullRecord: () => void;
  onCreateCase: () => void;
  onViewActiveCase?: () => void;
}

export const PatientInfoCard = ({ 
  patientData, 
  onViewFullRecord, 
  onCreateCase, 
  onViewActiveCase 
}: PatientInfoProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle className="text-lg">{patientData.name}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onViewFullRecord}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Full Record
            </Button>
            {patientData.activeCase ? (
              <Button size="sm" variant="outline" onClick={onViewActiveCase}>
                <FileText className="h-4 w-4 mr-1" />
                View Case
              </Button>
            ) : (
              <Button size="sm" onClick={onCreateCase}>
                <FileText className="h-4 w-4 mr-1" />
                New Case
              </Button>
            )}
          </div>
        </div>
        <CardDescription>Patient ID: {patientData.patientId}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="font-medium">{patientData.dob}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Contact Number</p>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <p className="font-medium">{patientData.contactNumber}</p>
            </div>
          </div>
          {patientData.email && (
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-sm">{patientData.email}</p>
            </div>
          )}
          {patientData.primaryProvider && (
            <div>
              <p className="text-sm text-muted-foreground">Primary Provider</p>
              <p className="font-medium">{patientData.primaryProvider}</p>
            </div>
          )}
          {patientData.insuranceProvider && (
            <div>
              <p className="text-sm text-muted-foreground">Insurance</p>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <p className="font-medium text-sm">{patientData.insuranceProvider}</p>
              </div>
            </div>
          )}
          {patientData.address && (
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <p className="font-medium text-sm">{patientData.address}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Medical Alerts */}
        {patientData.medicalAlerts && patientData.medicalAlerts.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Medical Alerts</p>
            <div className="space-y-2">
              {patientData.medicalAlerts.map((alert, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                  {getAlertIcon(alert.severity)}
                  <div>
                    <span className="font-medium text-sm">{alert.type}:</span>
                    <span className="text-sm ml-1">{alert.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General Alerts/Flags */}
        {patientData.alerts && patientData.alerts.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Alerts & Flags</p>
            <div className="flex gap-2 flex-wrap">
              {patientData.alerts.map((alert, index) => (
                <Badge 
                  key={index} 
                  variant={alert.priority === 'high' ? 'destructive' : 'outline'}
                  className="text-xs"
                >
                  {alert.type}: {alert.value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Appointments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Last Appointment</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <p className="font-medium text-sm">
                {formatDate(patientData.lastAppointment.date)} ({patientData.lastAppointment.type})
              </p>
            </div>
            {patientData.lastAppointment.provider && (
              <p className="text-xs text-muted-foreground">with {patientData.lastAppointment.provider}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Appointment</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <p className="font-medium text-sm">
                {formatDate(patientData.nextAppointment.date)} ({patientData.nextAppointment.type})
              </p>
            </div>
            {patientData.nextAppointment.provider && (
              <p className="text-xs text-muted-foreground">with {patientData.nextAppointment.provider}</p>
            )}
          </div>
        </div>

        {/* Active Case */}
        {patientData.activeCase && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Active Case</p>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <div>
                  <p className="font-medium text-sm">Case #{patientData.activeCase.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {patientData.activeCase.type} - {patientData.activeCase.status}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Assigned to: {patientData.activeCase.assignedTo}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={onViewActiveCase}>
                  View Details
                </Button>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Last Interaction */}
        <div>
          <p className="text-sm text-muted-foreground">Last Interaction</p>
          <p className="text-sm">{patientData.lastInteraction}</p>
        </div>
      </CardContent>
    </Card>
  );
};
