import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { GraduationCap, ArrowLeft, Edit3, Users, Clock, Award, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import programService, { Program } from '@/services/programService';


export default function ProgramView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load program data from program.json
    const loadProgram = async () => {
      try {
        const foundProgram = await programService.getProgramById(id!);

        if (foundProgram) {
          setProgram(foundProgram);
        } else {
          toast.error('Program not found');
          navigate('/master/program-setup');
        }
      } catch (error) {
        console.error('Error loading program:', error);
        toast.error('Failed to load program');
        navigate('/master/program-setup');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProgram();
    } else {
      navigate('/master/program-setup');
    }
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/master/program-setup');
  };

  const handleEdit = () => {
    navigate(`/master/program-setup/edit/${id}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'UG':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PG':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Diploma':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Certificate':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Regular':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Distance':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Part-time':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Full-time':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Online':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading program...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="page-title flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              {program.name}
            </h1>
            <p className="page-subtitle">
              Program Code: {program.code}
            </p>
          </div>
        </div>
        <Button onClick={handleEdit} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Program
        </Button>
      </div>

      {/* Program Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card stat-card-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Level</p>
              <p className="text-lg font-bold text-blue-900 mt-1">{program.level}</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-card-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Status</p>
              <p className="text-lg font-bold text-green-900 mt-1 capitalize">{program.status}</p>
            </div>
            <div className="p-3 bg-green-600 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-card-info">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Students</p>
              <p className="text-lg font-bold text-purple-900 mt-1">{program.totalStudents.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-card-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Duration</p>
              <p className="text-lg font-bold text-orange-900 mt-1">{program.duration} Years</p>
            </div>
            <div className="p-3 bg-orange-600 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Program Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="section-card">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
            <Building className="h-5 w-5" />
            Basic Information
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Program Name</Label>
                <p className="text-sm font-medium mt-1">{program.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Program Code</Label>
                <p className="text-sm font-medium mt-1">{program.code}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Level</Label>
                <div className="mt-1">
                  <Badge variant="outline" className={getLevelColor(program.level)}>
                    {program.level}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Type</Label>
                <div className="mt-1">
                  <Badge variant="outline" className={getTypeColor(program.type)}>
                    {program.type}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <div className="mt-1">
                  <Badge variant="outline" className={getStatusColor(program.status)}>
                    {program.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Department</Label>
              <p className="text-sm font-medium mt-1">{program.department}</p>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="section-card">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Academic Details
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Duration</Label>
                <p className="text-sm font-medium mt-1">{program.duration} years</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Total Credits</Label>
                <p className="text-sm font-semibold mt-1">{program.totalCredits}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Total Students</Label>
              <p className="text-sm font-semibold mt-1">{program.totalStudents.toLocaleString()}</p>
            </div>

            {program.specializations && program.specializations.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-500">Specializations</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {program.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Program Description */}
      <div className="section-card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Program Description</h3>
        <p className="text-gray-700 leading-relaxed">{program.description}</p>
      </div>
    </div>
  );
}
