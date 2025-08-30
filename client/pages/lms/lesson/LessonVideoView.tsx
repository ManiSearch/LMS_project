import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  PenTool,
  Download,
  PlayCircle,
  Clock,
  Eye,
  Code2,
  FileText,
  ExternalLink,
  Lightbulb,
  CheckCircle,
  Share2,
  Save,
  Pause,
  Play,
  Users,
  BookOpen,
  Globe,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface CourseContentItem {
  id: string;
  title: string;
  duration: string;
  timestamp: string;
  type: "video" | "reading" | "quiz" | "assignment";
  completed: boolean;
}

interface VideoLessonData {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
  transcript: string;
  unit: string;
  topic: string;
  nextTopic?: string;
  prevTopic?: string;
  courseContent: CourseContentItem[];
  resources: {
    notes: string[];
    codeExamples: string[];
    references: string[];
  };
}

const mockVideoLessons: { [key: string]: VideoLessonData } = {
  "1": {
    id: "1",
    title: "1st PILLAR OF OOP - DATA ABSTRACTION",
    duration: "18:45",
    description:
      "Understanding the fundamental concept of data abstraction in Object-Oriented Programming. Learn how abstraction helps in hiding implementation details while exposing only essential features.",
    videoUrl: "https://youtu.be/qp8u-frRAnU?si=qkJRbRQUJobu_KGd",
    transcript: `
In this comprehensive lesson, we explore the first pillar of Object-Oriented Programming: Data Abstraction.

Data abstraction is a programming technique that allows us to hide the implementation details of a class while exposing only the essential features. This is achieved through the use of abstract classes and interfaces.

Key concepts covered:
1. What is Data Abstraction?
2. Benefits of Abstraction
3. Implementation in Java
4. Real-world examples
5. Best practices

Let's start with understanding what abstraction means in the context of programming...
    `,
    unit: "Unit I: OOP Fundamentals",
    topic: "Data Abstraction",
    nextTopic: "2",
    prevTopic: null,
    courseContent: [
      {
        id: "1",
        title: "Introduction to Data Abstraction",
        duration: "4:30",
        timestamp: "00:00",
        type: "video",
        completed: true,
      },
      {
        id: "2",
        title: "Benefits and Principles",
        duration: "3:45",
        timestamp: "04:30",
        type: "video",
        completed: true,
      },
      {
        id: "3",
        title: "Abstract Classes vs Interfaces",
        duration: "5:20",
        timestamp: "08:15",
        type: "video",
        completed: false,
      },
      {
        id: "4",
        title: "Practical Implementation",
        duration: "3:40",
        timestamp: "13:35",
        type: "video",
        completed: false,
      },
      {
        id: "5",
        title: "Best Practices & Examples",
        duration: "2:30",
        timestamp: "17:15",
        type: "video",
        completed: false,
      },
      {
        id: "6",
        title: "Knowledge Check Quiz",
        duration: "5:00",
        timestamp: "19:45",
        type: "quiz",
        completed: false,
      },
    ],
    resources: {
      notes: [
        "Advantages of Data Abstraction",
        "Abstract Classes vs Interfaces",
        "Implementation Guidelines",
        "Common Design Patterns",
      ],
      codeExamples: [
        "Abstract Class Example - Vehicle",
        "Interface Implementation - Drawable",
        "Factory Pattern with Abstraction",
        "Template Method Pattern",
      ],
      references: [
        "Java Documentation - Abstract Classes",
        "Effective Java - Item 20",
        "Design Patterns - Gang of Four",
        "Clean Architecture - Robert Martin",
      ],
    },
  },
  "2": {
    id: "2",
    title: "2nd PILLAR OF OOP - ENCAPSULATION",
    duration: "22:30",
    description:
      "Dive deep into encapsulation, the second pillar of OOP. Learn how to bundle data and methods together while controlling access through proper visibility modifiers.",
    videoUrl: "https://youtu.be/qp8u-frRAnU?si=qkJRbRQUJobu_KGd",
    transcript: `
Welcome to our exploration of the second pillar of Object-Oriented Programming: Encapsulation.

Encapsulation is the mechanism of bundling data (attributes) and methods (functions) that operate on that data into a single unit or class. It also involves controlling access to the internal components using access modifiers.

Topics we'll cover:
1. Understanding Encapsulation
2. Access Modifiers in Java
3. Getter and Setter Methods
4. Data Hiding vs Encapsulation
5. Best Practices and Examples

Encapsulation provides several benefits including data protection, modularity, and flexibility...
    `,
    unit: "Unit I: OOP Fundamentals",
    topic: "Encapsulation",
    nextTopic: "3",
    prevTopic: "1",
    courseContent: [
      {
        id: "1",
        title: "What is Encapsulation?",
        duration: "5:15",
        timestamp: "00:00",
        type: "video",
        completed: true,
      },
      {
        id: "2",
        title: "Access Modifiers Deep Dive",
        duration: "6:30",
        timestamp: "05:15",
        type: "video",
        completed: false,
      },
      {
        id: "3",
        title: "Getter and Setter Methods",
        duration: "4:45",
        timestamp: "11:45",
        type: "video",
        completed: false,
      },
      {
        id: "4",
        title: "Data Hiding Techniques",
        duration: "3:20",
        timestamp: "16:30",
        type: "video",
        completed: false,
      },
      {
        id: "5",
        title: "Real-world Examples",
        duration: "2:40",
        timestamp: "19:50",
        type: "video",
        completed: false,
      },
      {
        id: "6",
        title: "Encapsulation Assessment",
        duration: "7:00",
        timestamp: "22:30",
        type: "quiz",
        completed: false,
      },
    ],
    resources: {
      notes: [
        "Access Modifiers Explained",
        "Getter/Setter Best Practices",
        "Data Validation Techniques",
        "Encapsulation vs Data Hiding",
      ],
      codeExamples: [
        "Bank Account Class Example",
        "Student Management System",
        "Builder Pattern Implementation",
        "Immutable Objects",
      ],
      references: [
        "Java Language Specification",
        "Effective Java - Item 16",
        "Java: The Complete Reference",
        "Object-Oriented Analysis and Design",
      ],
    },
  },
};

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return videoId
    ? `https://www.youtube.com/embed/${videoId[1]}?autoplay=0&modestbranding=1&rel=0&enablejsapi=1`
    : url;
};

