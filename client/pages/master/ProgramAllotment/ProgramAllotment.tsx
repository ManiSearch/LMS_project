import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  Upload,
  Users,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
} from "lucide-react";

interface Program {
  id: string;
  name: string;
  code: string;
  level: 'UG' | 'PG' | 'Diploma' | 'Certificate';
  department: string;
  duration: number;
  type: 'Regular' | 'Self-Finance' | 'Distance';
  status: 'active' | 'inactive';
}

interface Institution {
  id: string;
  name: string;
  code: string;
  type: 'Government' | 'Aided' | 'Self-Finance' | 'Autonomous';
  location: string;
  district: string;
  establishedYear: number;
  status: 'active' | 'inactive';
}

interface ProgramAllotment {
  id: string;
  programId: string;
  institutionId: string;
  academicYear: string;
  intake: number;
  sanctionedDate: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'pending' | 'suspended' | 'expired';
  remarks?: string;
}

const ProgramAllotment: React.FC = () => {
  const navigate = useNavigate();
  const [allotments, setAllotments] = useState<ProgramAllotment[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load data from JSON files
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Starting to load data from JSON files...');
      setIsLoading(true);
      setLoadingError(null);

      try {
        // Helper function to fetch with retry
        const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
          for (let i = 0; i < retries; i++) {
            try {
              console.log(`📡 Attempting to fetch ${url} (attempt ${i + 1}/${retries})`);
              const response = await fetch(url, {
                cache: 'no-cache',
                headers: {
                  'Content-Type': 'application/json',
                }
              });

              if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }

              console.log(`✅ Successfully fetched ${url}`);
              return response;
            } catch (error) {
              console.warn(`⚠️ Fetch attempt ${i + 1} failed for ${url}:`, error);

              if (i === retries - 1) {
                throw error;
              }

              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
          }
          throw new Error('All fetch attempts failed');
        };

        // Load entities from entity.json
        const entitiesResponse = await fetchWithRetry('/entity.json');
        const entitiesData = await entitiesResponse.json();
        console.log('📊 Entities data loaded:', entitiesData?.length || 0, 'items');

        // Load programs from program.json
        const programsResponse = await fetchWithRetry('/program.json');
        const programsData = await programsResponse.json();
        console.log('📊 Programs data loaded:', programsData?.length || 0, 'items');

        // Transform entities data from JSON to Institution format
        const transformedInstitutions: Institution[] = entitiesData.map((entity: any) => ({
          id: entity.id.toString(),
          name: entity.name,
          code: entity.code,
          type: entity.type === 'polytechnic' ? 'Government' as const : 'Autonomous' as const,
          location: entity.city,
          district: entity.district,
          establishedYear: entity.established_year,
          status: entity.status === 'active' ? 'active' as const : 'inactive' as const
        }));

        // Transform programs data from JSON to Program format
        const transformedPrograms: Program[] = programsData.map((program: any) => ({
          id: program.code,
          name: program.name,
          code: program.code,
          level: program.level === 'UG' ? 'Diploma' as const : 'PG' as const,
          department: program.department,
          duration: program.duration,
          type: program.type === 'Full-time' ? 'Regular' as const : 'Self-Finance' as const,
          status: program.status === 'active' ? 'active' as const : 'inactive' as const
        }));

        console.log('Programs available from program.json for allotment:', transformedPrograms.map(p => `${p.name} (${p.code})`));

        // Create program allotments using exactly 3 institutions and 2 programs from JSON files
        const allAllotments: ProgramAllotment[] = [
          // Central Polytechnic College (101) allotments
          {
            id: "allot-1",
            programId: "1052",
            institutionId: "101",
            academicYear: "2024-25",
            intake: 100,
            sanctionedDate: "2024-07-01",
            validFrom: "2024-08-01",
            validTo: "2025-07-31",
            status: "active",
            remarks: "Computer Engineering (Full Time) allotted to Central Polytechnic College",
          },
          {
            id: "allot-2",
            programId: "1040",
            institutionId: "101",
            academicYear: "2024-25",
            intake: 120,
            sanctionedDate: "2024-07-01",
            validFrom: "2024-08-01",
            validTo: "2025-07-31",
            status: "active",
            remarks: "Electronics and Communication Engineering (Full Time) allotted to Central Polytechnic College",
          },

          // Sakthi Polytechnic College (215) allotments
          {
            id: "allot-3",
            programId: "1052",
            institutionId: "215",
            academicYear: "2024-25",
            intake: 60,
            sanctionedDate: "2024-07-15",
            validFrom: "2024-08-15",
            validTo: "2025-08-14",
            status: "active",
            remarks: "Computer Engineering (Full Time) allotted to Sakthi Polytechnic College",
          },
          {
            id: "allot-4",
            programId: "1040",
            institutionId: "215",
            academicYear: "2024-25",
            intake: 90,
            sanctionedDate: "2024-07-15",
            validFrom: "2024-08-15",
            validTo: "2025-08-14",
            status: "active",
            remarks: "Electronics and Communication Engineering (Full Time) allotted to Sakthi Polytechnic College",
          },

          // Kongu Polytechnic College (320, code: 132) allotments
          {
            id: "allot-5",
            programId: "1052",
            institutionId: "320",
            academicYear: "2024-25",
            intake: 80,
            sanctionedDate: "2024-08-01",
            validFrom: "2024-09-01",
            validTo: "2025-08-31",
            status: "active",
            remarks: "Computer Engineering (Full Time) allotted to Kongu Polytechnic College",
          },
          {
            id: "allot-6",
            programId: "1040",
            institutionId: "320",
            academicYear: "2024-25",
            intake: 100,
            sanctionedDate: "2024-08-01",
            validFrom: "2024-09-01",
            validTo: "2025-08-31",
            status: "active",
            remarks: "Electronics and Communication Engineering (Full Time) allotted to Kongu Polytechnic College",
          }
        ];

        setPrograms(transformedPrograms);
        setInstitutions(transformedInstitutions);
        setAllotments(allAllotments);
        setIsLoading(false);

        console.log(`✅ Data loading complete: ${transformedInstitutions.length} institutions, ${transformedPrograms.length} programs, and ${allAllotments.length} allotments`);
      } catch (error) {
        console.error('❌ Error loading data from JSON files:', error);

        // Set error state
        const errorMessage = error instanceof Error ? error.message : 'Network error';
        setLoadingError(errorMessage);

        // Show user-friendly error message
        toast.error(`Failed to load data: ${errorMessage}. Using fallback data.`);

        // Fallback to hardcoded data if JSON loading fails
        console.log('🔄 Falling back to hardcoded data...');
        const fallbackInstitutions: Institution[] = [
          {
            id: "101",
            name: "Central Polytechnic College",
            code: "101",
            type: "Government",
            location: "Chennai",
            district: "Chennai",
            establishedYear: 1916,
            status: "active"
          },
          {
            id: "215",
            name: "Sakthi Polytechnic College",
            code: "215",
            type: "Government",
            location: "Chennai",
            district: "Sakthi Nagar",
            establishedYear: 2025,
            status: "active"
          },
          {
            id: "320",
            name: "Kongu Polytechnic College",
            code: "132",
            type: "Government",
            location: "Chennai",
            district: "Perundurai",
            establishedYear: 2025,
            status: "active"
          }
        ];

        const fallbackPrograms: Program[] = [
          {
            id: "1052",
            name: "Computer Engineering (Full Time)",
            code: "1052",
            level: "UG",
            department: "Computer Science",
            duration: 4,
            type: "Regular",
            status: "active"
          },
          {
            id: "1040",
            name: "Electronics and Communication Engineering (Full Time)",
            code: "1040",
            level: "UG",
            department: "Electronics Engineering",
            duration: 4,
            type: "Regular",
            status: "active"
          }
        ];

        const fallbackAllotments: ProgramAllotment[] = [
          // Central Polytechnic College (101) - fallback
          {
            id: "allot-1",
            programId: "1052",
            institutionId: "101",
            academicYear: "2024-25",
            intake: 100,
            sanctionedDate: "2024-07-01",
            validFrom: "2024-08-01",
            validTo: "2025-07-31",
            status: "active",
            remarks: "Computer Engineering (Full Time) allotted to Central Polytechnic College (fallback)",
          },
          {
            id: "allot-2",
            programId: "1040",
            institutionId: "101",
            academicYear: "2024-25",
            intake: 120,
            sanctionedDate: "2024-07-01",
            validFrom: "2024-08-01",
            validTo: "2025-07-31",
            status: "active",
            remarks: "Electronics and Communication Engineering (Full Time) allotted to Central Polytechnic College (fallback)",
          },

          // Sakthi Polytechnic College (215) - fallback
          {
            id: "allot-3",
            programId: "1052",
            institutionId: "215",
            academicYear: "2024-25",
            intake: 60,
            sanctionedDate: "2024-07-15",
            validFrom: "2024-08-15",
            validTo: "2025-08-14",
            status: "active",
            remarks: "Computer Engineering (Full Time) allotted to Sakthi Polytechnic College (fallback)",
          },
          {
            id: "allot-4",
            programId: "1040",
            institutionId: "215",
            academicYear: "2024-25",
            intake: 90,
            sanctionedDate: "2024-07-15",
            validFrom: "2024-08-15",
            validTo: "2025-08-14",
            status: "active",
            remarks: "Electronics and Communication Engineering (Full Time) allotted to Sakthi Polytechnic College (fallback)",
          },

          // Kongu Polytechnic College (320) - fallback
          {
            id: "allot-5",
            programId: "1052",
            institutionId: "320",
            academicYear: "2024-25",
            intake: 80,
            sanctionedDate: "2024-08-01",
            validFrom: "2024-09-01",
            validTo: "2025-08-31",
            status: "active",
            remarks: "Computer Engineering (Full Time) allotted to Kongu Polytechnic College (fallback)",
          },
          {
            id: "allot-6",
            programId: "1040",
            institutionId: "320",
            academicYear: "2024-25",
            intake: 100,
            sanctionedDate: "2024-08-01",
            validFrom: "2024-09-01",
            validTo: "2025-08-31",
            status: "active",
            remarks: "Electronics and Communication Engineering (Full Time) allotted to Kongu Polytechnic College (fallback)",
          }
        ];

        setPrograms(fallbackPrograms);
        setInstitutions(fallbackInstitutions);
        setAllotments(fallbackAllotments);
        setIsLoading(false);

        console.log(`✅ Fallback data loaded: ${fallbackInstitutions.length} institutions, ${fallbackPrograms.length} programs, and ${fallbackAllotments.length} allotments`);
      }
    };

    loadData();
  }, []);

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    if (program) {
      return `${program.name} (${program.code})`;
    }

    const availablePrograms = programs.filter(p => p.status === 'active').slice(0, 2);
    const programList = availablePrograms.map(p => `${p.name} (${p.code})`).join(', ');
    return `${programList}`;
  };

  const getInstitutionName = (institutionId: string) => {
    const institution = institutions.find(i => i.id === institutionId);
    if (institution) {
      return `${institution.name} (${institution.code})`;
    }

    // When institution is unknown, show reference to available institutions
    const availableInstitutions = institutions.filter(i => i.status === 'active').slice(0, 2);
    const institutionList = availableInstitutions.map(i => `${i.name} (${i.code})`).join(', ');
    return `Institution from entity.json to allot: ${institutionList}`;
  };

  const handleViewAllotment = (id: string) => {
    navigate(`/master/program-allotment/view/${id}`);
  };

  const handleEditAllotment = (id: string) => {
    navigate(`/master/program-allotment/edit/${id}`);
  };

  const handleDeleteAllotment = (id: string) => {
    setAllotments(allotments.filter(a => a.id !== id));
    toast.success("Program allotment deleted successfully");
  };

  const filteredAllotments = allotments.filter(allotment => {
    const programName = getProgramName(allotment.programId).toLowerCase();
    const institutionName = getInstitutionName(allotment.institutionId).toLowerCase();
    const matchesSearch = programName.includes(searchTerm.toLowerCase()) ||
                         institutionName.includes(searchTerm.toLowerCase()) ||
                         allotment.academicYear.includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || allotment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAllotments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAllotments = filteredAllotments.slice(startIndex, endIndex);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'suspended': return <AlertCircle className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Program Allotments</h3>
            <p className="text-gray-600">Fetching data from program.json and entity.json...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Show error message if there was a loading error */}
      {loadingError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Data Loading Issue</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Failed to load from JSON files: {loadingError}. Currently showing fallback data.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Program Allotment</h1>
          <p className="text-gray-600 mt-1">
            Manage program allocations to institutions and colleges
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/master/program-allotment/create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Allotment
          </Button>
        </div>
      </div>

      {/* Available Programs Info */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <GraduationCap className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900">Programs Available for Allotment</h3>
              <p className="text-sm text-blue-700 mt-1">
                {programs.filter(p => p.status === 'active').map(p => `${p.name} (${p.code})`).join(', ') || 'Loading programs...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Allotments</p>
                <p className="text-2xl font-bold text-gray-900">{allotments.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-green-600">
                  {allotments.filter(a => a.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {allotments.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Intake</p>
                <p className="text-2xl font-bold text-purple-600">
                  {allotments.reduce((sum, a) => sum + a.intake, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Program Allotments</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search programs, institutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Intake</TableHead>
                <TableHead>Validity Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAllotments.map((allotment) => (
                <TableRow key={allotment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{getProgramName(allotment.programId).split('(')[0].trim()}</p>
                      <p className="text-sm text-gray-500">{getProgramName(allotment.programId).split('(')[1]?.replace(')', '')}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{getInstitutionName(allotment.institutionId).split('(')[0].trim()}</p>
                      <p className="text-sm text-gray-500">{getInstitutionName(allotment.institutionId).split('(')[1]?.replace(')', '')}</p>
                    </div>
                  </TableCell>
                  <TableCell>{allotment.academicYear}</TableCell>
                  <TableCell>
                    <span className="font-medium">{allotment.intake}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(allotment.validFrom).toLocaleDateString()}</p>
                      <p className="text-gray-500">to {new Date(allotment.validTo).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(allotment.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(allotment.status)}
                      {allotment.status.charAt(0).toUpperCase() + allotment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAllotment(allotment.id)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAllotment(allotment.id)}
                        title="Edit Allotment"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" title="Delete Allotment">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Program Allotment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this program allotment? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAllotment(allotment.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {filteredAllotments.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredAllotments.length)} of {filteredAllotments.length} results
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Rows per page:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNumber > totalPages) return null;

                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="w-10"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}

          {filteredAllotments.length === 0 && (
            <div className="text-center py-8">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No allotments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new program allotment using programs from program.json.
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Available programs: {programs.filter(p => p.status === 'active').map(p => p.name).join(', ')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramAllotment;
