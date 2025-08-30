import { useState } from "react";
import { useFormHandler } from "@/hooks/useFormHandlers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CalendarDays,
  GraduationCap,
  Settings,
  Trash2,
  Edit3,
  Plus,
  Users,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { FormField } from "@/components/forms/FormField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "upcoming" | "completed";
  totalStudents: number;
  totalPrograms: number;
  totalSemesters: number;
  description?: string;
}

const mockAcademicYears: AcademicYear[] = [
  {
    id: "1",
    name: "2024-2025",
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    status: "active",
    totalStudents: 2850,
    totalPrograms: 15,
    totalSemesters: 8,
    description: "Current academic year with new curriculum updates",
  },
  {
    id: "2",
    name: "2025-2026",
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    status: "upcoming",
    totalStudents: 0,
    totalPrograms: 16,
    totalSemesters: 8,
    description: "Upcoming academic year with enhanced program offerings",
  },
  {
    id: "3",
    name: "2023-2024",
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    status: "completed",
    totalStudents: 2650,
    totalPrograms: 14,
    totalSemesters: 8,
    description: "Previous academic year - completed successfully",
  },
];

type ViewType = 'list' | 'add' | 'edit' | 'view';

export default function AcademicYearSetup() {
  const [academicYears, setAcademicYears] =
    useState<AcademicYear[]>(mockAcademicYears);
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const formHandler = useFormHandler(
    [
      "name",
      "startDate",
      "endDate",
      "description",
      "totalPrograms",
      "totalSemesters",
    ],
    {
      name: "",
      startDate: "",
      endDate: "",
      description: "",
      totalPrograms: "",
      totalSemesters: "",
    },
  );

  const { formState, updateField, resetForm, submitForm, isSubmitting } =
    formHandler;

  const formData = Object.keys(formState).reduce(
    (acc, key) => {
      acc[key] = formState[key].value;
      return acc;
    },
    {} as Record<string, any>,
  );

  const errors = Object.keys(formState).reduce(
    (acc, key) => {
      acc[key] = formState[key].error;
      return acc;
    },
    {} as Record<string, any>,
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    updateField(e.target.name, e.target.value);
  };

  const handleSubmit =
    (onSubmit: (data: any) => Promise<void>) => (e: React.FormEvent) => {
      e.preventDefault();
      submitForm(onSubmit);
    };

  const onSubmit = async (data: any) => {
    if (selectedYear && currentView === 'edit') {
      // Edit existing year
      const updatedYear: AcademicYear = {
        ...selectedYear,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        totalPrograms: parseInt(data.totalPrograms) || 0,
        totalSemesters: parseInt(data.totalSemesters) || 0,
        description: data.description,
      };

      setAcademicYears((prev) =>
        prev.map((year) => (year.id === selectedYear.id ? updatedYear : year)),
      );
      setCurrentView('list');
      setSelectedYear(null);
    } else {
      // Create new year
      const newYear: AcademicYear = {
        id: Date.now().toString(),
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        status: "upcoming",
        totalStudents: 0,
        totalPrograms: parseInt(data.totalPrograms) || 0,
        totalSemesters: parseInt(data.totalSemesters) || 0,
        description: data.description,
      };

      setAcademicYears((prev) => [newYear, ...prev]);
      setCurrentView('list');
    }
    resetForm();
  };

  const handleEdit = (year: AcademicYear) => {
    setSelectedYear(year);
    updateField("name", year.name);
    updateField("startDate", year.startDate);
    updateField("endDate", year.endDate);
    updateField("totalPrograms", year.totalPrograms.toString());
    updateField("totalSemesters", year.totalSemesters.toString());
    updateField("description", year.description || "");
    setCurrentView('edit');
  };

  const handleDelete = () => {
    if (selectedYear) {
      setAcademicYears((prev) =>
        prev.filter((year) => year.id !== selectedYear.id),
      );
      setSelectedYear(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleView = (year: AcademicYear) => {
    setSelectedYear(year);
    setCurrentView('view');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedYear(null);
    resetForm();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCurrentProgress = () => {
    const activeYear = academicYears.find((year) => year.status === "active");
    if (!activeYear) return 0;

    const startDate = new Date(activeYear.startDate);
    const endDate = new Date(activeYear.endDate);
    const currentDate = new Date();

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = currentDate.getTime() - startDate.getTime();

    return Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
  };

  const renderAddView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBackToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Academic Years
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Create New Academic Year
          </CardTitle>
          <CardDescription>
            Set up a new academic year with duration and configuration details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Academic Year Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="e.g., 2024-2025"
                required
              />
              <FormField
                label="Total Programs"
                name="totalPrograms"
                type="number"
                value={formData.totalPrograms}
                onChange={handleInputChange}
                error={errors.totalPrograms}
                placeholder="15"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                error={errors.startDate}
                required
              />
              <FormField
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                error={errors.endDate}
                required
              />
            </div>
            <FormField
              label="Total Semesters"
              name="totalSemesters"
              type="number"
              value={formData.totalSemesters}
              onChange={handleInputChange}
              error={errors.totalSemesters}
              placeholder="8"
              required
            />
            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              error={errors.description}
              placeholder="Brief description of the academic year..."
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToList}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Academic Year"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderEditView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBackToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Academic Years
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Edit Academic Year
          </CardTitle>
          <CardDescription>
            Update academic year information and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Academic Year Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="e.g., 2024-2025"
                required
              />
              <FormField
                label="Total Programs"
                name="totalPrograms"
                type="number"
                value={formData.totalPrograms}
                onChange={handleInputChange}
                error={errors.totalPrograms}
                placeholder="15"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                error={errors.startDate}
                required
              />
              <FormField
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                error={errors.endDate}
                required
              />
            </div>
            <FormField
              label="Total Semesters"
              name="totalSemesters"
              type="number"
              value={formData.totalSemesters}
              onChange={handleInputChange}
              error={errors.totalSemesters}
              placeholder="8"
              required
            />
            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              error={errors.description}
              placeholder="Brief description of the academic year..."
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToList}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Academic Year"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderViewView = () => {
    if (!selectedYear) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Academic Years
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {selectedYear.name} Academic Year
            </CardTitle>
            <CardDescription>
              Academic year details and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Status
                </Label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={getStatusColor(selectedYear.status)}
                  >
                    {selectedYear.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Duration
                </Label>
                <p className="text-sm mt-1">
                  {selectedYear.startDate} to {selectedYear.endDate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Total Students
                </Label>
                <p className="text-lg font-semibold mt-1">
                  {selectedYear.totalStudents.toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Programs
                </Label>
                <p className="text-lg font-semibold mt-1">
                  {selectedYear.totalPrograms}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Semesters
                </Label>
                <p className="text-lg font-semibold mt-1">
                  {selectedYear.totalSemesters}
                </p>
              </div>
            </div>

            {selectedYear.description && (
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Description
                </Label>
                <p className="text-sm mt-1">{selectedYear.description}</p>
              </div>
            )}

            {selectedYear.status === "active" && (
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Progress
                </Label>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Academic Year Progress</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(getCurrentProgress())}% Complete
                    </span>
                  </div>
                  <Progress value={getCurrentProgress()} className="h-2" />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleEdit(selectedYear)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Academic Year
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render different views based on currentView state
  if (currentView === 'add') {
    return renderAddView();
  }

  if (currentView === 'edit') {
    return renderEditView();
  }

  if (currentView === 'view') {
    return renderViewView();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Academic Year Setup
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure and manage academic year duration and settings
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          onClick={() => setCurrentView('add')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Academic Year
        </Button>
      </div>

      {/* Current Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calendar className="h-5 w-5" />
            Current Academic Year Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                Academic Year 2024-2025
              </span>
              <span className="text-sm text-blue-600">
                {Math.round(getCurrentProgress())}% Complete
              </span>
            </div>
            <Progress value={getCurrentProgress()} className="h-2" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/60 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-900">2,850</div>
                <div className="text-sm text-blue-600">Total Students</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-900">15</div>
                <div className="text-sm text-blue-600">Active Programs</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-900">8</div>
                <div className="text-sm text-blue-600">Semesters</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Years List */}
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Academic Years</h2>
          <div className="text-sm text-muted-foreground">
            {academicYears.length} academic years configured
          </div>
        </div>

        <div className="grid gap-4">
          {academicYears.map((year) => (
            <Card
              key={year.id}
              className="hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{year.name}</h3>
                        <Badge className={getStatusColor(year.status)}>
                          {year.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(year.startDate).toLocaleDateString()} -{" "}
                        {new Date(year.endDate).toLocaleDateString()}
                      </p>
                      {year.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {year.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-blue-600">
                          <Users className="h-4 w-4" />
                          <span className="font-semibold">
                            {year.totalStudents.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Students
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-green-600">
                          <BookOpen className="h-4 w-4" />
                          <span className="font-semibold">
                            {year.totalPrograms}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Programs
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-purple-600">
                          <Clock className="h-4 w-4" />
                          <span className="font-semibold">
                            {year.totalSemesters}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Semesters
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(year)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(year)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedYear(year);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>


      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              academic year "{selectedYear?.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Academic Year
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
