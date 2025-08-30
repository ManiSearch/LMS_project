import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Save, BookOpen, Clock, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

const AddUnit = () => {
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Mock course data
  const courseData = {
    id: courseId || "C001",
    name: "Civil Engineering",
    code: "CE101",
    department: "Civil Engineering"
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
    duration: 0,
    isPublished: false,
    learningOutcomes: [""],
    teachingMethod: "",
    assessmentMethod: "",
    referenceMaterials: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLearningOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...formData.learningOutcomes];
    newOutcomes[index] = value;
    setFormData(prev => ({
      ...prev,
      learningOutcomes: newOutcomes
    }));
  };

  const addLearningOutcome = () => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, ""]
    }));
  };

  const removeLearningOutcome = (index: number) => {
    if (formData.learningOutcomes.length > 1) {
      const newOutcomes = formData.learningOutcomes.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        learningOutcomes: newOutcomes
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        toast.error("Unit title is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.description.trim()) {
        toast.error("Unit description is required");
        setIsSubmitting(false);
        return;
      }

      if (formData.duration <= 0) {
        toast.error("Duration must be greater than 0");
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Unit created successfully!");
      navigate(`/academics/courses`);
    } catch (error) {
      toast.error("Failed to create unit. Please try again.");
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
                <h1 className="text-3xl font-bold text-gray-900">Add New Unit</h1>
                <p className="text-gray-600 mt-1">
                  Course: {courseData.name} ({courseData.code})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <Label htmlFor="title">Unit Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter unit title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Unit Order</Label>
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
                <Label htmlFor="description">Unit Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the unit content and objectives"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Hours) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teachingMethod">Teaching Method</Label>
                  <Input
                    id="teachingMethod"
                    placeholder="e.g., Lecture, Lab, Tutorial"
                    value={formData.teachingMethod}
                    onChange={(e) => handleInputChange("teachingMethod", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessmentMethod">Assessment Method</Label>
                  <Input
                    id="assessmentMethod"
                    placeholder="e.g., Quiz, Assignment, Test"
                    value={formData.assessmentMethod}
                    onChange={(e) => handleInputChange("assessmentMethod", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Learning Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Learning outcome ${index + 1}`}
                    value={outcome}
                    onChange={(e) => handleLearningOutcomeChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {formData.learningOutcomes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLearningOutcome(index)}
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
                onClick={addLearningOutcome}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Learning Outcome
              </Button>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referenceMaterials">Reference Materials</Label>
                <Textarea
                  id="referenceMaterials"
                  placeholder="List reference books, articles, or other materials"
                  value={formData.referenceMaterials}
                  onChange={(e) => handleInputChange("referenceMaterials", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                />
                <Label htmlFor="isPublished">Publish unit immediately</Label>
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
                  Create Unit
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUnit;
