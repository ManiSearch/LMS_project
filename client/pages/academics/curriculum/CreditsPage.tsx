import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Eye, BookOpen, Clock, Users } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  type: 'Theory' | 'Practical' | 'Lab' | 'Project';
  credits: number;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  semester: number;
  regulationYear: string;
  programId: string;
  prerequisites: string[];
  courseOutcomes: string[];
  category: 'Core' | 'Professional Core' | 'Professional Elective' | 'Open Elective' | 'Mandatory';
  marks: number;
  status: 'active' | 'inactive' | 'draft';
}

export default function CoursesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading course data
    const loadCourse = async () => {
      try {
        // Generate sample course data based on ID
        const sampleCourse: Course = {
          id: id || 'SUB8001',
          code: `2CS${id?.slice(-1) || '8'}01`,
          name: `Computer Science Course ${id?.slice(-1) || '8'}`,
          type: 'Theory',
          credits: 4,
          lectureHours: 3,
          tutorialHours: 1,
          practicalHours: 0,
          semester: parseInt(id?.slice(-1) || '8'),
          regulationYear: 'R2024',
          programId: 'C005',
          prerequisites: [],
          courseOutcomes: ['CO1', 'CO2', 'CO3'],
          category: 'Professional Core',
          marks: 100,
          status: 'active'
        };
        
        setCourse(sampleCourse);
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core':
        return 'bg-blue-100 text-blue-800';
      case 'Professional Core':
        return 'bg-green-100 text-green-800';
      case 'Professional Elective':
        return 'bg-purple-100 text-purple-800';
      case 'Open Elective':
        return 'bg-orange-100 text-orange-800';
      case 'Mandatory':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading course details...</div>;
  }

  if (!course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/academics/curriculum')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Curriculum
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Course not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/academics/curriculum')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Curriculum
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Details</h1>
            <p className="text-muted-foreground">{course.code} - {course.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Course
          </Button>
          <Button>
            <Eye className="h-4 w-4 mr-2" />
            View Syllabus
          </Button>
        </div>
      </div>

      {/* Course Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Course Code</p>
                <p className="font-mono">{course.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Course Name</p>
                <p className="font-medium">{course.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Type</p>
                <Badge variant="outline">{course.type}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Category</p>
                <Badge variant="outline" className={getCategoryColor(course.category)}>
                  {course.category}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Semester</p>
                <p>{course.semester}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Regulation</p>
                <p>{course.regulationYear}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Credit & Hours Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-blue-600">{course.credits}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Maximum Marks</p>
                <p className="text-2xl font-bold text-green-600">{course.marks}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Lecture Hours</p>
                <p>{course.lectureHours}/week</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tutorial Hours</p>
                <p>{course.tutorialHours}/week</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Practical Hours</p>
                <p>{course.practicalHours}/week</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">L-T-P Structure</p>
                <p className="font-mono">{course.lectureHours}-{course.tutorialHours}-{course.practicalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Course Outcomes
          </CardTitle>
          <CardDescription>
            Learning outcomes that students should achieve upon completion of this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {course.courseOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Badge variant="outline" className="mt-0.5">{outcome}</Badge>
                <div>
                  <p className="font-medium">Course Outcome {index + 1}</p>
                  <p className="text-sm text-gray-600">
                    Students will be able to understand and apply concepts from {course.name.toLowerCase()}.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      {course.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
            <CardDescription>
              Courses that must be completed before taking this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {course.prerequisites.map((prereq, index) => (
                <Badge key={index} variant="outline">{prereq}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
