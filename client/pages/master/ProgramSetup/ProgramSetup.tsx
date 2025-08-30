import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { GraduationCap, Settings, Trash2, Edit3, Plus, Users, Clock, Award, BookOpen, Code, Calculator, Beaker, Building, Eye, Upload, Download, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import programService, { Program } from '@/services/programService';
import { FileReplacementInstructions } from '@/components/FileReplacementInstructions';

// Mock programs for demo purposes - these will be loaded from program.json
const mockPrograms: Program[] = [];

const departmentIcons: Record<string, any> = {
  'Computer Science': Code,
  'Management': Building,
  'Mechanical Engineering': Settings,
  'Electronics': Calculator,
  'Civil Engineering': Building,
  'Chemical Engineering': Beaker
};

export default function ProgramSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load programs from program.json on component mount
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setIsLoading(true);
        const loadedPrograms = await programService.getPrograms();
        setPrograms(loadedPrograms);
        console.log('📁 Loaded', loadedPrograms.length, 'programs from program.json');
      } catch (error) {
        console.error('Error loading programs:', error);
        toast.error('Failed to load programs');
        setPrograms(mockPrograms); // Fallback to mock data
      } finally {
        setIsLoading(false);
      }
    };

    loadPrograms();
  }, []);

  // Refresh data when returning from edit/add operations
  useEffect(() => {
    // Check if we're coming back from an edit or add operation
    if (location.state?.refreshPrograms) {
      console.log('🔄 Returning from edit/add operation, refreshing programs...');
      refreshPrograms();
      // Clear the state to prevent unnecessary refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Add function to refresh programs from file (like EntitySetup pattern)
  const refreshPrograms = async () => {
    try {
      const loadedPrograms = await programService.getPrograms();
      setPrograms(loadedPrograms);
      console.log('🔄 Refreshed', loadedPrograms.length, 'programs from program.json');
    } catch (error) {
      console.error('Error refreshing programs:', error);
      toast.error('Failed to refresh programs');
    }
  };

  // Add function to update a program in local state (like EntitySetup pattern)
  const updateProgramInState = (updatedProgram: Program) => {
    setPrograms(prev => prev.map(prog =>
      prog.id === updatedProgram.id ? updatedProgram : prog
    ));
  };

  const handleCreate = () => {
    navigate('/master/program-setup/add');
  };

  const handleEdit = (program: Program) => {
    navigate(`/master/program-setup/edit/${program.id}`);
  };

  // Refresh data when needed
  const handleRefresh = () => {
    refreshPrograms();
  };

  const handleView = (program: Program) => {
    navigate(`/master/program-setup/view/${program.id}`);
  };

  const handleDelete = async () => {
    if (selectedProgram) {
      try {
        await programService.deleteProgram(selectedProgram.id);
        // Update local state immediately (like EntitySetup pattern)
        setPrograms(prev => prev.filter(prog => prog.id !== selectedProgram.id));
        setSelectedProgram(null);
        setIsDeleteDialogOpen(false);
        toast.success('Program deleted successfully!');
      } catch (error) {
        console.error('Error deleting program:', error);
        toast.error('Failed to delete program');
      }
    }
  };

  const filteredPrograms = programs.filter(program => {
    if (activeTab === 'all') return true;
    return program.level.toLowerCase() === activeTab.toLowerCase();
  });

  // Pagination calculations
  const totalItems = filteredPrograms.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex);

  // Reset to first page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPage = (page: number) => setCurrentPage(page);

  const stats = {
    total: programs.length,
    active: programs.filter(p => p.status === 'active').length,
    students: programs.reduce((sum, p) => sum + p.totalStudents, 0),
    departments: new Set(programs.map(p => p.department)).size
  };

  // Import/Export Functions
  const handleExportExcel = () => {
    try {
      const exportData = programs.map(program => ({
        'Program Name': program.name,
        'Program Code': program.code,
        'Level': program.level,
        'Type': program.type,
        'Department': program.department,
        'Duration (Years)': program.duration,
        'Total Credits': program.totalCredits,
        'Total Students': program.totalStudents,
        'Description': program.description,
        'Status': program.status,
        'Specializations': program.specializations?.join(', ') || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Programs');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `programs_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Programs exported to Excel successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export programs to Excel');
    }
  };

  const handleExportJSON = async () => {
    try {
      const dataStr = await programService.exportProgramFileContent();
      const blob = new Blob([dataStr], { type: 'application/json' });
      saveAs(blob, `programs_export_${new Date().toISOString().split('T')[0]}.json`);

      toast.success('Programs exported to JSON successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export programs to JSON');
    }
  };

  const handleDownloadTemplate = () => {
    try {
      const templateData = [{
        'Program Name': 'Bachelor of Technology in Computer Science Engineering',
        'Program Code': 'B.Tech CSE',
        'Level': 'UG',
        'Type': 'Regular',
        'Department': 'Computer Science',
        'Duration (Years)': 4,
        'Total Credits': 160,
        'Total Students': 0,
        'Description': 'Comprehensive program covering software development, algorithms, and computer systems',
        'Status': 'active',
        'Specializations': 'Artificial Intelligence, Data Science, Cybersecurity'
      }];

      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Programs Template');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'programs_template.xlsx');
      
      toast.success('Template downloaded successfully!');
    } catch (error) {
      console.error('Template download error:', error);
      toast.error('Failed to download template');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        let importedPrograms: any[] = [];

        if (file.type === 'application/json') {
          const jsonContent = e.target?.result as string;
          const updatedPrograms = await programService.importProgramFileContent(jsonContent);
          setPrograms(updatedPrograms);
          toast.success(`Successfully imported programs from JSON file!`);
        } else {
          // Handle Excel files
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          importedPrograms = jsonData;

          // Transform imported data to match Program interface and save to JSON
          const transformedPrograms = importedPrograms.map((item: any) => ({
            name: item['Program Name'] || item.name || '',
            code: item['Program Code'] || item.code || '',
            level: (item['Level'] || item.level || 'UG') as Program['level'],
            type: (item['Type'] || item.type || 'Regular') as Program['type'],
            department: item['Department'] || item.department || '',
            duration: parseInt(String(item['Duration (Years)'] || item.duration || '4')),
            totalCredits: parseInt(String(item['Total Credits'] || item.totalCredits || '0')),
            totalStudents: parseInt(String(item['Total Students'] || item.totalStudents || '0')),
            description: item['Description'] || item.description || '',
            status: (item['Status'] || item.status || 'draft') as Program['status'],
            specializations: item['Specializations'] || item.specializations
              ? (typeof (item['Specializations'] || item.specializations) === 'string'
                  ? (item['Specializations'] || item.specializations).split(',').map((s: string) => s.trim())
                  : item['Specializations'] || item.specializations)
              : []
          })).filter(program => program.name && program.code);

          // Import via service which will handle JSON file writing
          const jsonContent = JSON.stringify(transformedPrograms, null, 2);
          const updatedPrograms = await programService.importProgramFileContent(jsonContent);
          setPrograms(updatedPrograms);
          toast.success(`Successfully imported ${transformedPrograms.length} programs from Excel file!`);
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to import programs. Please check the file format.');
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    if (file.type === 'application/json') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Program Setup</h1>
          <p className="page-subtitle">
            Define and manage academic programs (B.Tech, MBA, Diploma, etc.)
          </p>
        </div>
        <div className="flex gap-3">
          {/* Import/Export Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleDownloadTemplate}
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <FileText className="h-4 w-4 mr-2" />
              Template
            </Button>
            <Button 
              variant="outline" 
              onClick={triggerFileUpload}
              disabled={isImporting}
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import'}
            </Button>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                onClick={handleExportExcel}
                className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportJSON}
                className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              >
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
            <Plus className="h-4 w-4 mr-2" />
            Add Program
          </Button>
        </div>

        {/* File Replacement Instructions */}
        <FileReplacementInstructions
          fileName="program.json"
          show={showInstructions}
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.json"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card stat-card-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Programs</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Active Programs</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-600 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-info">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Students</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">{stats.students.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Departments</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">{stats.departments}</p>
            </div>
            <div className="p-3 bg-orange-600 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Program Types */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Programs</TabsTrigger>
          <TabsTrigger value="ug">Undergraduate</TabsTrigger>
          <TabsTrigger value="pg">Postgraduate</TabsTrigger>
          <TabsTrigger value="diploma">Diploma</TabsTrigger>
          <TabsTrigger value="certificate">Certificate</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6">
            {paginatedPrograms.map((program) => {
              const IconComponent = departmentIcons[program.department] || BookOpen;
              
              return (
                <div key={program.id} className="section-card hover:shadow-lg transition-all duration-300 group">
                  <div className="data-row">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            program.level === 'UG' ? 'bg-blue-100 text-blue-800' :
                            program.level === 'PG' ? 'bg-purple-100 text-purple-800' :
                            program.level === 'Diploma' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {program.level}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            program.type === 'Regular' ? 'bg-gray-100 text-gray-800' :
                            program.type === 'Distance' ? 'bg-indigo-100 text-indigo-800' :
                            program.type === 'Part-time' ? 'bg-yellow-100 text-yellow-800' :
                            program.type === 'Full-time' ? 'bg-green-100 text-green-800' :
                            'bg-cyan-100 text-cyan-800'
                          }`}>
                            {program.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            program.status === 'active' ? 'status-active' : 'status-inactive'
                          }`}>
                            {program.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="font-medium text-blue-600">{program.code}</span>
                          <span>•</span>
                          <span>{program.department}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {program.duration} years
                          </span>
                          <span>•</span>
                          <span>{program.totalCredits} credits</span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {program.description}
                        </p>

                        {program.specializations && program.specializations.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {program.specializations.map((spec, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-gray-900">{program.totalStudents}</span>
                          <span className="text-sm text-gray-600">students</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="inline-flex items-center p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleView(program)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="btn-secondary p-2"
                        onClick={() => handleEdit(program)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        className="inline-flex items-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedProgram(program);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} programs
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-2"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNumber)}
                        className="w-10 h-8"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-2"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the program
              "{selectedProgram?.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Program
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
