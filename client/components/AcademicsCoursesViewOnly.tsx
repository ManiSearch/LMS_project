import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BookOpen,
  Search,
  Eye,
  Filter,
  XCircle,
  CheckCircle,
  Video,
  Brain,
  Shield,
  Gamepad2,
  Star,
} from "lucide-react";
import { AcademicsCourse } from "@/services/AcademicsCoursesData";

interface AcademicsCoursesViewOnlyProps {
  courses: AcademicsCourse[];
  onViewCourse: (course: AcademicsCourse) => void;
  userFaculty?: string;
}

export default function AcademicsCoursesViewOnly({
  courses,
  onViewCourse,
  userFaculty,
}: AcademicsCoursesViewOnlyProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Filter courses based on faculty assignment
  const facultyCourses = courses.filter((course) => {
    if (!userFaculty) return true;
    return course.assignedFaculty.includes(userFaculty);
  });

  // Apply search and filter logic
  const filteredCourses = facultyCourses.filter((course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || course.category === categoryFilter;
    
    const matchesStatus = 
      statusFilter === "all" || course.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(facultyCourses.map(c => c.category)));

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSelectedCourses([]);
  };

  return (
    <Card className="section-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <BookOpen className="h-5 w-5" />
          </div>
          My Courses (Academic)
        </CardTitle>
        <CardDescription>
          View your assigned academic courses from the curriculum. 
          This is a read-only view - you can only view course details, not edit them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleResetFilters}>
            <XCircle className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No courses assigned
            </p>
            <p className="text-sm text-muted-foreground">
              {userFaculty 
                ? `No academic courses are currently assigned to ${userFaculty}`
                : "No academic courses found matching your criteria"
              }
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Type & Credits</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {course.code} • {course.assignedFaculty.join(", ")}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {course.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {course.subcategory}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant={
                          course.type === "Mandatory" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {course.type}
                      </Badge>
                      <div className="text-sm">{course.credits} Credits</div>
                      <div className="text-xs text-muted-foreground">
                        {course.learningHours}h Learning
                        {course.practicalHours > 0 && ` + ${course.practicalHours}h Practical`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{course.department}</div>
                      <div className="text-xs text-muted-foreground">
                        {course.assignedDepartments.slice(0, 2).join(", ")}
                        {course.assignedDepartments.length > 2 && 
                          ` +${course.assignedDepartments.length - 2} more`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {course.enrolled}/{course.maxCapacity}
                      </div>
                      <Progress
                        value={course.maxCapacity > 0 ? (course.enrolled / course.maxCapacity) * 100 : 0}
                        className="w-16 h-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        {course.maxCapacity > 0 
                          ? Math.round((course.enrolled / course.maxCapacity) * 100)
                          : 0}% full
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {course.virtualClassroom && (
                        <Badge variant="outline" className="text-xs">
                          <Video className="h-3 w-3 mr-1" />
                          Virtual
                        </Badge>
                      )}
                      {course.adaptiveLearning && (
                        <Badge variant="outline" className="text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          Adaptive
                        </Badge>
                      )}
                      {course.proctoring && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Proctored
                        </Badge>
                      )}
                      {course.gamificationEnabled && (
                        <Badge variant="outline" className="text-xs">
                          <Gamepad2 className="h-3 w-3 mr-1" />
                          Gamified
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === "Active"
                          ? "default"
                          : course.status === "Draft"
                          ? "secondary"
                          : course.status === "Published"
                          ? "default"
                          : "outline"
                      }
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewCourse(course)}
                        title="View Course Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
