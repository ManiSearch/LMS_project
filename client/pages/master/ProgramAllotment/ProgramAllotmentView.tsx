import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  GraduationCap,
  Building2,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
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

const ProgramAllotmentView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [allotment, setAllotment] = useState<ProgramAllotment | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllotmentData = async () => {
      setLoading(true);
      
      // Sample data - updated to match polytechnic college data
      const samplePrograms: Program[] = [
        {
          id: "1010",
          name: "Diploma in Civil Engineering",
          code: "1010",
          level: "Diploma",
          department: "Civil Engineering",
          duration: 3,
          type: "Regular",
          status: "active",
        },
        {
          id: "1020",
          name: "Diploma in Mechanical Engineering",
          code: "1020",
          level: "Diploma",
          department: "Mechanical Engineering",
          duration: 3,
          type: "Regular",
          status: "active",
        },
        {
          id: "1021",
          name: "Diploma in Mechanical Engineering (Sandwich)",
          code: "1021",
          level: "Diploma",
          department: "Mechanical Engineering",
          duration: 3,
          type: "Regular",
          status: "active",
        },
        {
          id: "1022",
          name: "Diploma in Mechanical Engineering (Part-time)",
          code: "1022",
          level: "Diploma",
          department: "Mechanical Engineering",
          duration: 4,
          type: "Regular",
          status: "active",
        },
        {
          id: "1052",
          name: "Diploma in Computer Engineering",
          code: "1052",
          level: "Diploma",
          department: "Computer Engineering",
          duration: 3,
          type: "Regular",
          status: "active",
        },
      ];

      const sampleInstitutions: Institution[] = [
        {
          id: "POLY001",
          name: "Government Polytechnic College, Salem",
          code: "GPC-SLM",
          type: "Government",
          location: "Salem",
          district: "Salem",
          establishedYear: 1965,
          status: "active",
        },
        {
          id: "POLY002",
          name: "Government Polytechnic College, Coimbatore",
          code: "GPC-CBE",
          type: "Government",
          location: "Coimbatore",
          district: "Coimbatore",
          establishedYear: 1958,
          status: "active",
        },
        {
          id: "POLY003",
          name: "Central Polytechnic College, Chennai",
          code: "CPC-CHN",
          type: "Government",
          location: "Chennai",
          district: "Chennai",
          establishedYear: 1949,
          status: "active",
        },
        {
          id: "POLY004",
          name: "Government Polytechnic College, Nagercoil",
          code: "GPC-NCL",
          type: "Government",
          location: "Nagercoil",
          district: "Kanyakumari",
          establishedYear: 1972,
          status: "active",
        },
        {
          id: "101",
          name: "Central Polytechnic College",
          code: "101",
          type: "Government",
          location: "Central Region",
          district: "Central",
          establishedYear: 1950,
          status: "active",
        },
      ];

      const sampleAllotments: ProgramAllotment[] = [
        {
          id: "allot-1",
          programId: "1010",
          institutionId: "101",
          academicYear: "2024-25",
          intake: 120,
          sanctionedDate: "2024-06-15",
          validFrom: "2024-07-01",
          validTo: "2025-06-30",
          status: "active",
          remarks: "Full-time Diploma in Civil Engineering at Central Polytechnic College",
        },
        {
          id: "allot-2",
          programId: "1020",
          institutionId: "101",
          academicYear: "2024-25",
          intake: 90,
          sanctionedDate: "2024-05-20",
          validFrom: "2024-07-01",
          validTo: "2025-06-30",
          status: "active",
          remarks: "Regular shifts Diploma in Mechanical Engineering at Central Polytechnic College",
        },
        {
          id: "allot-3",
          programId: "1021",
          institutionId: "101",
          academicYear: "2024-25",
          intake: 60,
          sanctionedDate: "2024-04-10",
          validFrom: "2024-07-01",
          validTo: "2025-06-30",
          status: "active",
          remarks: "Sandwich mode Diploma in Mechanical Engineering at Central Polytechnic College",
        },
        {
          id: "allot-4",
          programId: "1022",
          institutionId: "101",
          academicYear: "2024-25",
          intake: 80,
          sanctionedDate: "2024-07-10",
          validFrom: "2024-08-01",
          validTo: "2025-07-31",
          status: "active",
          remarks: "Diploma in Mechanical Engineering (Part-time) at Central Polytechnic College",
        },
        {
          id: "allot-5",
          programId: "1052",
          institutionId: "101",
          academicYear: "2024-25",
          intake: 100,
          sanctionedDate: "2024-08-01",
          validFrom: "2024-08-15",
          validTo: "2025-08-15",
          status: "active",
          remarks: "Diploma in Computer Engineering-1052 at Central Polytechnic College 101",
        },
      ];

      const currentAllotment = sampleAllotments.find(a => a.id === id);
      if (currentAllotment) {
        setAllotment(currentAllotment);
        setProgram(samplePrograms.find(p => p.id === currentAllotment.programId) || null);
        setInstitution(sampleInstitutions.find(i => i.id === currentAllotment.institutionId) || null);
      }
      
      setLoading(false);
    };

    if (id) {
      loadAllotmentData();
    }
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!allotment || !program || !institution) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Allotment not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The program allotment you're looking for doesn't exist.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate("/master/program-allotment")}>
              Back to Program Allotment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/master/program-allotment")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Program Allotment
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Program Allotment Details</h1>
            <p className="text-gray-600 mt-1">
              View complete information about this program allotment
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(allotment.status)} flex items-center gap-1 px-3 py-1`}>
            {getStatusIcon(allotment.status)}
            {allotment.status.charAt(0).toUpperCase() + allotment.status.slice(1)}
          </Badge>
          <Button
            onClick={() => navigate(`/master/program-allotment/edit/${allotment.id}`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Allotment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Program Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Program Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                  <p className="text-gray-600">{program.code}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Level:</span>
                      <Badge variant="outline">{program.level}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Department:</span>
                      <span className="text-gray-600">{program.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Duration:</span>
                      <span className="text-gray-600">{program.duration} years</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Type:</span>
                      <span className="text-gray-600">{program.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Institution Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Institution Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{institution.name}</h3>
                <p className="text-gray-600">{institution.code}</p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Type:</span>
                      <Badge variant="outline">{institution.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{institution.location}, {institution.district}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Established:</span>
                      <span className="text-gray-600">{institution.establishedYear}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Allotment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Allotment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Academic Year</span>
                  </div>
                  <p className="text-lg font-semibold text-blue-800">{allotment.academicYear}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Intake Capacity</span>
                  </div>
                  <p className="text-lg font-semibold text-green-800">{allotment.intake} students</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Status</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(allotment.status)}
                    <span className="text-sm font-semibold text-purple-800 capitalize">{allotment.status}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Sanctioned Date</span>
                  <p className="text-gray-900">{new Date(allotment.sanctionedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Valid From</span>
                  <p className="text-gray-900">{new Date(allotment.validFrom).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Valid To</span>
                  <p className="text-gray-900">{new Date(allotment.validTo).toLocaleDateString()}</p>
                </div>
              </div>

              {allotment.remarks && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Remarks</span>
                    <p className="mt-1 text-gray-900 text-sm leading-relaxed">{allotment.remarks}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate(`/master/program-allotment/edit/${allotment.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Allotment
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate("/master/program-setup")}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                View Program Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate("/master/entity-setup")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                View Institution Details
              </Button>
            </CardContent>
          </Card>

          {/* Validity Status */}
          <Card>
            <CardHeader>
              <CardTitle>Validity Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status</span>
                <Badge className={getStatusColor(allotment.status)}>
                  {allotment.status.charAt(0).toUpperCase() + allotment.status.slice(1)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valid From</span>
                  <span className="font-medium">{new Date(allotment.validFrom).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valid To</span>
                  <span className="font-medium">{new Date(allotment.validTo).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Days Remaining</span>
                  <span className="font-medium text-blue-600">
                    {Math.ceil((new Date(allotment.validTo).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{allotment.intake}</div>
                <div className="text-sm text-blue-800">Total Intake</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-lg font-semibold text-green-600">{program.duration}</div>
                  <div className="text-xs text-green-800">Years</div>
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <div className="text-lg font-semibold text-purple-600">{institution.establishedYear}</div>
                  <div className="text-xs text-purple-800">Est.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgramAllotmentView;
