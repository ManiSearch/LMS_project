import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Save, BookOpen, Clock, MessageSquare, PenTool, FileCheck, Upload, Camera, Monitor, Mic } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

const AddTopic = () => {
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get unit info from query parameters
  const unitId = searchParams.get('unitId');
  const unitTitle = searchParams.get('unitTitle');

  // Mock data
  const courseData = {
    id: courseId || "C001",
    name: "Civil Engineering",
    code: "CE101",
    department: "Civil Engineering"
  };

  const unitData = {
    id: unitId || "U001",
    title: unitTitle || "Introduction to Civil Engineering",
    order: 1
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "lesson",
    order: 1,
    duration: 0,
    isPublished: false,
    hasDiscussion: false,
    hasAssessment: false,
    hasAssignment: false,
    objectives: [""],
    prerequisites: "",
    difficulty: "beginner",
    tags: "",
    uploadedFile: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for recording success from URL params
  const recordingSuccess = searchParams.get('recordingSuccess');

  useEffect(() => {
    if (recordingSuccess === 'true') {
      toast.success('Recording saved successfully! Content has been attached to this topic.');
      // Remove the success parameter from URL
      navigate(`/academics/courses/add-topic?unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}`, { replace: true });
    }
  }, [recordingSuccess, navigate, unitId, unitTitle]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData(prev => ({
      ...prev,
      objectives: newObjectives
    }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, ""]
    }));
  };

  const removeObjective = (index: number) => {
    if (formData.objectives.length > 1) {
      const newObjectives = formData.objectives.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        objectives: newObjectives
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      uploadedFile: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        toast.error("Topic title is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.description.trim()) {
        toast.error("Topic description is required");
        setIsSubmitting(false);
        return;
      }

      if (formData.duration <= 0) {
        toast.error("Duration must be greater than 0");
        setIsSubmitting(false);
        return;
      }

      // Validate file upload for content types that require it (except if recording can be done)
      if ((formData.contentType === "document" || formData.contentType === "scorm") && !formData.uploadedFile) {
        toast.error("Please upload a file for this content type");
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Topic created successfully!");
      navigate(`/academics/courses`);
    } catch (error) {
      toast.error("Failed to create topic. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/academics/courses`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link to="/academics/courses">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Courses
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Topic</h1>
                <p className="text-gray-600 mt-1">
                  Course: {courseData.name} ({courseData.code}) • Unit: {unitData.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Quick Recording Access */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎬 Quick Record Content</h2>
              <p className="text-blue-100">
                Create engaging content instantly with our built-in recording studio
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => {
                  toast.success('Opening Camera Recording...', { icon: '📹' });
                  const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=camera`;
                  navigate(recordingUrl);
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => {
                  toast.success('Opening Screen Recording...', { icon: '🖥️' });
                  const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=screen`;
                  navigate(recordingUrl);
                }}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Screen
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => {
                  toast.success('Opening Audio Recording...', { icon: '🎙️' });
                  const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=audio`;
                  navigate(recordingUrl);
                }}
              >
                <Mic className="w-4 h-4 mr-2" />
                Audio
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Topic Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter topic title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Topic Order</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.order}
                    onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Topic Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the topic content and what students will learn"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type *</Label>
                <Select value={formData.contentType} onValueChange={(value) => handleInputChange("contentType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lesson">📚 Lesson</SelectItem>
                    <SelectItem value="video">🎥 Video</SelectItem>
                    <SelectItem value="scorm">📦 SCORM Package</SelectItem>
                    <SelectItem value="quiz">❓ Quiz</SelectItem>
                    <SelectItem value="document">📄 Document</SelectItem>
                    <SelectItem value="lti">🔗 LTI Tool</SelectItem>
                    <SelectItem value="interactive">⚡ Interactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Upload File Field - Show for appropriate content types */}
              {(formData.contentType === "video" || formData.contentType === "document" || formData.contentType === "scorm" || formData.contentType === "lesson") && (
                <div className="space-y-2">
                  <Label htmlFor="uploadFile" className="flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Existing File
                    <span className="ml-2 text-xs text-gray-500">(Alternative to recording)</span>
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Input
                      id="uploadFile"
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept={
                        formData.contentType === "video" ? "video/*" :
                        formData.contentType === "document" ? ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" :
                        formData.contentType === "scorm" ? ".zip,.scorm" : "*"
                      }
                    />
                    <Label htmlFor="uploadFile" className="cursor-pointer">
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <div className="text-sm text-gray-600">
                          {formData.uploadedFile ? (
                            <span className="text-green-600 font-medium">
                              ✓ {formData.uploadedFile.name}
                            </span>
                          ) : (
                            <>
                              <span className="font-medium">Click to upload</span> or drag and drop
                              <br />
                              <span className="text-xs text-gray-500">
                                {formData.contentType === "video" && "Video files (MP4, AVI, MOV, etc.)"}
                                {formData.contentType === "document" && "Documents (PDF, DOC, PPT, XLS, TXT)"}
                                {formData.contentType === "scorm" && "SCORM packages (ZIP files)"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Quick Recording Options */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Or use Quick Recording:
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=camera`;
                          navigate(recordingUrl);
                        }}
                        className="flex items-center gap-1 text-blue-600 hover:bg-blue-50"
                      >
                        <Camera className="h-3 w-3" />
                        Camera
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=screen`;
                          navigate(recordingUrl);
                        }}
                        className="flex items-center gap-1 text-green-600 hover:bg-green-50"
                      >
                        <Monitor className="h-3 w-3" />
                        Screen
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=audio`;
                          navigate(recordingUrl);
                        }}
                        className="flex items-center gap-1 text-purple-600 hover:bg-purple-50"
                      >
                        <Mic className="h-3 w-3" />
                        Audio
                      </Button>
                    </div>
                  </div>

                  {formData.uploadedFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange("uploadedFile", null)}
                      className="mt-2"
                    >
                      Remove File
                    </Button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    step="5"
                    placeholder="0"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., fundamentals, theory, practical"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                  />
                </div>
              </div>
              
            </CardContent>
          </Card>

          {/* Recording Section */}
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                Content Recording Studio
              </CardTitle>
              <p className="text-blue-600 mt-2">
                Create professional video, audio, or screen recordings directly in your browser
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => {
                    // Add visual feedback
                    toast.success('Opening Camera Recording Studio...', {
                      icon: '📹',
                      duration: 2000
                    });

                    const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=camera`;
                    navigate(recordingUrl);
                  }}
                  className="cursor-pointer group"
                >
                  <div className="bg-white p-6 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 text-lg">Camera Recording</h3>
                        <p className="text-sm text-blue-600 mt-1">Record yourself with webcam</p>
                        <ul className="text-xs text-gray-600 mt-2 space-y-1">
                          <li>• HD video quality</li>
                          <li>• Built-in audio</li>
                          <li>• Professional interface</li>
                        </ul>
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100">
                        Start Camera Recording
                      </Button>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    // Add visual feedback
                    toast.success('Opening Screen Recording Studio...', {
                      icon: '🖥️',
                      duration: 2000
                    });

                    const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=screen`;
                    navigate(recordingUrl);
                  }}
                  className="cursor-pointer group"
                >
                  <div className="bg-white p-6 rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Monitor className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800 text-lg">Screen Recording</h3>
                        <p className="text-sm text-green-600 mt-1">Capture screen & applications</p>
                        <ul className="text-xs text-gray-600 mt-2 space-y-1">
                          <li>• Full screen or window</li>
                          <li>• System audio included</li>
                          <li>• Perfect for tutorials</li>
                        </ul>
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-green-50 border-green-300 text-green-700 hover:bg-green-100">
                        Start Screen Recording
                      </Button>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    // Add visual feedback
                    toast.success('Opening Audio Recording Studio...', {
                      icon: '🎙️',
                      duration: 2000
                    });

                    const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=audio`;
                    navigate(recordingUrl);
                  }}
                  className="cursor-pointer group"
                >
                  <div className="bg-white p-6 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        <Mic className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-800 text-lg">Audio Recording</h3>
                        <p className="text-sm text-purple-600 mt-1">Record voice narration</p>
                        <ul className="text-xs text-gray-600 mt-2 space-y-1">
                          <li>• High-quality audio</li>
                          <li>• Noise cancellation</li>
                          <li>• Perfect for lectures</li>
                        </ul>
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100">
                        Start Audio Recording
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  <span className="font-medium">Recording Studio Features:</span>
                </div>
                <p className="text-blue-700 text-sm mt-2">
                  All recordings open in a full-screen interface with pause/resume controls, quality settings,
                  and the ability to preview before saving. Recordings are automatically attached to your topic.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="w-5 h-5 mr-2 text-green-600" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Learning objective ${index + 1}`}
                    value={objective}
                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {formData.objectives.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeObjective(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addObjective}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Learning Objective
              </Button>
            </CardContent>
          </Card>

          {/* Features & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Features & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Textarea
                  id="prerequisites"
                  placeholder="List any prerequisites or prior knowledge required"
                  value={formData.prerequisites}
                  onChange={(e) => handleInputChange("prerequisites", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Interactive Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasDiscussion"
                        checked={formData.hasDiscussion}
                        onCheckedChange={(checked) => handleInputChange("hasDiscussion", checked)}
                      />
                      <Label htmlFor="hasDiscussion" className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Enable Discussion Forum
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasAssessment"
                        checked={formData.hasAssessment}
                        onCheckedChange={(checked) => handleInputChange("hasAssessment", checked)}
                      />
                      <Label htmlFor="hasAssessment" className="flex items-center">
                        <FileCheck className="w-4 h-4 mr-2" />
                        Include Assessment
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasAssignment"
                        checked={formData.hasAssignment}
                        onCheckedChange={(checked) => handleInputChange("hasAssignment", checked)}
                      />
                      <Label htmlFor="hasAssignment" className="flex items-center">
                        <PenTool className="w-4 h-4 mr-2" />
                        Include Assignment
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Publishing Options</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                    />
                    <Label htmlFor="isPublished">Publish topic immediately</Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Published topics will be visible to students. You can change this later.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Topic
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Floating Recording Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          {/* Main FAB */}
          <Button
            type="button"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            onClick={() => {
              // Toggle mini menu visibility
              const menu = document.getElementById('recording-menu');
              if (menu) {
                menu.classList.toggle('hidden');
              }
            }}
          >
            <div className="relative">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <Camera className="w-6 h-6 text-white absolute -top-1 -left-1" />
            </div>
          </Button>

          {/* Mini Recording Menu */}
          <div id="recording-menu" className="hidden absolute bottom-20 right-0 space-y-3">
            <div className="bg-white rounded-lg shadow-lg border p-2 space-y-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  toast.success('Opening Camera Recording...', { icon: '📹' });
                  const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=camera`;
                  navigate(recordingUrl);
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-green-600 hover:bg-green-50"
                onClick={() => {
                  toast.success('Opening Screen Recording...', { icon: '🖥️' });
                  const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=screen`;
                  navigate(recordingUrl);
                }}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Screen
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-purple-600 hover:bg-purple-50"
                onClick={() => {
                  toast.success('Opening Audio Recording...', { icon: '🎙️' });
                  const recordingUrl = `/academics/courses/record?topicId=new-topic&topicTitle=${encodeURIComponent(formData.title || 'New Topic')}&unitId=${unitId}&unitTitle=${encodeURIComponent(unitTitle || '')}&courseId=${courseData.id}&type=audio`;
                  navigate(recordingUrl);
                }}
              >
                <Mic className="w-4 h-4 mr-2" />
                Audio
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AddTopic;
