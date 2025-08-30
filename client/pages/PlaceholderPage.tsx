import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Construction, 
  MessageCircle, 
  BookOpen, 
  GraduationCap, 
  FileText,
  ArrowRight
} from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  module?: 'core' | 'academics' | 'lms' | 'exams';
}

const moduleInfo = {
  core: {
    icon: Construction,
    color: 'bg-slate-500',
    description: 'Core system management and configuration'
  },
  academics: {
    icon: BookOpen,
    color: 'bg-academics',
    description: 'Academic management and curriculum planning'
  },
  lms: {
    icon: GraduationCap,
    color: 'bg-lms',
    description: 'Learning management and course delivery'
  },
  exams: {
    icon: FileText,
    color: 'bg-exams',
    description: 'Examination planning and result management'
  }
};

export default function PlaceholderPage({ title, module = 'core' }: PlaceholderPageProps) {
  const moduleData = moduleInfo[module];
  const ModuleIcon = moduleData.icon;

  const upcomingFeatures = [
    'Interactive data tables with sorting and filtering',
    'Real-time notifications and alerts',
    'Advanced reporting and analytics',
    'Mobile-responsive design',
    'Role-based access controls',
    'Export functionality (PDF, Excel)',
    'Bulk operations and batch processing',
    'Integration with external systems'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${moduleData.color} text-white`}>
          <ModuleIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{moduleData.description}</p>
        </div>
        <Badge variant="outline" className="ml-auto">
          Coming Soon
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Construction className="h-5 w-5" />
              Under Development
            </CardTitle>
            <CardDescription>
              This page is currently being built. Check back soon for full functionality.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <ModuleIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">{title} Module</h3>
              <p className="text-sm text-muted-foreground">
                We're working hard to bring you a comprehensive {title.toLowerCase()} management experience.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Continue the conversation to prioritize which features to build next!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Planned Features */}
        <Card>
          <CardHeader>
            <CardTitle>Planned Features</CardTitle>
            <CardDescription>
              Here's what we're planning to include in the {title} module
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>What would you like to build first?</CardTitle>
          <CardDescription>
            Help us prioritize development by telling us which features are most important to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Data Management</span>
              <span className="text-xs text-muted-foreground">CRUD operations</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Construction className="h-6 w-6" />
              <span>Forms & Workflows</span>
              <span className="text-xs text-muted-foreground">Interactive forms</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span>Reports & Analytics</span>
              <span className="text-xs text-muted-foreground">Data visualization</span>
            </Button>
          </div>

          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              💡 <strong>Pro tip:</strong> Continue the conversation and tell me exactly what you'd like to see on this page. 
              I can build specific features, forms, tables, or workflows based on your requirements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
