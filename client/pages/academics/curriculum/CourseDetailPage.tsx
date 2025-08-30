import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft, BookOpen, Target, Award, Network, Clock, Calculator,
  FileText, Users, CheckCircle, TrendingUp, BarChart3, Globe,
  Layers, Code, PenTool, Workflow, Map
} from 'lucide-react';

interface Subject {
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
  description?: string;
  syllabus?: string[];
  textbooks?: string[];
  references?: string[];
}

interface CourseOutcome {
  id: string;
  code: string;
  description: string;
  subjectId: string;
  bloomsLevel: string;
  assessmentMethods: string[];
  weightage: number;
}

interface ProgramOutcome {
  id: string;
  code: string;
  description: string;
  programId: string;
  category: string;
  level: string;
}

interface COPOMapping {
  courseOutcomeId: string;
  programOutcomeId: string;
  correlationLevel: 1 | 2 | 3;
  justification: string;
}

// Function to get real course data for ECE program
const getRealCourseData = (courseId: string, programId: string): Subject | null => {
  const semester5Subjects: Subject[] = [
    {
      id: "SUB501",
      code: "1040235130",
      name: "Advanced Communication Systems",
      type: "Practicum",
      credits: 3,
      lectureHours: 2,
      tutorialHours: 0,
      practicalHours: 2,
      semester: 5,
      regulationYear: "R2024",
      programId: programId,
      prerequisites: [],
      courseOutcomes: ["CO511", "CO512", "CO513"],
      category: "Program Core",
      marks: 100,
      status: "active",
      description: "Covers the fundamentals of advanced communication techniques and practical implementations.",
      syllabus: [
        "Module 1: Communication Theory",
        "Module 2: Digital Modulation",
        "Module 3: Multiplexing Techniques",
        "Module 4: Error Control Coding",
        "Module 5: Case Studies"
      ],
      textbooks: ["Digital and Analog Communication Systems - Leon W. Couch", "Communication Systems - Simon Haykin"],
      references: ["IEEE Transactions on Communications", "International Journal of Communication Systems"]
    },
    {
      id: "SUB502",
      code: "1040235230",
      name: "Mobile Communication",
      type: "Practicum",
      credits: 3,
      lectureHours: 2,
      tutorialHours: 0,
      practicalHours: 2,
      semester: 5,
      regulationYear: "R2024",
      programId: programId,
      prerequisites: [],
      courseOutcomes: ["CO521", "CO522", "CO523"],
      category: "Program Core",
      marks: 100,
      status: "active",
      description: "Introduction to mobile communication systems, cellular technologies and applications.",
      syllabus: [
        "Module 1: Cellular Concepts",
        "Module 2: GSM and CDMA Systems",
        "Module 3: LTE and 5G Networks",
        "Module 4: Mobile Data Services",
        "Module 5: Case Studies"
      ],
      textbooks: ["Mobile Communications - Jochen Schiller", "Wireless Communications - Theodore Rappaport"],
      references: ["IEEE Transactions on Mobile Computing", "Wireless Personal Communications Journal"]
    },
    {
      id: "SUB504",
      code: "1040235440",
      name: "Embedded Systems",
      type: "Practicum",
      credits: 4,
      lectureHours: 2,
      tutorialHours: 0,
      practicalHours: 4,
      semester: 5,
      regulationYear: "R2024",
      programId: programId,
      prerequisites: [],
      courseOutcomes: ["CO541", "CO542", "CO543"],
      category: "Program Core",
      marks: 100,
      status: "active",
      description: "Introduction to embedded system design and real-time applications.",
      syllabus: [
        "Module 1: Embedded System Basics",
        "Module 2: Microcontrollers",
        "Module 3: Real-Time Operating Systems",
        "Module 4: Interfaces and Peripherals",
        "Module 5: Case Studies"
      ],
      textbooks: ["Embedded Systems - Raj Kamal", "Introduction to Embedded Systems - Shibu K V"],
      references: ["IEEE Embedded Systems Letters", "Microprocessors and Microsystems Journal"]
    }
  ];

  return semester5Subjects.find(course => course.id === courseId) || null;
};

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Subject | null>(null);
  const [courseOutcomes, setCourseOutcomes] = useState<CourseOutcome[]>([]);
  const [programOutcomes, setProgramOutcomes] = useState<ProgramOutcome[]>([]);
  const [copoMappings, setCOPOMappings] = useState<COPOMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        // First try to get real course data
        let actualCourse = getRealCourseData(courseId || '', 'C025');

        let sampleCourse: Subject;

        if (actualCourse) {
          // Use the real course data
          sampleCourse = actualCourse;
        } else {
          // Fallback to generate sample course data based on courseId
          const semester = parseInt(courseId?.match(/SUB(\d+)/)?.[1] || '1');
          const courseNumber = parseInt(courseId?.match(/SUB\d(\d+)/)?.[1] || '1');

          sampleCourse = {
            id: courseId || '',
            code: `2CS${semester}0${courseNumber}`,
            name: courseNumber === 1 ? `Mathematics - ${semester}` :
                  courseNumber === 2 ? `Computer Science - ${semester}` :
                  courseNumber === 3 ? `Programming Lab - ${semester}` :
                  courseNumber === 4 ? `Electrical Engineering - ${semester}` :
                  `Humanities - ${semester}`,
            type: courseNumber === 3 ? 'Lab' : 'Theory',
            credits: courseNumber === 1 ? 4 : courseNumber === 3 ? 2 : 3,
            lectureHours: courseNumber === 3 ? 0 : 3,
            tutorialHours: courseNumber === 1 ? 1 : 0,
            practicalHours: courseNumber === 3 ? 4 : 0,
            semester: semester,
            regulationYear: 'R2024',
            programId: 'C025',
            prerequisites: semester > 1 ? [`SUB${semester-1}00${courseNumber}`] : [],
            courseOutcomes: [`CO${semester}${courseNumber}1`, `CO${semester}${courseNumber}2`, `CO${semester}${courseNumber}3`],
            category: courseNumber <= 2 ? 'Core' : courseNumber === 3 ? 'Professional Core' : courseNumber === 4 ? 'Professional Elective' : 'Mandatory',
            marks: 100,
            status: 'active',
            description: `This course covers fundamental concepts and applications in ${
              courseNumber === 1 ? 'mathematics including calculus, linear algebra, and differential equations' :
              courseNumber === 2 ? 'computer science including algorithms, data structures, and programming paradigms' :
              courseNumber === 3 ? 'practical programming with hands-on laboratory sessions' :
              courseNumber === 4 ? 'electrical engineering principles and circuit analysis' :
              'humanities including communication skills and ethics'
            }.`,
            syllabus: [
              'Module 1: Introduction and Basic Concepts',
              'Module 2: Core Principles and Theories',
              'Module 3: Advanced Topics and Applications',
              'Module 4: Problem Solving and Case Studies',
              'Module 5: Current Trends and Future Directions'
            ],
            textbooks: [
              'Primary Textbook: Advanced Concepts in the Subject Area',
              'Secondary Reference: Practical Applications and Examples'
            ],
            references: [
              'IEEE Standards and Guidelines',
              'International Journal Publications',
              'Industry Best Practices Documentation'
            ]
          };
        }
        
        setCourse(sampleCourse);
        
        // Generate Course Outcomes
        const sampleCOs: CourseOutcome[] = sampleCourse.courseOutcomes.map((co, index) => ({
          id: `${courseId}_CO${index + 1}`,
          code: co,
          description: `Students will be able to ${
            index === 0 ? 'understand and explain fundamental concepts' :
            index === 1 ? 'apply theoretical knowledge to solve practical problems' :
            'analyze and evaluate complex scenarios using learned principles'
          } related to ${sampleCourse.name}.`,
          subjectId: courseId || '',
          bloomsLevel: index === 0 ? 'Understand' : index === 1 ? 'Apply' : 'Analyze',
          assessmentMethods: index === 0 ? ['Written Exam', 'Quiz'] : 
                           index === 1 ? ['Assignment', 'Project'] : 
                           ['Case Study', 'Presentation'],
          weightage: index === 0 ? 40 : index === 1 ? 35 : 25
        }));
        setCourseOutcomes(sampleCOs);
        
        // Generate Program Outcomes
        const samplePOs: ProgramOutcome[] = [
          {
            id: 'PO1',
            code: 'PO1',
            description: 'Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.',
            programId: 'C025',
            category: 'Knowledge',
            level: 'Apply'
          },
          {
            id: 'PO2',
            code: 'PO2',
            description: 'Problem analysis: Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles.',
            programId: 'C025',
            category: 'Skills',
            level: 'Analyze'
          },
          {
            id: 'PO3',
            code: 'PO3',
            description: 'Design/development of solutions: Design solutions for complex engineering problems and design system components that meet specified needs.',
            programId: 'C025',
            category: 'Skills',
            level: 'Create'
          },
          {
            id: 'PO4',
            code: 'PO4',
            description: 'Conduct investigations of complex problems: Use research-based knowledge and research methods including design of experiments to provide valid conclusions.',
            programId: 'C025',
            category: 'Research',
            level: 'Evaluate'
          },
          {
            id: 'PO5',
            code: 'PO5',
            description: 'Modern tool usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools to complex engineering activities.',
            programId: 'C025',
            category: 'Tools',
            level: 'Apply'
          },
          {
            id: 'PO6',
            code: 'PO6',
            description: 'The engineer and society: Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues.',
            programId: 'C025',
            category: 'Professional',
            level: 'Apply'
          }
        ];
        setProgramOutcomes(samplePOs);
        
        // Generate CO-PO Mappings
        const sampleMappings: COPOMapping[] = [];
        sampleCOs.forEach(co => {
          samplePOs.forEach(po => {
            const correlationLevel = Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3;
            if (correlationLevel > 1) {
              sampleMappings.push({
                courseOutcomeId: co.id,
                programOutcomeId: po.id,
                correlationLevel,
                justification: `${co.code} contributes to ${po.code} through ${
                  correlationLevel === 3 ? 'direct and comprehensive application' :
                  correlationLevel === 2 ? 'moderate application and understanding' :
                  'basic awareness and foundation building'
                } of the learning outcomes.`
              });
            }
          });
        });
        setCOPOMappings(sampleMappings);
        
      } catch (error) {
        console.error('Error loading course data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

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

  const getBloomsColor = (level: string) => {
    switch (level) {
      case 'Remember':
        return 'bg-red-100 text-red-800';
      case 'Understand':
        return 'bg-orange-100 text-orange-800';
      case 'Apply':
        return 'bg-yellow-100 text-yellow-800';
      case 'Analyze':
        return 'bg-green-100 text-green-800';
      case 'Evaluate':
        return 'bg-blue-100 text-blue-800';
      case 'Create':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCorrelationColor = (level: number) => {
    switch (level) {
      case 3:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 1:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBackToSemester = () => {
    if (course) {
      navigate(`/academics/curriculum/program-semester/${course.programId}`);
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
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Curriculum
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Course not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToSemester}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Semester
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
            <p className="text-muted-foreground">Course Details and Outcome Mapping</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Course Code</p>
          <p className="text-xl font-mono font-semibold">{course.code}</p>
        </div>
      </div>

      {/* Course Information Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-blue-600">Type & Category</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{course.type}</Badge>
                <Badge variant="outline" className={getCategoryColor(course.category)}>
                  {course.category}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Credits & Hours</p>
              <p className="text-xl font-bold text-green-900">{course.credits} Credits</p>
              <p className="text-sm text-green-600">L-T-P: {course.lectureHours}-{course.tutorialHours}-{course.practicalHours}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">Semester</p>
              <p className="text-xl font-bold text-purple-900">Semester {course.semester}</p>
              <p className="text-sm text-purple-600">{course.regulationYear}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600">Assessment</p>
              <p className="text-xl font-bold text-orange-900">{course.marks}</p>
              <p className="text-sm text-orange-600">Total Marks</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="outcomes">Course Outcomes</TabsTrigger>
          <TabsTrigger value="mapping">CO-PO Mapping</TabsTrigger>
          <TabsTrigger value="analysis">OBE Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
                
                {course.prerequisites.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.prerequisites.map((prereq) => (
                        <Badge key={prereq} variant="outline" className="bg-yellow-50">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Course Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Course Outcomes</span>
                    <span className="text-sm text-gray-600">{courseOutcomes.length}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CO-PO Mappings</span>
                    <span className="text-sm text-gray-600">{copoMappings.length}</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Assessment Coverage</span>
                    <span className="text-sm text-gray-600">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Syllabus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Course Syllabus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Modules</h4>
                  <ul className="space-y-2">
                    {course.syllabus?.map((module, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{module}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">References</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-blue-600">Textbooks</h5>
                      <ul className="space-y-1 mt-1">
                        {course.textbooks?.map((book, index) => (
                          <li key={index} className="text-sm text-gray-600">{book}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-green-600">References</h5>
                      <ul className="space-y-1 mt-1">
                        {course.references?.map((ref, index) => (
                          <li key={index} className="text-sm text-gray-600">{ref}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Course Outcomes (COs)
              </CardTitle>
              <CardDescription>
                Specific learning outcomes that students should achieve upon completing this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {courseOutcomes.map((co) => (
                  <Card key={co.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{co.code}</h4>
                          <p className="text-gray-700 mt-2">{co.description}</p>
                        </div>
                        <Badge variant="outline" className={getBloomsColor(co.bloomsLevel)}>
                          {co.bloomsLevel}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h5 className="font-medium text-sm text-gray-900 mb-2">Assessment Methods</h5>
                          <div className="flex flex-wrap gap-2">
                            {co.assessmentMethods.map((method) => (
                              <Badge key={method} variant="outline" className="bg-blue-50">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm text-gray-900 mb-2">Weightage</h5>
                          <div className="flex items-center gap-2">
                            <Progress value={co.weightage} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{co.weightage}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-blue-600" />
                    CO-PO Mapping Matrix
                  </CardTitle>
                  <CardDescription>
                    Correlation between Course Outcomes and Program Outcomes
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getCorrelationColor(3)}>High (3)</Badge>
                  <Badge variant="outline" className={getCorrelationColor(2)}>Medium (2)</Badge>
                  <Badge variant="outline" className={getCorrelationColor(1)}>Low (1)</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left min-w-24">CO</th>
                      {programOutcomes.map((po) => (
                        <th key={po.id} className="border border-gray-300 p-3 text-center min-w-16">
                          {po.code}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {courseOutcomes.map((co) => (
                      <tr key={co.id}>
                        <td className="border border-gray-300 p-3 font-medium bg-gray-50">{co.code}</td>
                        {programOutcomes.map((po) => {
                          const mapping = copoMappings.find(
                            m => m.courseOutcomeId === co.id && m.programOutcomeId === po.id
                          );
                          return (
                            <td key={po.id} className="border border-gray-300 p-3 text-center">
                              {mapping && (
                                <Badge
                                  variant="outline"
                                  className={getCorrelationColor(mapping.correlationLevel)}
                                >
                                  {mapping.correlationLevel}
                                </Badge>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Program Outcomes Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-600" />
                Program Outcomes (POs)
              </CardTitle>
              <CardDescription>Graduate attributes and program learning outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {programOutcomes.map((po) => (
                  <Card key={po.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{po.code}</h4>
                            <Badge variant="outline" className="text-xs">{po.category}</Badge>
                            <Badge variant="outline" className={getBloomsColor(po.level)} size="sm">
                              {po.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700">{po.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OBE Implementation Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  OBE Implementation
                </CardTitle>
                <CardDescription>Outcome-based education implementation status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Course Outcomes Defined</span>
                      <span className="text-sm text-gray-600">{courseOutcomes.length}/5</span>
                    </div>
                    <Progress value={(courseOutcomes.length / 5) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Assessment Methods Mapped</span>
                      <span className="text-sm text-gray-600">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">CO-PO Correlation</span>
                      <span className="text-sm text-gray-600">{copoMappings.length}</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Bloom's Taxonomy Coverage</span>
                      <span className="text-sm text-gray-600">3/6 levels</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Assessment Distribution
                </CardTitle>
                <CardDescription>Weightage distribution across course outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courseOutcomes.map((co) => (
                    <div key={co.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{co.code}</span>
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        <Progress value={co.weightage} className="flex-1 h-2" />
                        <span className="text-sm text-gray-600 min-w-12">{co.weightage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Assessment Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Weightage:</span>
                      <span className="font-medium ml-2">
                        {courseOutcomes.reduce((sum, co) => sum + co.weightage, 0)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg. per CO:</span>
                      <span className="font-medium ml-2">
                        {Math.round(courseOutcomes.reduce((sum, co) => sum + co.weightage, 0) / courseOutcomes.length)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Correlation Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-purple-600" />
                Correlation Analysis
              </CardTitle>
              <CardDescription>Analysis of CO-PO correlation strengths</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {copoMappings.filter(m => m.correlationLevel === 3).length}
                  </div>
                  <p className="text-sm text-gray-600">High Correlation</p>
                  <p className="text-xs text-gray-500">Strong alignment</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {copoMappings.filter(m => m.correlationLevel === 2).length}
                  </div>
                  <p className="text-sm text-gray-600">Medium Correlation</p>
                  <p className="text-xs text-gray-500">Moderate alignment</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {copoMappings.filter(m => m.correlationLevel === 1).length}
                  </div>
                  <p className="text-sm text-gray-600">Low Correlation</p>
                  <p className="text-xs text-gray-500">Basic alignment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
