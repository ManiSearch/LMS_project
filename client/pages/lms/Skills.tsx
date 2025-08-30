import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Volume2,
  FileText,
  Monitor,
  ExternalLink,
  Download,
  Clock,
  Trophy,
  BookOpen,
  Target,
  Filter,
  Search,
  Grid,
  List,
  X,
  Maximize2,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface SkillsResource {
  id: string;
  title: string;
  description: string;
  type: "video" | "audio" | "ppt" | "pdf" | "youtube" | "quiz" | "scorm";
  url: string;
  duration?: string;
  size?: string;
  thumbnailUrl?: string;
  lessonPlanUnit: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  addedDate: string;
}

const mockSkillsResources: SkillsResource[] = [
  {
    id: "1",
    title: "Introduction to Composite Materials",
    description: "Comprehensive video tutorial covering the fundamentals of composite materials, their properties, and applications in modern engineering.",
    type: "video",
    url: "https://youtu.be/uO8EMAUh1po?si=5tAlDRVnSq4nUJFc",
    duration: "15:30",
    size: "250 MB",
    thumbnailUrl: "/placeholder.svg",
    lessonPlanUnit: "Unit I - Introduction to Composites",
    subject: "Composite Materials",
    difficulty: "Beginner",
    tags: ["materials", "engineering", "composites"],
    addedDate: "2024-01-15"
  },
  {
    id: "2",
    title: "Matrix Phase Properties Audio Guide",
    description: "Audio lecture on different types of matrices used in composite materials, including polymer, metal, and ceramic matrices.",
    type: "audio",
    url: "https://mocklink.com/audio/matrix-properties",
    duration: "12:45",
    size: "45 MB",
    lessonPlanUnit: "Unit I - Introduction to Composites",
    subject: "Composite Materials",
    difficulty: "Intermediate",
    tags: ["matrix", "polymers", "ceramics"],
    addedDate: "2024-01-16"
  },
  {
    id: "3",
    title: "Composite Manufacturing Processes",
    description: "Detailed PowerPoint presentation covering various manufacturing techniques for composite materials.",
    type: "ppt",
    url: "https://mocklink.com/ppt/manufacturing-processes",
    duration: "25:00",
    size: "15 MB",
    lessonPlanUnit: "Unit II - Manufacturing Processes",
    subject: "Composite Materials",
    difficulty: "Advanced",
    tags: ["manufacturing", "processes", "techniques"],
    addedDate: "2024-01-17"
  },
  {
    id: "4",
    title: "Composite Materials Handbook",
    description: "Comprehensive PDF handbook with detailed specifications, properties, and design guidelines for composite materials.",
    type: "pdf",
    url: "https://mocklink.com/pdf/composites-handbook",
    size: "125 MB",
    lessonPlanUnit: "Unit I - Introduction to Composites",
    subject: "Composite Materials",
    difficulty: "Intermediate",
    tags: ["handbook", "reference", "specifications"],
    addedDate: "2024-01-18"
  },
  {
    id: "5",
    title: "Composite Testing Methods",
    description: "YouTube series on testing methods and quality control for composite materials in industry applications.",
    type: "youtube",
    url: "https://youtu.be/qp8u-frRAnU?si=qkJRbRQUJobu_KGd",
    duration: "18:22",
    lessonPlanUnit: "Unit III - Testing and Quality Control",
    subject: "Composite Materials",
    difficulty: "Advanced",
    tags: ["testing", "quality control", "industry"],
    addedDate: "2024-01-19"
  },
  {
    id: "6",
    title: "Composite Properties Assessment",
    description: "Interactive quiz to test understanding of composite material properties, advantages, and limitations.",
    type: "quiz",
    url: "https://mocklink.com/quiz/composite-properties",
    duration: "20:00",
    lessonPlanUnit: "Unit I - Introduction to Composites",
    subject: "Composite Materials",
    difficulty: "Beginner",
    tags: ["assessment", "properties", "quiz"],
    addedDate: "2024-01-20"
  },
  {
    id: "7",
    title: "Virtual Composite Lab Simulation",
    description: "SCORM package providing hands-on virtual laboratory experience for composite material testing and analysis.",
    type: "scorm",
    url: "https://mocklink.com/scorm/composite-lab-sim",
    duration: "45:00",
    size: "180 MB",
    lessonPlanUnit: "Unit III - Testing and Quality Control",
    subject: "Composite Materials",
    difficulty: "Advanced",
    tags: ["simulation", "laboratory", "hands-on"],
    addedDate: "2024-01-21"
  }
];

