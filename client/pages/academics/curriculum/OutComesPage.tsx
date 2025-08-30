import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Eye, Target, BookOpen } from 'lucide-react';

interface CourseOutcome {
  id: string;
  code: string;
  description: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  bloomsLevel: string;
  assessmentMethods: string[];
  programOutcomes: string[];
}

export default function OutcomesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outcome, setOutcome] = useState<CourseOutcome | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading outcome data
    const loadOutcome = async () => {
      try {
        // Generate sample outcome data based on ID
        const sampleOutcome: CourseOutcome = {
          id: id || 'CO001',
          code: `CO${id?.slice(-1) || '1'}`,
          description: `Students will be able to understand and apply fundamental concepts of ${id?.includes('MA') ? 'Mathematics' : 'Computer Science'}.`,
          subjectId: 'SUB8001',
          subjectName: 'Advanced Computer Science',
          subjectCode: '2CS801',
          bloomsLevel: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'][Math.floor(Math.random() * 6)],
          assessmentMethods: ['Written Exam', 'Practical Exam', 'Assignment', 'Project'],
          programOutcomes: ['PO1', 'PO2', 'PO3']
        };
        
        setOutcome(sampleOutcome);
      } catch (error) {
        console.error('Error loading outcome:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOutcome();
  }, [id]);

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

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading outcome details...</div>;
  }

  if (!outcome) {
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
            <p className="text-center text-gray-500">Course outcome not found</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Course Outcome Details</h1>
            <p className="text-muted-foreground">{outcome.code} - {outcome.subjectName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Outcome
          </Button>
          <Button>
            <Eye className="h-4 w-4 mr-2" />
            View Mapping
          </Button>
        </div>
      </div>

      {/* Outcome Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Outcome Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Outcome Code</p>
              <p className="font-mono text-lg">{outcome.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Subject</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{outcome.subjectName}</p>
                <Badge variant="outline">{outcome.subjectCode}</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Bloom's Taxonomy Level</p>
              <Badge variant="outline" className={getBloomsColor(outcome.bloomsLevel)}>
                {outcome.bloomsLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Assessment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {outcome.assessmentMethods.map((method, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{method}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outcome Description */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Outcome Description</CardTitle>
          <CardDescription>
            Detailed description of what students should achieve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{outcome.description}</p>
        </CardContent>
      </Card>

      {/* Program Outcome Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Program Outcome Mapping</CardTitle>
          <CardDescription>
            Program outcomes that this course outcome contributes to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {outcome.programOutcomes.map((po, index) => (
              <Badge key={index} variant="outline" className="bg-green-100 text-green-800">
                {po}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
