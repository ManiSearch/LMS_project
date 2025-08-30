import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  ArrowLeft,
  Video,
  Brain,
  Shield,
  Gamepad2,
  Users,
  Clock,
  Target,
  Award,
} from "lucide-react";
import { AcademicsCourse } from "@/services/AcademicsCoursesData";

interface AcademicCourseDetailPageProps {
  course: AcademicsCourse;
  onBack: () => void;
}

export default function AcademicCourseDetailPage({
  course,
  onBack,
}: AcademicCourseDetailPageProps) {
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Courses
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{course.name}</h1>
          <p className="text-muted-foreground">
            {course.code} • {course.department}
          </p>
        </div>
        <Badge
          variant={
            course.status === "Active"
              ? "default"
              : course.status === "Published"
              ? "default"
              : "secondary"
          }
          className="text-sm"
        >
          {course.status}
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credits</p>
                <p className="text-xl font-bold">{course.credits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Hours</p>
                <p className="text-xl font-bold">{course.learningHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enrolled</p>
                <p className="text-xl font-bold">
                  {course.enrolled}/{course.maxCapacity}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p className="text-xl font-bold">{course.type}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Course Code</Label>
              <p className="text-sm mt-1">{course.code}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Category</Label>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {course.subcategory}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Assigned Faculty</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {course.assignedFaculty.map((faculty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {faculty}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Assigned Departments</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {course.assignedDepartments.map((dept, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {dept}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
              <p className="text-sm mt-1">
                {course.startDate} to {course.endDate}
              </p>
            </div>
            {course.practicalHours > 0 && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Practical Hours</Label>
                <p className="text-sm mt-1">{course.practicalHours}h</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enrollment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enrollment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Current Enrollment</Label>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{course.enrolled} students</span>
                  <span>{course.maxCapacity} capacity</span>
                </div>
                <Progress
                  value={course.maxCapacity > 0 ? (course.enrolled / course.maxCapacity) * 100 : 0}
                  className="w-full h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {course.maxCapacity > 0 
                    ? Math.round((course.enrolled / course.maxCapacity) * 100)
                    : 0}% full
                </p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Enrollment Mode</Label>
              <Badge variant="outline" className="text-xs mt-1">
                {course.enrollmentMode}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Course Features</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {course.virtualClassroom && (
                  <Badge variant="outline" className="text-xs">
                    <Video className="h-3 w-3 mr-1" />
                    Virtual Classroom
                  </Badge>
                )}
                {course.adaptiveLearning && (
                  <Badge variant="outline" className="text-xs">
                    <Brain className="h-3 w-3 mr-1" />
                    Adaptive Learning
                  </Badge>
                )}
                {course.proctoring && (
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Proctoring
                  </Badge>
                )}
                {course.gamificationEnabled && (
                  <Badge variant="outline" className="text-xs">
                    <Gamepad2 className="h-3 w-3 mr-1" />
                    Gamification
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{course.description}</p>
        </CardContent>
      </Card>

      {/* Course Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Outcomes</CardTitle>
          <CardDescription>
            Learning objectives and expected outcomes for this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {course.outcomes.map((outcome, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">CO{index + 1}</p>
                  <p className="text-sm text-muted-foreground">{outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Units */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Units</CardTitle>
          <CardDescription>
            Detailed breakdown of course content and structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {course.units.map((unit, index) => (
              <div key={unit.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {unit.order}
                    </div>
                    <div>
                      <h4 className="font-medium">{unit.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        Created by {unit.createdBy} • {unit.createdDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {unit.duration}h
                    </Badge>
                    <Badge 
                      variant={unit.isPublished ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {unit.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{unit.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">{course.assignments}</p>
              <p className="text-sm text-muted-foreground">Assignments</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-green-600">{course.assessments}</p>
              <p className="text-sm text-muted-foreground">Assessments</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-blue-600">{course.discussions}</p>
              <p className="text-sm text-muted-foreground">Discussions</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-purple-600">{course.lessonPlans}</p>
              <p className="text-sm text-muted-foreground">Lesson Plans</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