const Skills: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<SkillsResource | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [view, setView] = useState<'list' | 'preview' | 'open'>('list');

  const filteredResources = mockSkillsResources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || resource.type === filterType;
    const matchesDifficulty = filterDifficulty === "all" || resource.difficulty === filterDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      video: "bg-blue-50 border-blue-200 text-blue-800",
      audio: "bg-purple-50 border-purple-200 text-purple-800",
      pdf: "bg-red-50 border-red-200 text-red-800",
      ppt: "bg-orange-50 border-orange-200 text-orange-800",
      youtube: "bg-red-50 border-red-200 text-red-800",
      quiz: "bg-green-50 border-green-200 text-green-800",
      scorm: "bg-indigo-50 border-indigo-200 text-indigo-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-50 border-gray-200 text-gray-800";
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      video: <Play className="w-5 h-5" />,
      audio: <Volume2 className="w-5 h-5" />,
      pdf: <FileText className="w-5 h-5" />,
      ppt: <Monitor className="w-5 h-5" />,
      youtube: <span className="text-base">📺</span>,
      quiz: <span className="text-base">❓</span>,
      scorm: <span className="text-base">📦</span>,
    };
    return icons[type as keyof typeof icons] || <FileText className="w-5 h-5" />;
  };

  const openPreview = (resource: SkillsResource) => {
    setSelectedResource(resource);
    setView('preview');
  };

  const openResource = (resource: SkillsResource) => {
    setSelectedResource(resource);
    setView('open');
  };

  const renderBackButton = () => (
    <Button variant="outline" onClick={() => setView('list')} className="mb-4">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Resources
    </Button>
  );

  const renderContentViewer = (resource: SkillsResource) => {
    switch (resource.type) {
      case "video":
      case "youtube":
        return (
          <div className="w-full h-[400px]">
            <iframe
              src={`https://www.youtube.com/embed/${resource.url.split('/').pop()?.split('?')[0]}`}
              className="w-full h-full rounded-lg"
              allowFullScreen
              title={resource.title}
            />
          </div>
        );

      case "audio":
        return (
          <div className="w-full h-[300px] flex flex-col items-center justify-center bg-purple-50 rounded-lg">
            <Volume2 className="w-16 h-16 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              {resource.description}
            </p>
            <audio controls className="w-full max-w-md">
              <source src={resource.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      case "pdf":
        return (
          <div className="w-full h-[400px] flex flex-col items-center justify-center bg-red-50 rounded-lg">
            <FileText className="w-16 h-16 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              {resource.description}
            </p>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => window.open(resource.url, "_blank")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Open PDF
            </Button>
          </div>
        );

      case "ppt":
        return (
          <div className="w-full h-[400px] flex flex-col items-center justify-center bg-orange-50 rounded-lg">
            <Monitor className="w-16 h-16 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              {resource.description}
            </p>
            <Button
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => window.open(resource.url, "_blank")}
            >
              <Monitor className="w-4 h-4 mr-2" />
              Open Presentation
            </Button>
          </div>
        );

      case "quiz":
        return (
          <div className="w-full h-[400px] flex flex-col items-center justify-center bg-green-50 rounded-lg">
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              {resource.description}
            </p>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                toast.success("Opening quiz in new window...");
                window.open(resource.url, "_blank");
              }}
            >
              <Target className="w-4 h-4 mr-2" />
              Start Quiz
            </Button>
          </div>
        );

      case "scorm":
        return (
          <div className="w-full h-[400px] flex flex-col items-center justify-center bg-indigo-50 rounded-lg">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              {resource.description}
            </p>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                toast.success("SCORM package launching...");
                setTimeout(() => {
                  toast.success("SCORM content loaded successfully!");
                }, 1500);
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              Launch SCORM Package
            </Button>
          </div>
        );

      default:
        return (
          <div className="w-full h-[400px] flex items-center justify-center">
            <p className="text-gray-500">Content type not supported for inline viewing</p>
          </div>
        );
    }
  };

  const renderPreviewView = () => (
    selectedResource && (
      <div className="space-y-6">
        {renderBackButton()}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {selectedResource.type === "video" && <Play className="w-5 h-5 text-blue-600" />}
            {selectedResource.type === "audio" && <Volume2 className="w-5 h-5 text-purple-600" />}
            {selectedResource.type === "pdf" && <FileText className="w-5 h-5 text-red-600" />}
            {selectedResource.type === "ppt" && <Monitor className="w-5 h-5 text-orange-600" />}
            {selectedResource.type === "youtube" && <span className="text-red-600">📺</span>}
            {selectedResource.type === "quiz" && <span className="text-green-600">❓</span>}
            {selectedResource.type === "scorm" && <span className="text-indigo-600">📦</span>}
            <h2 className="text-2xl font-bold">{selectedResource.title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(selectedResource.url, "_blank")}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="overflow-auto">{renderContentViewer(selectedResource)}</div>
        
        <Card>
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Description:</strong>
              <p className="text-muted-foreground mt-1">{selectedResource.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Unit:</strong>
                <p className="text-muted-foreground">{selectedResource.lessonPlanUnit}</p>
              </div>
              <div>
                <strong>Difficulty:</strong>
                <Badge variant="outline">{selectedResource.difficulty}</Badge>
              </div>
              {selectedResource.duration && (
                <div>
                  <strong>Duration:</strong>
                  <p className="text-muted-foreground">{selectedResource.duration}</p>
                </div>
              )}
              {selectedResource.size && (
                <div>
                  <strong>Size:</strong>
                  <p className="text-muted-foreground">{selectedResource.size}</p>
                </div>
              )}
            </div>
            <div>
              <strong>Tags:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedResource.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );

  const renderOpenView = () => (
    selectedResource && (
      <div className="space-y-6">
        {renderBackButton()}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {selectedResource.type === "video" && <Play className="w-5 h-5 text-blue-600" />}
            {selectedResource.type === "audio" && <Volume2 className="w-5 h-5 text-purple-600" />}
            {selectedResource.type === "pdf" && <FileText className="w-5 h-5 text-red-600" />}
            {selectedResource.type === "ppt" && <Monitor className="w-5 h-5 text-orange-600" />}
            {selectedResource.type === "youtube" && <span className="text-red-600">📺</span>}
            {selectedResource.type === "quiz" && <span className="text-green-600">❓</span>}
            {selectedResource.type === "scorm" && <span className="text-indigo-600">📦</span>}
            <h2 className="text-2xl font-bold">{selectedResource.title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(selectedResource.url, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
              Open in New Tab
            </Button>
          </div>
        </div>
        
        <div className="h-[600px] border rounded-lg overflow-hidden">
          {renderContentViewer(selectedResource)}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{selectedResource.description}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-sm">Complete the {selectedResource.type} content</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Apply concepts from {selectedResource.lessonPlanUnit}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Master {selectedResource.difficulty.toLowerCase()} level skills</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );

  const renderResourceCard = (resource: SkillsResource) => {
    if (viewMode === "list") {
      return (
        <Card key={resource.id} className="hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-lg border ${getTypeColor(resource.type)}`}>
                  {getTypeIcon(resource.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📚 {resource.lessonPlanUnit}</span>
                    {resource.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {resource.duration}
                      </span>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {resource.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPreview(resource)}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => openResource(resource)}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-lg border ${getTypeColor(resource.type)}`}>
              {getTypeIcon(resource.type)}
            </div>
            <Badge variant="outline" className="text-xs">
              {resource.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {resource.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-sm line-clamp-3">{resource.description}</p>
          
          <div className="space-y-2">
            <div className="text-xs text-gray-500">
              <span className="font-medium">Unit:</span> {resource.lessonPlanUnit}
            </div>
            {resource.duration && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {resource.duration}
                {resource.size && <span className="ml-2">• {resource.size}</span>}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => openPreview(resource)}
            >
              <Play className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => openResource(resource)}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (view !== 'list') {
    switch (view) {
      case 'preview':
        return renderPreviewView();
      case 'open':
        return renderOpenView();
      default:
        return renderPreviewView();
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Skills Resources
          </h1>
          <p className="text-gray-600 mt-1">
            External study resources related to lesson plan units
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search resources by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="ppt">PowerPoint</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="scorm">SCORM</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid/List */}
      <div className={`${
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
      }`}>
        {filteredResources.map(renderResourceCard)}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find resources.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Skills;
