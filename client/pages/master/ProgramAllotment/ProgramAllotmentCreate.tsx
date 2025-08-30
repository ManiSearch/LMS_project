import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/ui/searchable-select";
import {
  ArrowLeft,
  Save,
  Building2,
  GraduationCap,
  Calendar,
  Users,
} from "lucide-react";

interface Program {
  id: string;
  name: string;
  code: string;
  level: "UG" | "PG" | "Diploma" | "Certificate";
  type: "Regular" | "Self-Finance" | "Distance";
  department: string;
  duration: number;
  totalCredits: number;
  description: string;
  status: "active" | "inactive" | "draft";
  specializations: string[];
}

interface Institution {
  id: string | number;
  name: string;
  code: string;
  type:
    | "university"
    | "college"
    | "Government"
    | "Aided"
    | "Self-Finance"
    | "Autonomous";
  address_line1: string;
  district: string;
  city?: string;
  state?: string;
  pincode: string;
  established_year?: number;
  status: "active" | "inactive";
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
  status: "active" | "pending" | "suspended" | "expired";
  remarks?: string;
}

const ProgramAllotmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [programsError, setProgramsError] = useState<string | null>(null);
  const [institutionsError, setInstitutionsError] = useState<string | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<ProgramAllotment>>({
    programId: "",
    institutionId: "",
    academicYear: "",
    intake: 0,
    sanctionedDate: "",
    validFrom: "",
    validTo: "",
    status: "pending",
    remarks: "",
  });

  console.log(programs);

  // Load data from JSON files
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoadingPrograms(true);
        setProgramsError(null);
        const response = await fetch("/program.json");
        if (!response.ok)
          throw new Error(`HTTP ${response.status}: Failed to fetch programs`);
        const data = await response.json();
        // Ensure data is an array and filter only active programs
        if (Array.isArray(data)) {
          const activePrograms = data.filter(
            (program: Program) => program.status === "active",
          );
          setPrograms(activePrograms);
        } else {
          throw new Error("Invalid data format: Expected array of programs");
        }
      } catch (error) {
        console.error("Error loading programs:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load programs";
        setProgramsError(errorMessage);
        toast.error("Failed to load programs. Using fallback data.");
        // Set fallback data
        setPrograms([]);
      } finally {
        setLoadingPrograms(false);
      }
    };

    const loadInstitutions = async () => {
      try {
        setLoadingInstitutions(true);
        setInstitutionsError(null);
        const response = await fetch("/entity.json");
        if (!response.ok)
          throw new Error(
            `HTTP ${response.status}: Failed to fetch institutions`,
          );
        const data = await response.json();
        // Ensure data is an array and filter only active institutions
        if (Array.isArray(data)) {
          const activeInstitutions = data.filter(
            (institution: Institution) => institution.status === "active",
          );
          setInstitutions(activeInstitutions);
        } else {
          throw new Error(
            "Invalid data format: Expected array of institutions",
          );
        }
      } catch (error) {
        console.error("Error loading institutions:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load institutions";
        setInstitutionsError(errorMessage);
        toast.error("Failed to load institutions. Using fallback data.");
        // Set fallback data
        setInstitutions([]);
      } finally {
        setLoadingInstitutions(false);
      }
    };

    loadPrograms();
    loadInstitutions();
  }, []);

  const handleInputChange = (field: keyof ProgramAllotment, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.programId) {
      toast.error("Please select a program");
      return false;
    }
    if (!formData.institutionId) {
      toast.error("Please select an institution");
      return false;
    }
    if (!formData.academicYear) {
      toast.error("Please enter academic year");
      return false;
    }
    if (!formData.intake || formData.intake <= 0) {
      toast.error("Please enter valid intake capacity");
      return false;
    }
    if (!formData.sanctionedDate) {
      toast.error("Please select sanctioned date");
      return false;
    }
    if (!formData.validFrom) {
      toast.error("Please select valid from date");
      return false;
    }
    if (!formData.validTo) {
      toast.error("Please select valid to date");
      return false;
    }
    if (new Date(formData.validFrom) >= new Date(formData.validTo)) {
      toast.error("Valid to date must be after valid from date");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newAllotment: ProgramAllotment = {
        id: `allot-${Date.now()}`,
        programId: formData.programId!,
        institutionId: formData.institutionId!,
        academicYear: formData.academicYear!,
        intake: formData.intake!,
        sanctionedDate: formData.sanctionedDate!,
        validFrom: formData.validFrom!,
        validTo: formData.validTo!,
        status: formData.status as
          | "active"
          | "pending"
          | "suspended"
          | "expired",
        remarks: formData.remarks || "",
      };

      toast.success("Program allotment created successfully");
      navigate("/master/program-allotment");
    } catch (error) {
      toast.error("Failed to create program allotment");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedProgram = programs.find((p) => p.id === formData.programId);
  const selectedInstitution = institutions.find(
    (i) => i.id === formData.institutionId,
  );

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
            <h1 className="text-3xl font-bold text-gray-900">
              Create Program Allotment
            </h1>
            <p className="text-gray-600 mt-1">
              Allocate a program to an institution with specific intake and
              validity period
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/master/program-allotment")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Creating..." : "Create Allotment"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Program & Institution Details
              </CardTitle>
              <CardDescription>
                Select the program and institution for the allotment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchableSelect
                  label="Institution"
                  required
                  placeholder="Select an institution..."
                  searchPlaceholder="Search institutions..."
                  loading={loadingInstitutions}
                  disabled={institutionsError !== null}
                  value={formData.institutionId}
                  onValueChange={(value) =>
                    handleInputChange("institutionId", value)
                  }
                  options={(institutions || []).map((institution) => ({
                    value: institution.id.toString(),
                    label: institution.name,
                    code: institution.code,
                    description: `${institution.type} • ${institution.district} • ${institution.pincode}`,
                  }))}
                  emptyText={
                    loadingInstitutions
                      ? "Loading institutions..."
                      : institutionsError
                        ? "Error loading institutions"
                        : "No institutions found"
                  }
                />
                <SearchableSelect
                  label="Program"
                  required
                  placeholder="Select a program..."
                  searchPlaceholder="Search programs..."
                  loading={loadingPrograms}
                  disabled={programsError !== null}
                  value={formData.programId}
                  onValueChange={(value) =>
                    handleInputChange("programId", value)
                  }
                  options={(programs || []).map((program) => ({
                    value: program.id,
                    label: program.name,
                    code: program.code,
                    description: `${program.level} • ${program.department} • ${program.duration} years`,
                  }))}
                  emptyText={
                    loadingPrograms
                      ? "Loading programs..."
                      : programsError
                        ? "Error loading programs"
                        : "No programs found"
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Academic Details
              </CardTitle>
              <CardDescription>
                Specify the academic year and intake capacity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Input
                    id="academicYear"
                    value={formData.academicYear}
                    onChange={(e) =>
                      handleInputChange("academicYear", e.target.value)
                    }
                    placeholder="e.g., 2024-25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intake">Intake Capacity *</Label>
                  <Input
                    id="intake"
                    type="number"
                    value={formData.intake}
                    onChange={(e) =>
                      handleInputChange("intake", parseInt(e.target.value) || 0)
                    }
                    placeholder="Enter intake capacity"
                    min="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Validity & Status
              </CardTitle>
              <CardDescription>
                Set the validity period and approval status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sanctionedDate">Sanctioned Date *</Label>
                  <Input
                    id="sanctionedDate"
                    type="date"
                    value={formData.sanctionedDate}
                    onChange={(e) =>
                      handleInputChange("sanctionedDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Valid From *</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) =>
                      handleInputChange("validFrom", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validTo">Valid To *</Label>
                  <Input
                    id="validTo"
                    type="date"
                    value={formData.validTo}
                    onChange={(e) =>
                      handleInputChange("validTo", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  placeholder="Enter any additional remarks or notes"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Allotment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProgram && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">
                    Selected Program
                  </h4>
                  <p className="text-sm text-blue-700">
                    {selectedProgram.name}
                  </p>
                  <p className="text-xs text-blue-600">
                    {selectedProgram.code} • {selectedProgram.level} •{" "}
                    {selectedProgram.department}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    Duration: {selectedProgram.duration} years • Credits:{" "}
                    {selectedProgram.totalCredits}
                  </p>
                </div>
              )}

              {selectedInstitution && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">
                    Selected Institution
                  </h4>
                  <p className="text-sm text-green-700">
                    {selectedInstitution.name}
                  </p>
                  <p className="text-xs text-green-600">
                    {selectedInstitution.code} • {selectedInstitution.type} •{" "}
                    {selectedInstitution.district}
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    Address: {selectedInstitution.address_line1} • PIN:{" "}
                    {selectedInstitution.pincode}
                  </p>
                </div>
              )}

              {formData.academicYear && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Academic Year</h4>
                  <p className="text-sm text-purple-700">
                    {formData.academicYear}
                  </p>
                </div>
              )}

              {formData.intake && formData.intake > 0 && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">
                    Intake Capacity
                  </h4>
                  <p className="text-sm text-orange-700">
                    {formData.intake} students
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate("/master/program-setup")}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Manage Programs
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate("/master/entity-setup")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Manage Institutions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgramAllotmentCreate;
