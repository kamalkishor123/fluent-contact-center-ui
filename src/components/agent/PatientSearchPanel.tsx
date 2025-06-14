
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  User,
  Phone,
  Calendar,
  FileText,
  Filter,
  X
} from 'lucide-react';

interface PatientSearchResult {
  id: string;
  name: string;
  dob: string;
  contactNumber: string;
  email?: string;
  lastVisit?: string;
  primaryProvider?: string;
  status: 'active' | 'inactive';
  activeCases: number;
}

interface SearchFilter {
  provider?: string;
  ageRange?: string;
  lastVisitRange?: string;
  status?: string;
}

const MOCK_PATIENTS: PatientSearchResult[] = [
  {
    id: 'MRN-78912345',
    name: 'Martha Johnson',
    dob: '05/12/1968',
    contactNumber: '+1 555-876-5432',
    email: 'martha.j@email.com',
    lastVisit: '2025-04-15',
    primaryProvider: 'Dr. Sarah Peterson',
    status: 'active',
    activeCases: 1
  },
  {
    id: 'MRN-78912346',
    name: 'Robert Smith',
    dob: '03/22/1985',
    contactNumber: '+1 555-234-5678',
    email: 'robert.smith@email.com',
    lastVisit: '2025-06-10',
    primaryProvider: 'Dr. Michael Chen',
    status: 'active',
    activeCases: 0
  },
  {
    id: 'MRN-78912347',
    name: 'Sarah Williams',
    dob: '11/30/1992',
    contactNumber: '+1 555-345-6789',
    lastVisit: '2025-05-20',
    primaryProvider: 'Dr. Sarah Peterson',
    status: 'active',
    activeCases: 2
  }
];

const PROVIDERS = [
  'Dr. Sarah Peterson',
  'Dr. Michael Chen',
  'Dr. Lisa Johnson',
  'Dr. Robert Davis'
];

interface PatientSearchPanelProps {
  onSelectPatient: (patient: PatientSearchResult) => void;
}

export const PatientSearchPanel = ({ onSelectPatient }: PatientSearchPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [filters, setFilters] = useState<SearchFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<PatientSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      let results = MOCK_PATIENTS.filter(patient => {
        switch (searchType) {
          case 'name':
            return patient.name.toLowerCase().includes(searchQuery.toLowerCase());
          case 'phone':
            return patient.contactNumber.includes(searchQuery);
          case 'patientId':
            return patient.id.toLowerCase().includes(searchQuery.toLowerCase());
          case 'email':
            return patient.email?.toLowerCase().includes(searchQuery.toLowerCase());
          default:
            return false;
        }
      });

      // Apply filters
      if (filters.provider) {
        results = results.filter(p => p.primaryProvider === filters.provider);
      }
      if (filters.status) {
        results = results.filter(p => p.status === filters.status);
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Patient Search
        </CardTitle>
        <CardDescription>
          Search for patients by name, phone, patient ID, or email
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Controls */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="patientId">Patient ID</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={`Search by ${searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!searchQuery.trim() || isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            {Object.keys(filters).length > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 border rounded">
              <div>
                <Label htmlFor="provider-filter">Provider</Label>
                <Select value={filters.provider} onValueChange={(value) => setFilters({...filters, provider: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base">Search Results ({searchResults.length})</Label>
            </div>
            
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {searchResults.map((patient) => (
                  <Card 
                    key={patient.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onSelectPatient(patient)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{patient.name}</span>
                            <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                              {patient.status}
                            </Badge>
                            {patient.activeCases > 0 && (
                              <Badge variant="outline">
                                {patient.activeCases} active case{patient.activeCases > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              ID: {patient.id}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              DOB: {patient.dob}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {patient.contactNumber}
                            </div>
                            {patient.lastVisit && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Last visit: {formatDate(patient.lastVisit)}
                              </div>
                            )}
                          </div>
                          
                          {patient.primaryProvider && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Primary Provider: {patient.primaryProvider}
                            </p>
                          )}
                        </div>
                        
                        <Button size="sm" variant="outline">
                          Select
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No patients found matching your search criteria</p>
            <p className="text-sm">Try adjusting your search terms or filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
