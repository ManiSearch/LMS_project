import React, { useState, useEffect } from "react";
import entityService, {
  Entity,
  CreateEntityResponse,
} from "@/services/entityService";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
  School,
  Building,
  MapPin,
  Users,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  Wrench,
  GraduationCap,
  BookOpen,
  ChevronsRight,
  ArrowLeft,
  Save,
  X,
  Globe,
  Phone,
  Mail,
  MapIcon,
  Calendar,
  Award,
  Home,
  Bus,
  CheckCircle,
  FileText,
} from "lucide-react";

interface Entity {
  id: string;
  name: string;
  code: string;
  slug: string;
type:
  | "polytechnic"
  | "engineering"
  | "arts & science";

  parentId?: string;
  educationalAuthority: string;
  affiliation_number: string;
  recognized_by: string[];
  university_type: string;
  description: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: string;
  longitude?: string;
  contact_person: string;
  designation: string;
  email: string;
  phone: string;
  alternate_phone?: string;
  website: string;
  capacity: number;
  established_year: number;
  num_departments: number;
  num_faculties: number;
  num_students: number;
  programs_offered: string[];
  accreditation: string;
  is_autonomous: boolean;
  is_verified: boolean;
  hostel_available: boolean;
  transport_available: boolean;
  digital_library_url?: string;
  learning_management_url?: string;
  placement_cell_contact?: string;
  alumni_association_url?: string;
  status: "active" | "inactive";
  created_date: string;
  created_at: string;
  updated_at: string;
  remarks?: string;
  logo_url?: string;
}