export default function LessonVideoView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"notes" | "code" | "references">(
    "notes",
  );
  const [watchProgress, setWatchProgress] = useState(42); // Progress percentage
  const [currentTime, setCurrentTime] = useState("08:15");
  const [isPlaying, setIsPlaying] = useState(false);

  const lessonData = mockVideoLessons[id || "1"] || mockVideoLessons["1"];

  const completedItems = lessonData.courseContent.filter(
    (item) => item.completed,
  ).length;
  const totalItems = lessonData.courseContent.length;
  const progressPercentage = Math.round((completedItems / totalItems) * 100);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Bookmark removed" : "Lesson bookmarked!");
  };

  const handleSaveNotes = () => {
    if (notes.trim()) {
      toast.success("Notes saved successfully!");
    } else {
      toast.error("Please add some notes first");
    }
  };

  const handleSaveProgress = () => {
    toast.success("Progress saved successfully!");
  };

  const handleShareProgress = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lesson link copied to clipboard!");
  };

  const navigateToTopic = (topicId: string) => {
    navigate(`/academics/lesson-video/${topicId}`);
  };

  const jumpToTimestamp = (timestamp: string) => {
    toast.info(`Jumping to ${timestamp}`);
    // In a real implementation, this would control the video player
    setCurrentTime(timestamp);
  };

  const toggleContentCompletion = (contentId: string) => {
    // In a real implementation, this would update the content completion status
    toast.success("Content marked as completed!");
  };

  // Quick Actions Functions
  const openQAForum = () => {
    toast.success("Opening Q&A Forum...");
    // Navigate to Q&A forum with topic context
    window.open(`/academics/qa-forum?topic=${lessonData.id}`, "_blank");
  };

  const downloadResources = () => {
    toast.success("Downloading lesson resources...");
    // Trigger download of lesson materials
    const link = document.createElement("a");
    link.href = "#"; // In real implementation, this would be the download URL
    link.download = `${lessonData.title}-resources.zip`;
    // link.click();
  };

  const viewFullCourse = () => {
    toast.success("Opening full course view...");
    navigate("/academics/courses");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link to="/academics/lesson-plans">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Lesson Plans
                </Button>
              </Link>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Lesson Plans</span>
                <ChevronRight className="w-4 h-4" />
                <span>{lessonData.unit}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-900">
                  {lessonData.topic}
                </span>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-2">
              {lessonData.prevTopic && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToTopic(lessonData.prevTopic!)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
              {lessonData.nextTopic && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToTopic(lessonData.nextTopic!)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Main Video Section - 70% */}
          <div className="lg:col-span-7 space-y-6">
            {/* Video Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {lessonData.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {lessonData.duration}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      Video Lecture
                    </div>
                    <Badge variant="outline">{lessonData.unit}</Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Watch Progress</span>
                      <span>
                        {watchProgress}% • {currentTime}
                      </span>
                    </div>
                    <Progress value={watchProgress} className="h-2" />
                  </div>
                </div>

                <Button
                  variant={isBookmarked ? "default" : "outline"}
                  size="sm"
                  onClick={handleBookmark}
                  className="ml-4"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                  ) : (
                    <Bookmark className="w-4 h-4 mr-2" />
                  )}
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
              </div>

              <p className="text-gray-700">{lessonData.description}</p>
            </div>

            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(lessonData.videoUrl)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={lessonData.title}
                />
              </div>
            </Card>

            {/* Course Content Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Content ({totalItems} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lessonData.courseContent.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        item.completed
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-gray-500 min-w-[2rem]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {item.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {item.duration}
                            </span>
                            <button
                              onClick={() => jumpToTimestamp(item.timestamp)}
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              {item.timestamp}
                            </button>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => jumpToTimestamp(item.timestamp)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        {!item.completed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleContentCompletion(item.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Video Description & Transcript */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Lesson Transcript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                    {lessonData.transcript}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Resources - 30% */}
          <div className="lg:col-span-3 space-y-6">
            {/* Your Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {progressPercentage}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {completedItems} of {totalItems} items completed
                  </p>
                  <Progress value={progressPercentage} className="mt-3" />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleSaveProgress}
                    className="flex-1"
                    variant="outline"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={handleShareProgress}
                    className="flex-1"
                    variant="outline"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Time watched:</span>
                    <span>
                      {currentTime} / {lessonData.duration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last activity:</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions - With Functionality */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={openQAForum}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Q&A Forum
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={downloadResources}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resources
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={viewFullCourse}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Course
                </Button>
              </CardContent>
            </Card>

            {/* Learning Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {[
                      { key: "notes", label: "Notes", icon: Lightbulb },
                      { key: "code", label: "Code", icon: Code2 },
                      {
                        key: "references",
                        label: "References",
                        icon: FileText,
                      },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key as any)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === key
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4 inline mr-1" />
                        {label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="mt-4">
                  {activeTab === "notes" && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Key Notes</h4>
                      {lessonData.resources.notes.map((note, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg"
                        >
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{note}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "code" && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        Code Examples
                      </h4>
                      {lessonData.resources.codeExamples.map(
                        (example, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <Code2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-700">
                                {example}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                toast.success("Opening code example...")
                              }
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {activeTab === "references" && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        Additional Reading
                      </h4>
                      {lessonData.resources.references.map(
                        (reference, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-gray-700">
                                {reference}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                toast.success("Opening reference...")
                              }
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Note Taking Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <PenTool className="w-5 h-5 mr-2" />
                  My Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Take notes while watching the video..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <Button
                  onClick={handleSaveNotes}
                  className="w-full"
                  disabled={!notes.trim()}
                >
                  Save Notes
                </Button>
              </CardContent>
            </Card>

            {/* Topic Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockVideoLessons["1"] && (
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      id === "1"
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                    }`}
                    onClick={() => navigateToTopic("1")}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Data Abstraction
                      </span>
                      {id === "1" && <PlayCircle className="w-4 h-4" />}
                    </div>
                  </div>
                )}
                {mockVideoLessons["2"] && (
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      id === "2"
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                    }`}
                    onClick={() => navigateToTopic("2")}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Encapsulation</span>
                      {id === "2" && <PlayCircle className="w-4 h-4" />}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}