export default function EntitySetup() {
  const [entities, setEntities] = useState<Entity[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Removed isCreateDialogOpen state as we're using page navigation now
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "view" | "edit" | "create">(
    "list",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntity, setEditedEntity] = useState<Entity | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Bulk selection state
  const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(
    new Set(),
  );
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const [newEntity, setNewEntity] = useState({
    name: "",
    code: "",
    slug: "",
    type: "institute",
    parentId: "none",
    description: "",
    educationalAuthority: "",
    affiliation_number: "",
    recognized_by: [] as string[],
    university_type: "",
    address_line1: "",
    address_line2: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: "",
    contact_person: "",
    designation: "",
    email: "",
    phone: "",
    alternate_phone: "",
    website: "",
    capacity: "",
    established_year: "",
    num_departments: "",
    num_faculties: "",
    num_students: "",
    programs_offered: [] as string[],
    accreditation: "",
    is_autonomous: false,
    is_verified: false,
    hostel_available: false,
    transport_available: false,
    digital_library_url: "",
    learning_management_url: "",
    placement_cell_contact: "",
    alumni_association_url: "",
    remarks: "",
    logo_url: "",
  });

  const getInstitutionCategory = (entity: Entity) => {
    // Now using the direct type field from entity.json
    return entity.type || "other";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "university":
        return <School className="h-4 w-4" />;
      case "college":
        return <Building className="h-4 w-4" />;
      case "institute":
        return <Building className="h-4 w-4" />;
      case "school":
        return <GraduationCap className="h-4 w-4" />;
      case "department":
        return <Building className="h-4 w-4" />;
      case "location":
        return <MapPin className="h-4 w-4" />;
      case "level":
        return <Users className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "polytechnic":
        return <Wrench className="h-4 w-4" />;
      case "engineering":
        return <Settings className="h-4 w-4" />;
      case "arts & science":
        return <BookOpen className="h-4 w-4" />;
      case "college":
        return <Building className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "university":
        return "bg-blue-100 text-blue-800";
      case "college":
        return "bg-green-100 text-green-800";
      case "institute":
        return "bg-purple-100 text-purple-800";
      case "school":
        return "bg-orange-100 text-orange-800";
      case "department":
        return "bg-yellow-100 text-yellow-800";
      case "location":
        return "bg-pink-100 text-pink-800";
      case "level":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "polytechnic":
        return "bg-purple-100 text-purple-800";
      case "engineering":
        return "bg-blue-100 text-blue-800";
      case "arts & science":
        return "bg-green-100 text-green-800";
      case "college":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      entity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || entity.type === filterType;

    const matchesStatus =
      filterStatus === "all" || entity.status === filterStatus;

    const matchesTab = activeTab === "all" || entity.type === activeTab;

    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEntities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntities = filteredEntities.slice(startIndex, endIndex);

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(paginatedEntities.map((e) => e.id));
      setSelectedEntityIds(newSelected);
    } else {
      setSelectedEntityIds(new Set());
    }
  };

  const handleSelectEntity = (entityId: string, checked: boolean) => {
    const newSelected = new Set(selectedEntityIds);
    if (checked) {
      newSelected.add(entityId);
    } else {
      newSelected.delete(entityId);
    }
    setSelectedEntityIds(newSelected);
  };

  const isAllSelected =
    paginatedEntities.length > 0 &&
    paginatedEntities.every((e) => selectedEntityIds.has(e.id));

  // Bulk delete functionality
  const handleBulkDelete = () => {
    if (selectedEntityIds.size === 0) {
      toast.error("Please select at least one entity to delete.");
      return;
    }
    setIsBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      setLoading(true);
      const entitiesToDelete = Array.from(selectedEntityIds);

      // Delete each selected entity
      for (const entityId of entitiesToDelete) {
        await entityService.deleteEntity(entityId);
      }

      await loadEntitiesFromFile();
      setSelectedEntityIds(new Set());
      setIsBulkDeleteDialogOpen(false);

      toast.success(
        `${entitiesToDelete.length} entity(ies) deleted successfully! Data has been updated in entity.json.`,
      );
    } catch (error) {
      console.error("Error deleting entities:", error);
      toast.error("Error deleting entities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load entities from entity.json file on component mount
  useEffect(() => {
    const loadEntities = async () => {
      try {
        setLoading(true);
        const loadedEntities = await entityService.loadEntities();
        setEntities(loadedEntities);
        console.log("Entities loaded from entity.json file:", loadedEntities);
      } catch (error) {
        console.error("Error loading entities from entity.json file:", error);
        setError("Failed to load entities from entity.json file");
      } finally {
        setLoading(false);
      }
    };

    loadEntities();
  }, []);

  // Update total items when filtered entities change
  React.useEffect(() => {
    setTotalItems(filteredEntities.length);
    if (
      currentPage > Math.ceil(filteredEntities.length / itemsPerPage) &&
      filteredEntities.length > 0
    ) {
      setCurrentPage(1);
    }
  }, [filteredEntities.length, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2),
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const stats = {
    polytechnic: entities.filter((e) => e.type === "polytechnic").length,
    engineering: entities.filter((e) => e.type === "engineering").length,
    artsScience: entities.filter((e) => e.type === "arts & science").length,
    active: entities.filter((e) => e.status === "active").length,
    total: entities.length,
  };

  const handleCreateEntity = async () => {
    try {
      setLoading(true);
      const startTime = performance.now();

      // Prepare entity data for validation with proper numeric conversion
      const entityData = {
        ...newEntity,
        parentId:
          newEntity.parentId === "none" ? undefined : newEntity.parentId,
        capacity: newEntity.capacity ? parseInt(newEntity.capacity) : 0,
        established_year: newEntity.established_year
          ? parseInt(newEntity.established_year)
          : new Date().getFullYear(),
        num_departments: newEntity.num_departments
          ? parseInt(newEntity.num_departments)
          : 0,
        num_faculties: newEntity.num_faculties
          ? parseInt(newEntity.num_faculties)
          : 0,
        num_students: newEntity.num_students
          ? parseInt(newEntity.num_students)
          : 0,
      };

      console.log("🔍 EntitySetup: Sending data to service:", entityData);
      console.log("🔍 EntitySetup: newEntity state:", newEntity);

      // Call enhanced create entity service
      let result;
      try {
        result = await entityService.createEntity(entityData);
      } catch (serviceError) {
        console.error("🔍 Service threw an error:", serviceError);
        result = {
          success: false,
          errors: [
            serviceError instanceof Error
              ? serviceError.message
              : "Service error",
          ],
          message: "Service call failed",
          latency: Math.round(performance.now() - startTime),
        };
      }

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      console.log("🔍 Service Result Type:", typeof result);
      console.log("���� Service Result:", result);
      console.log("🔍 Result Success:", result?.success);
      console.log("🔍 Result Errors:", result?.errors);
      console.log("🔍 Result Message:", result?.message);

      if (result?.success && result?.entity) {
        // Update local state with new entity
        const updatedEntities = [...entities, result.entity];
        setEntities(updatedEntities);

        // Reset form and navigate back to list
        resetNewEntity();
        setViewMode("list");

        // Success feedback with metrics
        toast.success(
          `✅ Entity created successfully!\n` +
            `📊 Storage latency: ${latency}ms\n` +
            `🔢 Assigned ID: ${result.entity.id}\n` +
            `💾 Saved to entity.json file\n` +
            `📁 Total entities: ${updatedEntities.length}`,
        );

        // Optional: Auto-download the updated JSON file (commented out to avoid annoyance)
        // downloadEntityJSON(updatedEntities);

        console.log("✅ Entity Creation Success:", {
          id: result.entity.id,
          latency: `${latency}ms`,
          message: result.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        // Handle validation or duplicate errors
        console.log("🔍 Handling Error Result:", result);

        let errorMessage = "Unknown error occurred";

        // Check if result is properly structured
        if (!result || typeof result !== "object") {
          errorMessage = `Invalid response from service: ${typeof result}`;
        } else if (result.errors) {
          if (Array.isArray(result.errors)) {
            errorMessage = result.errors.join("\n");
          } else if (typeof result.errors === "string") {
            errorMessage = result.errors;
          } else if (typeof result.errors === "object") {
            try {
              errorMessage = JSON.stringify(result.errors, null, 2);
            } catch (e) {
              errorMessage = "Error serializing error object";
            }
          } else {
            errorMessage = `Unexpected error format: ${typeof result.errors}`;
          }
        } else if (result.message) {
          errorMessage = result.message;
        } else {
          // Better error handling to prevent [object Object]
          try {
            errorMessage = `Service returned invalid response: ${JSON.stringify(result, null, 2)}`;
          } catch (e) {
            errorMessage = `Service returned unparseable response of type: ${typeof result}`;
          }
        }

        toast.error(
          `❌ Entity Creation Failed:\n${errorMessage}\n` +
            `⏱️ Processing time: ${latency}ms`,
        );

        console.error("❌ Entity Creation Failed:", {
          errors: result?.errors,
          message: result?.message,
          latency: `${latency}ms`,
          fullResult: result,
          resultType: typeof result,
        });
      }
    } catch (error) {
      // Handle unexpected errors
      let errorMessage = "Unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (typeof error === "object" && error !== null) {
        errorMessage = JSON.stringify(error, null, 2);
      }

      toast.error(
        `🚨 System Error:\n${errorMessage}\n` +
          `Please check file permissions and try again.`,
      );

      console.error("🚨 Entity Creation System Error:", {
        error,
        errorType: typeof error,
        errorMessage,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const resetNewEntity = () => {
    setNewEntity({
      name: "",
      code: "",
      slug: "",
      type: "institute",
      parentId: "none",
      description: "",
      educationalAuthority: "",
      affiliation_number: "",
      recognized_by: [],
      university_type: "",
      address_line1: "",
      address_line2: "",
      city: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
      latitude: "",
      longitude: "",
      contact_person: "",
      designation: "",
      email: "",
      phone: "",
      alternate_phone: "",
      website: "",
      capacity: "",
      established_year: "",
      num_departments: "",
      num_faculties: "",
      num_students: "",
      programs_offered: [],
      accreditation: "",
      is_autonomous: false,
      is_verified: false,
      hostel_available: false,
      transport_available: false,
      digital_library_url: "",
      learning_management_url: "",
      placement_cell_contact: "",
      alumni_association_url: "",
      remarks: "",
      logo_url: "",
    });
  };

  const handleViewEntity = async (entity: Entity) => {
    try {
      // Fetch fresh entity data from entity.json file
      const freshEntityData = await entityService.getEntityById(entity.id);
      if (!freshEntityData) {
        toast.error("Entity not found in entity.json file");
        return;
      }

      setSelectedEntity(freshEntityData);
      setEditedEntity({ ...freshEntityData });
      setViewMode("view");
      setIsEditing(false);
      console.log(
        "Entity data fetched from entity.json for viewing:",
        freshEntityData,
      );
    } catch (error) {
      console.error("Error fetching entity from entity.json:", error);
      toast.error("Failed to fetch entity data");
    }
  };

  // Handle edit from table row - fetch fresh data from entity.json
  const handleEditEntityFromTable = async (entity: Entity) => {
    try {
      // Fetch fresh entity data from entity.json file
      const freshEntityData = await entityService.getEntityById(entity.id);
      if (!freshEntityData) {
        toast.error("Entity not found in entity.json file");
        return;
      }

      setSelectedEntity(freshEntityData);
      setEditedEntity({ ...freshEntityData });
      setIsEditing(true);
      setViewMode("edit");
      console.log(
        "Entity data fetched from entity.json for editing:",
        freshEntityData,
      );
    } catch (error) {
      console.error("Error fetching entity from entity.json:", error);
      toast.error("Failed to fetch entity data for editing");
    }
  };

  const handleEditEntity = () => {
    setIsEditing(true);
    setViewMode("edit");
  };

  const handleSaveEntity = async () => {
    if (editedEntity && selectedEntity) {
      try {
        setLoading(true);

        const updatedEntity = await entityService.updateEntity(
          selectedEntity.id,
          editedEntity,
        );

        setEntities(
          entities.map((e) => (e.id === selectedEntity.id ? updatedEntity : e)),
        );

        setSelectedEntity(updatedEntity);
        setIsEditing(false);
        setViewMode("view");
        toast.success("Entity updated successfully!");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update entity",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedEntity(selectedEntity ? { ...selectedEntity } : null);
    setIsEditing(false);
    setViewMode("view");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedEntity(null);
    setEditedEntity(null);
    setIsEditing(false);
  };

  const handleCreateNewEntity = () => {
    setViewMode("create");
    resetNewEntity();
  };

  const handleCancelCreate = () => {
    setViewMode("list");
    resetNewEntity();
  };

  // Enhanced export with format selection
  const handleExportEntities = async (format: "json" | "csv" | "excel") => {
    try {
      await entityService.exportEntityFile(format);

      const formatName = format === "excel" ? "Excel" : format.toUpperCase();
      toast.success(
        `✅ Export successful! Entity data exported as ${formatName} format.`,
      );
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export entity data. Please try again.");
    }
  };

  // Download sample template
  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/sample_entities_template.csv";
    link.download = "entity_import_template.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      "📄 Template downloaded! Use this CSV format for importing entity data.",
    );
  };

  // Import entities to entity.json file and merge with existing data
  const handleImportEntities = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Get file extension for proper error handling
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    try {
      const currentCount = entities.length;
      console.log(`📥 Starting import: ${currentCount} existing entities`);

      // Check if file is Excel/CSV and handle accordingly - BEFORE FileReader
      if (
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".csv")
      ) {
        // Use enhanced import method for Excel/CSV files - pass File object directly
        const result = await entityService.importEntityFile(file);
        // Update state with merged entities
        setEntities(result.entities);

        const { added, updated, total } = result.summary;
        let message = `✅ Import successful!\n\n`;
        message += `📄 File: ${file.name}\n`;
        if (added > 0) {
          message += `🆕 Added: ${added} new entities\n`;
        }
        if (updated > 0) {
          message += `🔄 Updated: ${updated} existing entities\n`;
        }
        message += `��� Total entities: ${total}\n\n`;
        message += `💾 Data saved to entity.json`;
        toast.success(message);
        return;
      }

      // For JSON files, use FileReader and the original method
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;

          // For JSON files, use the original method
          const result = await entityService.importEntityFileContent(content);

          // Update state with merged entities (preserves existing + adds new)
          setEntities(result);

          const newCount = result.length;
          const addedCount = newCount - currentCount;

          // Parse original import data to get import count for feedback
          let importCount = 0;
          try {
            const importData = JSON.parse(content);
            importCount = Array.isArray(importData) ? importData.length : 0;
          } catch (e) {
            importCount = 0;
          }
          const updatedCount = Math.max(0, importCount - addedCount);

          let message = `✅ Import successful!\n`;
          if (addedCount > 0) {
            message += `🆕 Added: ${addedCount} new entities\n`;
          }
          if (updatedCount > 0) {
            message += `��� Updated: ${updatedCount} existing entities\n`;
          }
          message += `📊 Total entities: ${newCount}`;

          toast.success(message);
        } catch (error) {
          console.error("Import error:", error);
          toast.error(
            "Failed to import entities. Please check the JSON format and try again.",
          );
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Import error:", error);
      let errorMessage = `❌ Import failed: ${error.message || "Unknown error"}\n\n`;

      if (fileExtension === ".json") {
        errorMessage += `💡 JSON files should contain an array of entity objects with all required fields.`;
      } else if (fileExtension === ".csv") {
        errorMessage += `💡 CSV files should have proper headers and data rows. Check the template for correct format.`;
      } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
        errorMessage += `💡 Excel files should have headers in the first row and data in subsequent rows. Check the template for correct format.`;
      } else {
        errorMessage += `💡 Supported formats: .json, .csv, .xlsx, .xls`;
      }

      errorMessage += `\n\n🔍 Error details: ${error.stack ? error.stack.split("\n")[0] : error.message}`;
      toast.error(errorMessage);
    } finally {
      // Reset file input
      event.target.value = "";
    }
  };

  const handleDeleteEntity = async (entityId: string) => {
    try {
      setLoading(true);

      await entityService.deleteEntity(entityId);
      setEntities(entities.filter((e) => e.id !== entityId));
      toast.success("Entity deleted successfully!");

      // If we're viewing the deleted entity, go back to list
      if (selectedEntity?.id === entityId) {
        handleBackToList();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete entity",
      );
    } finally {
      setLoading(false);
    }
  };

 

  // Helper function to download entity data as JSON file
  const downloadEntityJSON = (entityData: Entity[]) => {
    try {
      // Convert to clean JSON format with proper formatting
      const jsonContent = JSON.stringify(entityData, null, 2);

      // Create blob and download
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `entity_data_${new Date().toISOString().split("T")[0]}.json`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log("📁 JSON file downloaded successfully");
    } catch (error) {
      console.error("❌ Error downloading JSON file:", error);
    }
  };

  // Create view mode - full page create form
  if (viewMode === "create") {
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToList}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Plus className="h-8 w-8" />
                Create New Entity
              </h1>
              <p className="text-muted-foreground mt-1">
                Add a new institutional entity with comprehensive details
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                <FileText className="h-4 w-4" />
                Data will be saved to:{" "}
                <code className="bg-blue-50 px-2 py-1 rounded">
                  entity.json
                </code>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancelCreate}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleCreateEntity}
              disabled={
                !newEntity.name ||
                !newEntity.code ||
                !newEntity.description ||
                newEntity.description.length < 20 ||
                !newEntity.educationalAuthority ||
                !newEntity.affiliation_number ||
                !newEntity.email ||
                !newEntity.phone ||
                !newEntity.website ||
                !newEntity.address_line1 ||
                !newEntity.city ||
                !newEntity.state ||
                !newEntity.country ||
                !newEntity.pincode ||
                !newEntity.contact_person ||
                !newEntity.designation ||
                loading
              }
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                "Create Entity"
              )}
            </Button>
          </div>
        </div>

        {/* Create Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="name"
                          className="flex items-center gap-1"
                        >
                          Institution Name{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={newEntity.name}
                          onChange={(e) =>
                            setNewEntity({ ...newEntity, name: e.target.value })
                          }
                          placeholder="Enter institution name"
                          className={
                            !newEntity.name
                              ? "border-red-300 focus:border-red-500"
                              : ""
                          }
                          required
                        />
                        {!newEntity.name && (
                          <p className="text-xs text-red-500 mt-1">
                            Institution name is required
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="code"
                          className="flex items-center gap-1"
                        >
                          Institution Code{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="code"
                          type="number"
                          value={newEntity.code}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                            setNewEntity({ ...newEntity, code: value });
                          }}
                          placeholder="e.g., 101, 203, 405"
                          className={
                            !newEntity.code
                              ? "border-red-300 focus:border-red-500"
                              : ""
                          }
                          pattern="[0-9]*"
                          inputMode="numeric"
                          required
                        />
                        {!newEntity.code && (
                          <p className="text-xs text-red-500 mt-1">
                            Institution code is required
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={newEntity.slug}
                          onChange={(e) =>
                            setNewEntity({ ...newEntity, slug: e.target.value })
                          }
                          placeholder="psg-college-of-technology"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Entity Type</Label>
                        <Select
                          value={newEntity.type}
                          onValueChange={(value) =>
                            setNewEntity({ ...newEntity, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="polytechnic">
                              Polytechnic
                            </SelectItem>
                            <SelectItem value="engineering">
                              Engineering
                            </SelectItem>
                            <SelectItem value="arts & science">
                              Arts & Science
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="educationalAuthority"
                          className="flex items-center gap-1"
                        >
                          Educational Authority{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={newEntity.educationalAuthority}
                          onValueChange={(value) =>
                            setNewEntity({
                              ...newEntity,
                              educationalAuthority: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select authority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Anna University">
                              Anna University
                            </SelectItem>
                            <SelectItem value="DOTE">DOTE</SelectItem>
                            <SelectItem value="DOCE">DOCE</SelectItem>
                            <SelectItem value="Bharathiar University">
                              Bharathiar University
                            </SelectItem>
                            <SelectItem value="UGC">UGC</SelectItem>
                            <SelectItem value="AICTE">AICTE</SelectItem>
                            <SelectItem value="Government of Tamil Nadu">
                              Government of Tamil Nadu
                            </SelectItem>
                            <SelectItem value="MHRD">MHRD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor="affiliation_number"
                          className="flex items-center gap-1"
                        >
                          Affiliation Number{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="affiliation_number"
                          value={newEntity.affiliation_number}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              affiliation_number: e.target.value,
                            })
                          }
                          placeholder="AU/2023/TN/1234"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="university_type">University Type</Label>
                        <Input
                          id="university_type"
                          value={newEntity.university_type}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              university_type: e.target.value,
                            })
                          }
                          placeholder="Autonomous"
                        />
                      </div>
                      <div>
                        <Label htmlFor="accreditation">Accreditation</Label>
                        <Input
                          id="accreditation"
                          value={newEntity.accreditation}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              accreditation: e.target.value,
                            })
                          }
                          placeholder="NAAC A++"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="description"
                        className="flex items-center gap-1"
                      >
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={newEntity.description}
                        onChange={(e) =>
                          setNewEntity({
                            ...newEntity,
                            description: e.target.value,
                          })
                        }
                        placeholder="Brief description of the entity (minimum 20 characters)"
                        rows={3}
                        className={
                          !newEntity.description ||
                          newEntity.description.length < 20
                            ? "border-red-300 focus:border-red-500"
                            : ""
                        }
                        required
                      />
                      {(!newEntity.description ||
                        newEntity.description.length < 20) && (
                        <p className="text-xs text-red-500 mt-1">
                          Description is required (minimum 20 characters)
                          {newEntity.description &&
                            ` - ${newEntity.description.length}/20`}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapIcon className="h-5 w-5" />
                      Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="address_line1">Address Line 1</Label>
                        <Input
                          id="address_line1"
                          value={newEntity.address_line1}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              address_line1: e.target.value,
                            })
                          }
                          placeholder="Avinashi Road"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address_line2">Address Line 2</Label>
                        <Input
                          id="address_line2"
                          value={newEntity.address_line2}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              address_line2: e.target.value,
                            })
                          }
                          placeholder="Peelamedu"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newEntity.city}
                          onChange={(e) =>
                            setNewEntity({ ...newEntity, city: e.target.value })
                          }
                          placeholder="Coimbatore"
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          value={newEntity.district}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              district: e.target.value,
                            })
                          }
                          placeholder="Coimbatore"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={newEntity.state}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              state: e.target.value,
                            })
                          }
                          placeholder="Tamil Nadu"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={newEntity.pincode}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              pincode: e.target.value,
                            })
                          }
                          placeholder="641004"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={newEntity.country}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              country: e.target.value,
                            })
                          }
                          placeholder="India"
                        />
                      </div>
                      <div>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          value={newEntity.latitude}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              latitude: e.target.value,
                            })
                          }
                          placeholder="11.029453"
                        />
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          value={newEntity.longitude}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              longitude: e.target.value,
                            })
                          }
                          placeholder="77.000984"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact_person">Contact Person</Label>
                        <Input
                          id="contact_person"
                          value={newEntity.contact_person}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              contact_person: e.target.value,
                            })
                          }
                          placeholder="Dr. R. Venkatesan"
                        />
                      </div>
                      <div>
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="designation"
                          value={newEntity.designation}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              designation: e.target.value,
                            })
                          }
                          placeholder="Principal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newEntity.email}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              email: e.target.value,
                            })
                          }
                          placeholder="info@psgtech.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={newEntity.website}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              website: e.target.value,
                            })
                          }
                          placeholder="https://www.psgtech.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Primary Phone</Label>
                        <Input
                          id="phone"
                          value={newEntity.phone}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+919876543210"
                        />
                      </div>
                      <div>
                        <Label htmlFor="alternate_phone">Alternate Phone</Label>
                        <Input
                          id="alternate_phone"
                          value={newEntity.alternate_phone}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              alternate_phone: e.target.value,
                            })
                          }
                          placeholder="+914222572177"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="placement_cell_contact">
                          Placement Cell Contact
                        </Label>
                        <Input
                          id="placement_cell_contact"
                          value={newEntity.placement_cell_contact}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              placement_cell_contact: e.target.value,
                            })
                          }
                          placeholder="+919843210987"
                        />
                      </div>
                      <div>
                        <Label htmlFor="alumni_association_url">
                          Alumni Association URL
                        </Label>
                        <Input
                          id="alumni_association_url"
                          value={newEntity.alumni_association_url}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              alumni_association_url: e.target.value,
                            })
                          }
                          placeholder="https://alumni.psgtech.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="capacity">Total Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newEntity.capacity}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              capacity: e.target.value,
                            })
                          }
                          placeholder="9000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="established_year">
                          Established Year
                        </Label>
                        <Input
                          id="established_year"
                          type="number"
                          value={newEntity.established_year}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              established_year: e.target.value,
                            })
                          }
                          placeholder="1951"
                        />
                      </div>
                      <div>
                        <Label htmlFor="num_departments">Departments</Label>
                        <Input
                          id="num_departments"
                          type="number"
                          value={newEntity.num_departments}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              num_departments: e.target.value,
                            })
                          }
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="num_faculties">Faculties</Label>
                        <Input
                          id="num_faculties"
                          type="number"
                          value={newEntity.num_faculties}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              num_faculties: e.target.value,
                            })
                          }
                          placeholder="600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="num_students">Current Students</Label>
                        <Input
                          id="num_students"
                          type="number"
                          value={newEntity.num_students}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              num_students: e.target.value,
                            })
                          }
                          placeholder="8500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="logo_url">Logo URL</Label>
                        <Input
                          id="logo_url"
                          value={newEntity.logo_url}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              logo_url: e.target.value,
                            })
                          }
                          placeholder="https://psgtech.com/logo.png"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="digital_library_url">
                          Digital Library URL
                        </Label>
                        <Input
                          id="digital_library_url"
                          value={newEntity.digital_library_url}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              digital_library_url: e.target.value,
                            })
                          }
                          placeholder="https://library.psgtech.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="learning_management_url">
                          Learning Management URL
                        </Label>
                        <Input
                          id="learning_management_url"
                          value={newEntity.learning_management_url}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              learning_management_url: e.target.value,
                            })
                          }
                          placeholder="https://lms.psgtech.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is_autonomous"
                            checked={newEntity.is_autonomous}
                            onChange={(e) =>
                              setNewEntity({
                                ...newEntity,
                                is_autonomous: e.target.checked,
                              })
                            }
                          />
                          <Label htmlFor="is_autonomous">Autonomous</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is_verified"
                            checked={newEntity.is_verified}
                            onChange={(e) =>
                              setNewEntity({
                                ...newEntity,
                                is_verified: e.target.checked,
                              })
                            }
                          />
                          <Label htmlFor="is_verified">Verified</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="hostel_available"
                            checked={newEntity.hostel_available}
                            onChange={(e) =>
                              setNewEntity({
                                ...newEntity,
                                hostel_available: e.target.checked,
                              })
                            }
                          />
                          <Label htmlFor="hostel_available">
                            Hostel Available
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="transport_available"
                            checked={newEntity.transport_available}
                            onChange={(e) =>
                              setNewEntity({
                                ...newEntity,
                                transport_available: e.target.checked,
                              })
                            }
                          />
                          <Label htmlFor="transport_available">
                            Transport Available
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="remarks">Remarks</Label>
                      <Textarea
                        id="remarks"
                        value={newEntity.remarks}
                        onChange={(e) =>
                          setNewEntity({
                            ...newEntity,
                            remarks: e.target.value,
                          })
                        }
                        placeholder="Well known for producing top-tier engineers in Tamil Nadu."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
                  onClick={handleCreateEntity}
                  disabled={
                    !newEntity.name ||
                    !newEntity.code ||
                    !newEntity.description ||
                    newEntity.description.length < 20 ||
                    !newEntity.educationalAuthority ||
                    !newEntity.affiliation_number ||
                    !newEntity.email ||
                    !newEntity.phone ||
                    !newEntity.website ||
                    !newEntity.address_line1 ||
                    !newEntity.city ||
                    !newEntity.state ||
                    !newEntity.country ||
                    !newEntity.pincode ||
                    !newEntity.contact_person ||
                    !newEntity.designation ||
                    loading
                  }
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Entity
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelCreate}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => downloadEntityJSON(entities)}
                  className="w-full"
                  title="Download current entity data as JSON file"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download JSON
                </Button>
              </CardContent>
            </Card>

            {/* Form Validation Status */}
            <Card>
              <CardHeader>
                <CardTitle>Form Validation Status</CardTitle>
                <CardDescription>
                  {(() => {
                    const requiredFields = [
                      newEntity.name,
                      newEntity.code,
                      newEntity.description &&
                        newEntity.description.length >= 20,
                      newEntity.educationalAuthority,
                      newEntity.affiliation_number,
                      newEntity.email,
                      newEntity.phone,
                      newEntity.website,
                      newEntity.address_line1,
                      newEntity.city,
                      newEntity.state,
                      newEntity.country,
                      newEntity.pincode,
                      newEntity.contact_person,
                      newEntity.designation,
                    ];
                    const completedFields =
                      requiredFields.filter(Boolean).length;
                    const totalFields = requiredFields.length;
                    const percentage = Math.round(
                      (completedFields / totalFields) * 100,
                    );
                    return `${completedFields}/${totalFields} required fields (${percentage}%)`;
                  })()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(() => {
                        const requiredFields = [
                          newEntity.name,
                          newEntity.code,
                          newEntity.description &&
                            newEntity.description.length >= 20,
                          newEntity.educationalAuthority,
                          newEntity.affiliation_number,
                          newEntity.email,
                          newEntity.phone,
                          newEntity.website,
                          newEntity.address_line1,
                          newEntity.city,
                          newEntity.state,
                          newEntity.country,
                          newEntity.pincode,
                          newEntity.contact_person,
                          newEntity.designation,
                        ];
                        const completedFields =
                          requiredFields.filter(Boolean).length;
                        const totalFields = requiredFields.length;
                        return Math.round(
                          (completedFields / totalFields) * 100,
                        );
                      })()}%`,
                    }}
                  ></div>
                </div>

                {/* Required field checklist */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${newEntity.name ? "text-green-500" : "text-red-300"}`}
                    />
                    <span
                      className={
                        newEntity.name ? "text-gray-900" : "text-red-500"
                      }
                    >
                      Institution Name
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${newEntity.code ? "text-green-500" : "text-red-300"}`}
                    />
                    <span
                      className={
                        newEntity.code ? "text-gray-900" : "text-red-500"
                      }
                    >
                      Institution Code
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${newEntity.description && newEntity.description.length >= 20 ? "text-green-500" : "text-red-300"}`}
                    />
                    <span
                      className={
                        newEntity.description &&
                        newEntity.description.length >= 20
                          ? "text-gray-900"
                          : "text-red-500"
                      }
                    >
                      Description (20+ chars)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${newEntity.educationalAuthority ? "text-green-500" : "text-red-300"}`}
                    />
                    <span
                      className={
                        newEntity.educationalAuthority
                          ? "text-gray-900"
                          : "text-red-500"
                      }
                    >
                      Educational Authority
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${newEntity.affiliation_number ? "text-green-500" : "text-red-300"}`}
                    />
                    <span
                      className={
                        newEntity.affiliation_number
                          ? "text-gray-900"
                          : "text-red-500"
                      }
                    >
                      Affiliation Number
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${newEntity.email ? "text-green-500" : "text-red-300"}`}
                    />
                    <span
                      className={
                        newEntity.email ? "text-gray-900" : "text-red-500"
                      }
                    >
                      Contact Email
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${newEntity.phone ? "text-green-500" : "text-red-300"}`}
                    />
                    <span
                      className={
                        newEntity.phone ? "text-gray-900" : "text-red-500"
                      }
                    >
                      Phone Number
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${newEntity.website ? "text-green-500" : "text-red-300"}`}
                    />
                    <span
                      className={
                        newEntity.website ? "text-gray-900" : "text-red-500"
                      }
                    >
                      Website
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${newEntity.address_line1 && newEntity.city && newEntity.state && newEntity.country && newEntity.pincode ? "text-green-500" : "text-red-300"}`}
                    />
                    <span
                      className={
                        newEntity.address_line1 &&
                        newEntity.city &&
                        newEntity.state &&
                        newEntity.country &&
                        newEntity.pincode
                          ? "text-gray-900"
                          : "text-red-500"
                      }
                    >
                      Complete Address
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${newEntity.contact_person && newEntity.designation ? "text-green-500" : "text-red-300"}`}
                    />
                    <span
                      className={
                        newEntity.contact_person && newEntity.designation
                          ? "text-gray-900"
                          : "text-red-500"
                      }
                    >
                      Contact Person & Designation
                    </span>
                  </div>
                </div>

                {/* Validation summary */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600">
                    <div className="font-medium mb-1">Data Quality Checks:</div>
                    <div>✓ 100% Data Persistence</div>
                    <div>✓ &lt;1 Second Storage Latency</div>
                    <div>✓ Human-readable JSON Formatting</div>
                    <div>✓ System-generated Audit Log</div>
                    <div>✓ Auto-incremented ID Assignment</div>
                    <div>✓ Duplicate Prevention</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      <div className="font-medium mb-1">JSON File Status:</div>
                      <div>📁 File: public/entity.json</div>
                      <div>📊 Total Records: {entities.length}</div>
                      <div>🕒 Last Updated: {new Date().toLocaleString()}</div>
                      <div>💾 Format: JSON (2-space indent)</div>
                      <div>📥 Download updated file after creation</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "view" || viewMode === "edit") {
    const currentEntity = isEditing ? editedEntity : selectedEntity;
    if (!currentEntity) return null;

    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToList}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                {getTypeIcon(currentEntity.type)}
                {currentEntity.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {currentEntity.code} • {currentEntity.type}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={handleEditEntity}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEntity}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Entity Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Institution Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.name}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev ? { ...prev, name: e.target.value } : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {currentEntity.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Code
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentEntity.code}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                          setEditedEntity((prev) =>
                            prev ? { ...prev, code: value } : null,
                          );
                        }}
                        className="mt-1"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        placeholder="e.g., 101, 203, 405"
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {currentEntity.code}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Type
                    </Label>
                    {isEditing ? (
                      <Select
                        value={currentEntity.type}
                        onValueChange={(value) =>
                          setEditedEntity((prev) =>
                            prev
                              ? { ...prev, type: value as Entity["type"] }
                              : null,
                          )
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="polytechnic">Polytechnic</SelectItem>
<SelectItem value="engineering">Engineering</SelectItem>
<SelectItem value="arts & science">Arts & Science</SelectItem>

                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant="outline"
                        className={`${getTypeColor(currentEntity.type)} mt-1`}
                      >
                        {currentEntity.type}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Educational Authority
                    </Label>
                    {isEditing ? (
                      <Select
                        value={currentEntity.educationalAuthority}
                        onValueChange={(value) =>
                          setEditedEntity((prev) =>
                            prev
                              ? { ...prev, educationalAuthority: value }
                              : null,
                          )
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UGC">UGC</SelectItem>
                          <SelectItem value="AICTE">AICTE</SelectItem>
                          <SelectItem value="Government of Tamil Nadu">
                            Government of Tamil Nadu
                          </SelectItem>
                          <SelectItem value="MHRD">MHRD</SelectItem>
                          <SelectItem value="State Board">
                            State Board
                          </SelectItem>
                          <SelectItem value="CBSE">CBSE</SelectItem>
                          <SelectItem value="Private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1">
                        {currentEntity.educationalAuthority}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Description
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={currentEntity.description}
                      onChange={(e) =>
                        setEditedEntity((prev) =>
                          prev
                            ? { ...prev, description: e.target.value }
                            : null,
                        )
                      }
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1">{currentEntity.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      University Type
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.university_type}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? { ...prev, university_type: e.target.value }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{currentEntity.university_type}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Established Year
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentEntity.established_year}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  established_year: parseInt(e.target.value),
                                }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{currentEntity.established_year}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Accreditation
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.accreditation}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? { ...prev, accreditation: e.target.value }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 mt-1"
                      >
                        {currentEntity.accreditation}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapIcon className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Address Line 1
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.address_line1}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? { ...prev, address_line1: e.target.value }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{currentEntity.address_line1}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Address Line 2
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.address_line2 || ""}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? { ...prev, address_line2: e.target.value }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">
                        {currentEntity.address_line2 || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      City
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.city}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev ? { ...prev, city: e.target.value } : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{currentEntity.city}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      District
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.district}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev ? { ...prev, district: e.target.value } : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{currentEntity.district}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      State
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.state}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev ? { ...prev, state: e.target.value } : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{currentEntity.state}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Pincode
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.pincode}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev ? { ...prev, pincode: e.target.value } : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{currentEntity.pincode}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Contact Person
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.contact_person}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? { ...prev, contact_person: e.target.value }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 font-medium">
                        {currentEntity.contact_person}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Designation
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.designation}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? { ...prev, designation: e.target.value }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{currentEntity.designation}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Primary Phone
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.phone}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev ? { ...prev, phone: e.target.value } : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {currentEntity.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Alternate Phone
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.alternate_phone || ""}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? { ...prev, alternate_phone: e.target.value }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {currentEntity.alternate_phone || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={currentEntity.email}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev ? { ...prev, email: e.target.value } : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {currentEntity.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Website
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentEntity.website}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev ? { ...prev, website: e.target.value } : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <a
                          href={currentEntity.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {currentEntity.website}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Capacity
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentEntity.capacity}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? { ...prev, capacity: parseInt(e.target.value) }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-lg font-semibold">
                        {currentEntity.capacity.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Departments
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentEntity.num_departments}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  num_departments: parseInt(e.target.value),
                                }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-lg font-semibold">
                        {currentEntity.num_departments}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Faculties
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentEntity.num_faculties}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  num_faculties: parseInt(e.target.value),
                                }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-lg font-semibold">
                        {currentEntity.num_faculties}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Students
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentEntity.num_students}
                        onChange={(e) =>
                          setEditedEntity((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  num_students: parseInt(e.target.value),
                                }
                              : null,
                          )
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-lg font-semibold">
                        {currentEntity.num_students.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Programs Offered
                  </Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {currentEntity.programs_offered.map((program, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        {program}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Recognized By
                  </Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {currentEntity.recognized_by.map((org, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        {org}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Facilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span className="text-sm">Hostel</span>
                    <Badge
                      variant={
                        currentEntity.hostel_available ? "default" : "secondary"
                      }
                    >
                      {currentEntity.hostel_available
                        ? "Available"
                        : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bus className="h-4 w-4" />
                    <span className="text-sm">Transport</span>
                    <Badge
                      variant={
                        currentEntity.transport_available
                          ? "default"
                          : "secondary"
                      }
                    >
                      {currentEntity.transport_available
                        ? "Available"
                        : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">Autonomous</span>
                    <Badge
                      variant={
                        currentEntity.is_autonomous ? "default" : "secondary"
                      }
                    >
                      {currentEntity.is_autonomous ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Verified</span>
                    <Badge
                      variant={
                        currentEntity.is_verified ? "default" : "secondary"
                      }
                    >
                      {currentEntity.is_verified ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>

                {(currentEntity.digital_library_url ||
                  currentEntity.learning_management_url) && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Digital Resources
                    </Label>
                    <div className="space-y-1">
                      {currentEntity.digital_library_url && (
                        <p className="text-sm">
                          <strong>Digital Library:</strong>{" "}
                          <a
                            href={currentEntity.digital_library_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {currentEntity.digital_library_url}
                          </a>
                        </p>
                      )}
                      {currentEntity.learning_management_url && (
                        <p className="text-sm">
                          <strong>LMS:</strong>{" "}
                          <a
                            href={currentEntity.learning_management_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {currentEntity.learning_management_url}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(currentEntity.status)} w-full justify-center py-2`}
                >
                  {currentEntity.status.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            {/* Key Information */}
            <Card>
              <CardHeader>
                <CardTitle>Key Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-gray-500">
                    Affiliation Number
                  </Label>
                  <p className="text-sm font-medium">
                    {currentEntity.affiliation_number}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-500">
                    Slug
                  </Label>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {currentEntity.slug}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-500">
                    Created Date
                  </Label>
                  <p className="text-sm">
                    {new Date(currentEntity.created_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-500">
                    Last Updated
                  </Label>
                  <p className="text-sm">
                    {new Date(currentEntity.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{currentEntity.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{currentEntity.email}</span>
                </div>
                {currentEntity.placement_cell_contact && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Placement: {currentEntity.placement_cell_contact}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Remarks */}
            {currentEntity.remarks && (
              <Card>
                <CardHeader>
                  <CardTitle>Remarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {currentEntity.remarks}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entity Setup</h1>
          <p className="text-muted-foreground mt-2">
            Configure and manage institutional entities, departments, and
            organizational structure.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateNewEntity}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entity
          </Button>
          {/* Export with Format Selection */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleExportEntities("json")}
              variant="outline"
              size="sm"
              disabled={entities.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              JSON
            </Button>
            <Button
              onClick={() => handleExportEntities("csv")}
              variant="outline"
              size="sm"
              disabled={entities.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              onClick={() => handleExportEntities("excel")}
              variant="outline"
              size="sm"
              disabled={entities.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>

          {/* Import & Merge with Format Support */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="file"
                accept=".json,.csv,.xlsx,.xls"
                onChange={handleImportEntities}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="json-import-header"
              />
              <Button variant="outline" asChild>
                <label
                  htmlFor="json-import-header"
                  className="cursor-pointer flex items-center"
                  title="Import and merge entities with existing data (JSON, CSV, Excel)"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Import & Merge
                </label>
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="text-gray-600 hover:text-gray-800"
            >
              <FileText className="h-4 w-4 mr-2" />
              Template
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading entities...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Polytechnic
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {stats.polytechnic}
                </p>
              </div>
              <Wrench className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Engineering</p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.engineering}
                </p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Arts & Science
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {stats.artsScience}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Colleges</p>
                <p className="text-3xl font-bold text-orange-900">
                  {stats.college}
                </p>
              </div>
              <Building className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card> */}

        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Active
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
              <Settings className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="polytechnic">Polytechnic</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="arts & science">Arts & Science</SelectItem>
            {/* <SelectItem value="college">College</SelectItem> */}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={itemsPerPage.toString()}
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs and Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Entities</TabsTrigger>
          <TabsTrigger value="polytechnic">Polytechnic</TabsTrigger>
          <TabsTrigger value="engineering">Engineering</TabsTrigger>
          <TabsTrigger value="arts & science">Arts & Science</TabsTrigger>
          {/* <TabsTrigger value="college">Colleges</TabsTrigger> */}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              {/* Bulk Actions */}
              {selectedEntityIds.size > 0 && (
                <div className="flex items-center justify-between p-4 bg-blue-50 border-b border-blue-200">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-blue-700 font-medium">
                      {selectedEntityIds.size} entity(ies) selected
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEntityIds(new Set())}
                  >
                    Clear Selection
                  </Button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium w-12">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all entities"
                        />
                      </th>
                      <th className="text-left p-4 font-medium">Entity</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">
                        Educational Authority
                      </th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Capacity</th>
                      <th className="text-left p-4 font-medium">Contact</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEntities.map((entity) => (
                      <tr key={entity.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedEntityIds.has(entity.id)}
                            onCheckedChange={(checked) =>
                              handleSelectEntity(entity.id, checked as boolean)
                            }
                            aria-label={`Select ${entity.name}`}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(entity.type)}
                            <div>
                              <div className="font-medium">{entity.name}</div>
                              <div className="text-sm text-gray-500">
                                {entity.code}
                              </div>
                              <div className="text-xs text-gray-400 max-w-md truncate">
                                {entity.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {/* <Badge
                              variant="outline"
                              className={getTypeColor(entity.type)}
                            >
                              {entity.type}
                            </Badge> */}
                            <Badge
                              variant="outline"
                              className={getCategoryColor(entity.type)}
                            >
                              {entity.type.charAt(0).toUpperCase() +
                                entity.type.slice(1)}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">
                            {entity.educationalAuthority}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={getStatusColor(entity.status)}
                          >
                            {entity.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">
                            {entity.capacity?.toLocaleString() || "N/A"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div>{entity.contact_person || "N/A"}</div>
                            {entity.email && (
                              <div className="text-gray-500">
                                {entity.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewEntity(entity)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  title="Delete Entity"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the entity "{entity.name}
                                    " and remove it from the database.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteEntity(entity.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginatedEntities.length === 0 &&
                  filteredEntities.length === 0 && (
                    <div className="text-center py-12">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No entities found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search or filter criteria.
                      </p>
                    </div>
                  )}
              </div>
            </CardContent>

            {/* Pagination Footer */}
            {filteredEntities.length > 0 && (
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, filteredEntities.length)} of{" "}
                      {filteredEntities.length} entities
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* First page button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    {/* Previous page button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {generatePageNumbers().map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="h-8 w-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>

                    {/* Next page button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Last page button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Entities</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selectedEntityIds.size} entity(ies). Are you sure you want to
              proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {selectedEntityIds.size} Entity(ies)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
