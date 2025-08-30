import { useState } from 'react';
import { useFormHandler } from '@/hooks/useFormHandlers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { FileText, Plus, Edit3, Trash2, Move, Eye, Settings, Type, Calendar, Hash, Check, List } from 'lucide-react';
import { FormField } from '@/components/forms/FormField';

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea' | 'file';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: string;
  order: number;
  section: string;
}

interface RegistrationForm {
  id: string;
  name: string;
  description: string;
  program: string;
  academicYear: string;
  status: 'active' | 'inactive' | 'draft';
  fields: FormField[];
  submissions: number;
  createdAt: string;
}

const mockForms: RegistrationForm[] = [
  {
    id: '1',
    name: 'B.Tech CSE Registration 2024-25',
    description: 'Registration form for Bachelor of Technology in Computer Science Engineering',
    program: 'B.Tech CSE',
    academicYear: '2024-25',
    status: 'active',
    submissions: 245,
    createdAt: '2024-01-01',
    fields: [
      { id: '1', name: 'firstName', label: 'First Name', type: 'text', required: true, order: 1, section: 'Personal Information' },
      { id: '2', name: 'lastName', label: 'Last Name', type: 'text', required: true, order: 2, section: 'Personal Information' },
      { id: '3', name: 'email', label: 'Email Address', type: 'email', required: true, order: 3, section: 'Personal Information' },
      { id: '4', name: 'dob', label: 'Date of Birth', type: 'date', required: true, order: 4, section: 'Personal Information' },
      { id: '5', name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'], order: 5, section: 'Personal Information' },
      { id: '6', name: 'address', label: 'Address', type: 'textarea', required: true, order: 6, section: 'Contact Information' },
      { id: '7', name: 'phone', label: 'Phone Number', type: 'text', required: true, order: 7, section: 'Contact Information' },
      { id: '8', name: 'grade12', label: '12th Grade Percentage', type: 'number', required: true, order: 8, section: 'Academic Information' },
      { id: '9', name: 'documents', label: 'Upload Documents', type: 'file', required: true, order: 9, section: 'Documents' }
    ]
  },
  {
    id: '2',
    name: 'MBA Registration 2024-25',
    description: 'Registration form for Master of Business Administration',
    program: 'MBA',
    academicYear: '2024-25',
    status: 'active',
    submissions: 89,
    createdAt: '2024-01-01',
    fields: [
      { id: '10', name: 'firstName', label: 'First Name', type: 'text', required: true, order: 1, section: 'Personal Information' },
      { id: '11', name: 'lastName', label: 'Last Name', type: 'text', required: true, order: 2, section: 'Personal Information' },
      { id: '12', name: 'email', label: 'Email Address', type: 'email', required: true, order: 3, section: 'Personal Information' },
      { id: '13', name: 'workExperience', label: 'Work Experience (Years)', type: 'number', required: true, order: 4, section: 'Professional Information' },
      { id: '14', name: 'catScore', label: 'CAT Score', type: 'number', required: false, order: 5, section: 'Test Scores' }
    ]
  },
  {
    id: '3',
    name: 'B.Tech IT Registration 2024-25',
    description: 'Registration form for Bachelor of Technology in Information Technology',
    program: 'B.Tech IT',
    academicYear: '2024-25',
    status: 'active',
    submissions: 112,
    createdAt: '2024-01-03',
    fields: [
      { id: '15', name: 'firstName', label: 'First Name', type: 'text', required: true, order: 1, section: 'Personal Information' },
      { id: '16', name: 'lastName', label: 'Last Name', type: 'text', required: true, order: 2, section: 'Personal Information' },
      { id: '17', name: 'email', label: 'Email Address', type: 'email', required: true, order: 3, section: 'Personal Information' },
      { id: '18', name: 'dob', label: 'Date of Birth', type: 'date', required: true, order: 4, section: 'Personal Information' },
      { id: '19', name: 'jeeScore', label: 'JEE Main Score', type: 'number', required: false, order: 5, section: 'Test Scores' }
    ]
  },
  {
    id: '4',
    name: 'MCA Registration 2024-25',
    description: 'Registration form for Master of Computer Applications',
    program: 'MCA',
    academicYear: '2024-25',
    status: 'active',
    submissions: 75,
    createdAt: '2024-01-04',
    fields: [
      { id: '20', name: 'firstName', label: 'First Name', type: 'text', required: true, order: 1, section: 'Personal Info' },
      { id: '21', name: 'lastName', label: 'Last Name', type: 'text', required: true, order: 2, section: 'Personal Info' },
      { id: '22', name: 'email', label: 'Email Address', type: 'email', required: true, order: 3, section: 'Personal Info' },
      { id: '23', name: 'ugPercentage', label: 'Undergraduate Percentage', type: 'number', required: true, order: 4, section: 'Academic Info' },
      { id: '24', name: 'tancetScore', label: 'TANCET Score', type: 'number', required: false, order: 5, section: 'Test Scores' }
    ]
  },
  {
    id: '5',
    name: 'B.Sc Physics Registration 2024-25',
    description: 'Form for B.Sc Physics Undergraduate Admission',
    program: 'B.Sc Physics',
    academicYear: '2024-25',
    status: 'active',
    submissions: 68,
    createdAt: '2024-01-05',
    fields: [
      { id: '25', name: 'firstName', label: 'First Name', type: 'text', required: true, order: 1, section: 'Personal Info' },
      { id: '26', name: 'lastName', label: 'Last Name', type: 'text', required: true, order: 2, section: 'Personal Info' },
      { id: '27', name: 'email', label: 'Email Address', type: 'email', required: true, order: 3, section: 'Personal Info' },
      { id: '28', name: 'hscMarks', label: 'HSC Marks (%)', type: 'number', required: true, order: 4, section: 'Academic Info' },
      { id: '29', name: 'preferredLab', label: 'Preferred Lab Session', type: 'dropdown', required: false, order: 5, section: 'Preferences' }
    ]
  },
  {
    id: '6',
    name: 'M.Com Admission Form 2024-25',
    description: 'Admission form for Master of Commerce program',
    program: 'M.Com',
    academicYear: '2024-25',
    status: 'active',
    submissions: 54,
    createdAt: '2024-01-06',
    fields: [
      { id: '30', name: 'firstName', label: 'First Name', type: 'text', required: true, order: 1, section: 'Personal Details' },
      { id: '31', name: 'lastName', label: 'Last Name', type: 'text', required: true, order: 2, section: 'Personal Details' },
      { id: '32', name: 'email', label: 'Email', type: 'email', required: true, order: 3, section: 'Personal Details' },
      { id: '33', name: 'ugSpecialization', label: 'UG Specialization', type: 'text', required: true, order: 4, section: 'Education' },
      { id: '34', name: 'internshipExperience', label: 'Internship Experience', type: 'textarea', required: false, order: 5, section: 'Experience' }
    ]
  },
  {
    id: '7',
    name: 'BBA Registration 2024-25',
    description: 'Registration form for Bachelor of Business Administration',
    program: 'BBA',
    academicYear: '2024-25',
    status: 'active',
    submissions: 95,
    createdAt: '2024-01-07',
    fields: [
      { id: '35', name: 'firstName', label: 'First Name', type: 'text', required: true, order: 1, section: 'Personal Info' },
      { id: '36', name: 'lastName', label: 'Last Name', type: 'text', required: true, order: 2, section: 'Personal Info' },
      { id: '37', name: 'email', label: 'Email Address', type: 'email', required: true, order: 3, section: 'Contact Info' },
      { id: '38', name: '12thMarks', label: '12th Grade Marks (%)', type: 'number', required: true, order: 4, section: 'Academic Info' },
      { id: '39', name: 'preferredLanguage', label: 'Preferred Language', type: 'dropdown', required: false, order: 5, section: 'Preferences' }
    ]
  },
  {
    id: '8',
    name: 'M.Sc Chemistry Registration 2024-25',
    description: 'Postgraduate application form for M.Sc Chemistry',
    program: 'M.Sc Chemistry',
    academicYear: '2024-25',
    status: 'active',
    submissions: 61,
    createdAt: '2024-01-08',
    fields: [
      { id: '40', name: 'firstName', label: 'First Name', type: 'text', required: true, order: 1, section: 'Personal Info' },
      { id: '41', name: 'lastName', label: 'Last Name', type: 'text', required: true, order: 2, section: 'Personal Info' },
      { id: '42', name: 'email', label: 'Email Address', type: 'email', required: true, order: 3, section: 'Contact Info' },
      { id: '43', name: 'ugScore', label: 'Undergraduate Score (%)', type: 'number', required: true, order: 4, section: 'Academic Info' },
      { id: '44', name: 'labExperience', label: 'Lab Experience Description', type: 'textarea', required: false, order: 5, section: 'Experience' }
    ]
  },
  {
    id: '9',
    name: 'B.Com Registration 2024-25',
    description: 'Undergraduate commerce admission form',
    program: 'B.Com',
    academicYear: '2024-25',
    status: 'active',
    submissions: 102,
    createdAt: '2024-01-09',
    fields: [
      { id: '45', name: 'firstName', label: 'First Name', type: 'text', required: true, order: 1, section: 'Personal' },
      { id: '46', name: 'lastName', label: 'Last Name', type: 'text', required: true, order: 2, section: 'Personal' },
      { id: '47', name: 'email', label: 'Email', type: 'email', required: true, order: 3, section: 'Contact' },
      { id: '48', name: 'stream', label: 'Stream in 12th', type: 'text', required: true, order: 4, section: 'Academic' },
      { id: '49', name: 'sportsQuota', label: 'Applying under Sports Quota', type: 'checkbox', required: false, order: 5, section: 'Quota' }
    ]
  },
  {
    id: '10',
    name: 'PhD Application Form 2024-25',
    description: 'Doctoral program application form',
    program: 'PhD',
    academicYear: '2024-25',
    status: 'active',
    submissions: 28,
    createdAt: '2024-01-10',
    fields: [
      { id: '50', name: 'firstName', label: 'First Name', type: 'text', required: true, order: 1, section: 'Basic Info' },
      { id: '51', name: 'lastName', label: 'Last Name', type: 'text', required: true, order: 2, section: 'Basic Info' },
      { id: '52', name: 'email', label: 'Email Address', type: 'email', required: true, order: 3, section: 'Contact' },
      { id: '53', name: 'researchProposal', label: 'Research Proposal Summary', type: 'textarea', required: true, order: 4, section: 'Proposal' },
      { id: '54', name: 'guidePreference', label: 'Preferred Research Guide', type: 'text', required: false, order: 5, section: 'Preferences' }
    ]
  }

];

const fieldTypeIcons: Record<string, any> = {
  text: Type,
  email: Type,
  number: Hash,
  date: Calendar,
  select: List,
  checkbox: Check,
  textarea: Type,
  file: FileText
};

export default function RegistrationFormSetup() {
  const [forms, setForms] = useState<RegistrationForm[]>(mockForms);
  const [selectedForm, setSelectedForm] = useState<string>('1');
  const [isCreateFormModalOpen, setIsCreateFormModalOpen] = useState(false);
  const [isCreateFieldModalOpen, setIsCreateFieldModalOpen] = useState(false);
  const [isEditFieldModalOpen, setIsEditFieldModalOpen] = useState(false);
  const [isDeleteFieldModalOpen, setIsDeleteFieldModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [activeTab, setActiveTab] = useState('forms');

  const formHandler = useFormHandler(
    ['name', 'description', 'program', 'academicYear'],
    {
      name: '',
      description: '',
      program: '',
      academicYear: '2024-25'
    }
  );

  const fieldHandler = useFormHandler(
    ['name', 'label', 'type', 'required', 'placeholder', 'options', 'section'],
    {
      name: '',
      label: '',
      type: 'text',
      required: 'true',
      placeholder: '',
      options: '',
      section: 'Personal Information'
    }
  );

  // Helper functions
  const getFormData = (handler: any) => {
    return Object.keys(handler.formState).reduce((acc, key) => {
      acc[key] = handler.formState[key].value;
      return acc;
    }, {} as Record<string, any>);
  };

  const getFormErrors = (handler: any) => {
    return Object.keys(handler.formState).reduce((acc, key) => {
      acc[key] = handler.formState[key].error;
      return acc;
    }, {} as Record<string, any>);
  };

  const handleInputChange = (handler: any) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handler.updateField(e.target.name, e.target.value);
  };

  const handleSubmit = (handler: any, onSubmit: (data: any) => Promise<void>) => (e: React.FormEvent) => {
    e.preventDefault();
    handler.submitForm(onSubmit);
  };

  const onCreateForm = async (data: any) => {
    const newForm: RegistrationForm = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      program: data.program,
      academicYear: data.academicYear,
      status: 'draft',
      submissions: 0,
      createdAt: new Date().toISOString(),
      fields: []
    };

    setForms(prev => [newForm, ...prev]);
    setIsCreateFormModalOpen(false);
    formHandler.resetForm();
  };

  const onCreateField = async (data: any) => {
    const selectedFormData = forms.find(f => f.id === selectedForm);
    if (!selectedFormData) return;

    const newField: FormField = {
      id: Date.now().toString(),
      name: data.name,
      label: data.label,
      type: data.type as FormField['type'],
      required: data.required === 'true',
      placeholder: data.placeholder,
      options: data.options ? data.options.split(',').map((o: string) => o.trim()) : undefined,
      order: selectedFormData.fields.length + 1,
      section: data.section
    };

    setForms(prev => prev.map(form => 
      form.id === selectedForm 
        ? { ...form, fields: [...form.fields, newField] }
        : form
    ));

    setIsCreateFieldModalOpen(false);
    fieldHandler.resetForm();
  };

  const handleEditField = (field: FormField) => {
    setSelectedField(field);
    fieldHandler.updateFields({
      name: field.name,
      label: field.label,
      type: field.type,
      required: field.required.toString(),
      placeholder: field.placeholder || '',
      options: field.options?.join(', ') || '',
      section: field.section
    });
    setIsEditFieldModalOpen(true);
  };

  const onUpdateField = async (data: any) => {
    if (!selectedField) return;

    const updatedField: FormField = {
      ...selectedField,
      name: data.name,
      label: data.label,
      type: data.type as FormField['type'],
      required: data.required === 'true',
      placeholder: data.placeholder,
      options: data.options ? data.options.split(',').map((o: string) => o.trim()) : undefined,
      section: data.section
    };

    setForms(prev => prev.map(form =>
      form.id === selectedForm
        ? {
            ...form,
            fields: form.fields.map(f => f.id === selectedField.id ? updatedField : f)
          }
        : form
    ));

    setIsEditFieldModalOpen(false);
    setSelectedField(null);
    fieldHandler.resetForm();
  };

  const handleDeleteField = (field: FormField) => {
    setSelectedField(field);
    setIsDeleteFieldModalOpen(true);
  };

  const confirmDeleteField = () => {
    if (!selectedField) return;

    setForms(prev => prev.map(form =>
      form.id === selectedForm
        ? {
            ...form,
            fields: form.fields.filter(f => f.id !== selectedField.id)
          }
        : form
    ));

    setIsDeleteFieldModalOpen(false);
    setSelectedField(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const groupFieldsBySection = (fields: FormField[]) => {
    const grouped: Record<string, FormField[]> = {};
    fields.forEach(field => {
      if (!grouped[field.section]) {
        grouped[field.section] = [];
      }
      grouped[field.section].push(field);
    });
    
    // Sort fields within each section by order
    Object.keys(grouped).forEach(section => {
      grouped[section].sort((a, b) => a.order - b.order);
    });
    
    return grouped;
  };

  const selectedFormData = forms.find(f => f.id === selectedForm);
  const groupedFields = selectedFormData ? groupFieldsBySection(selectedFormData.fields) : {};

  const stats = {
    totalForms: forms.length,
    activeForms: forms.filter(f => f.status === 'active').length,
    totalSubmissions: forms.reduce((sum, f) => sum + f.submissions, 0),
    totalFields: forms.reduce((sum, f) => sum + f.fields.length, 0)
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registration Form Setup</h1>
          <p className="text-muted-foreground mt-2">
            Create dynamic student registration templates with custom fields
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateFieldModalOpen} onOpenChange={setIsCreateFieldModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={!selectedFormData}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Add Form Field
                </DialogTitle>
                <DialogDescription>
                  Add a new field to the selected registration form.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(fieldHandler, onCreateField)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Field Name"
                    name="name"
                    value={getFormData(fieldHandler).name}
                    onChange={handleInputChange(fieldHandler)}
                    error={getFormErrors(fieldHandler).name}
                    placeholder="firstName"
                    required
                  />
                  <FormField
                    label="Field Label"
                    name="label"
                    value={getFormData(fieldHandler).label}
                    onChange={handleInputChange(fieldHandler)}
                    error={getFormErrors(fieldHandler).label}
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Field Type"
                    name="type"
                    type="select"
                    value={getFormData(fieldHandler).type}
                    onChange={handleInputChange(fieldHandler)}
                    error={getFormErrors(fieldHandler).type}
                    options={[
                      { label: 'Text', value: 'text' },
                      { label: 'Email', value: 'email' },
                      { label: 'Number', value: 'number' },
                      { label: 'Date', value: 'date' },
                      { label: 'Select', value: 'select' },
                      { label: 'Checkbox', value: 'checkbox' },
                      { label: 'Textarea', value: 'textarea' },
                      { label: 'File', value: 'file' }
                    ]}
                    required
                  />
                  <FormField
                    label="Required"
                    name="required"
                    type="select"
                    value={getFormData(fieldHandler).required}
                    onChange={handleInputChange(fieldHandler)}
                    error={getFormErrors(fieldHandler).required}
                    options={[
                      { label: 'Yes', value: 'true' },
                      { label: 'No', value: 'false' }
                    ]}
                    required
                  />
                </div>
                <FormField
                  label="Section"
                  name="section"
                  value={getFormData(fieldHandler).section}
                  onChange={handleInputChange(fieldHandler)}
                  error={getFormErrors(fieldHandler).section}
                  placeholder="Personal Information"
                  required
                />
                <FormField
                  label="Placeholder"
                  name="placeholder"
                  value={getFormData(fieldHandler).placeholder}
                  onChange={handleInputChange(fieldHandler)}
                  error={getFormErrors(fieldHandler).placeholder}
                  placeholder="Enter your first name"
                />
                {getFormData(fieldHandler).type === 'select' && (
                  <FormField
                    label="Options (comma-separated)"
                    name="options"
                    value={getFormData(fieldHandler).options}
                    onChange={handleInputChange(fieldHandler)}
                    error={getFormErrors(fieldHandler).options}
                    placeholder="Option 1, Option 2, Option 3"
                  />
                )}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsCreateFieldModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={fieldHandler.isSubmitting}>
                    Add Field
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateFormModalOpen} onOpenChange={setIsCreateFormModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Form
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Create Registration Form
                </DialogTitle>
                <DialogDescription>
                  Create a new registration form template for a program.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(formHandler, onCreateForm)} className="space-y-4">
                <FormField
                  label="Form Name"
                  name="name"
                  value={getFormData(formHandler).name}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).name}
                  placeholder="B.Tech CSE Registration 2024-25"
                  required
                />
                <FormField
                  label="Description"
                  name="description"
                  type="textarea"
                  value={getFormData(formHandler).description}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).description}
                  placeholder="Registration form description..."
                  rows={3}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Program"
                    name="program"
                    value={getFormData(formHandler).program}
                    onChange={handleInputChange(formHandler)}
                    error={getFormErrors(formHandler).program}
                    placeholder="B.Tech CSE"
                    required
                  />
                  <FormField
                    label="Academic Year"
                    name="academicYear"
                    value={getFormData(formHandler).academicYear}
                    onChange={handleInputChange(formHandler)}
                    error={getFormErrors(formHandler).academicYear}
                    placeholder="2024-25"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsCreateFormModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={formHandler.isSubmitting}>
                    Create Form
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Forms</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalForms}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Forms</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeForms}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Submissions</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalSubmissions}</p>
              </div>
              <Hash className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Fields</p>
                <p className="text-3xl font-bold text-orange-900">{stats.totalFields}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Registration Forms
              </CardTitle>
              <CardDescription>
                Select a form to manage fields
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 p-4">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedForm === form.id
                        ? 'bg-blue-50 border-blue-200 shadow-md'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => setSelectedForm(form.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{form.name}</h3>
                          <Badge className={getStatusColor(form.status)}>{form.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{form.description}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 text-blue-600">
                            <Hash className="h-3 w-3" />
                            {form.submissions} submissions
                          </span>
                          <span className="flex items-center gap-1 text-green-600">
                            <Settings className="h-3 w-3" />
                            {form.fields.length} fields
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Fields */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Form Fields - {selectedFormData?.name}
              </CardTitle>
              <CardDescription>
                Manage fields for the selected registration form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFormData ? (
                <div className="space-y-6">
                  {Object.entries(groupedFields).map(([section, fields]) => (
                    <div key={section} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <div className="p-2 rounded bg-blue-100 text-blue-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        {section}
                      </h3>
                      <div className="grid gap-3">
                        {fields.map((field) => {
                          const IconComponent = fieldTypeIcons[field.type] || Type;
                          return (
                            <div
                              key={field.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-white">
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">{field.label}</h4>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{field.name}</span>
                                    <span>•</span>
                                    <span>{field.type}</span>
                                    {field.required && (
                                      <>
                                        <span>•</span>
                                        <Badge variant="outline" className="text-xs">Required</Badge>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditField(field)}>
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Move className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteField(field)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(groupedFields).length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No fields added yet</h3>
                      <p className="text-gray-500 mb-4">Start building your registration form by adding fields.</p>
                      <Button onClick={() => setIsCreateFieldModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Field
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a form</h3>
                  <p className="text-gray-500">Choose a registration form from the list to manage its fields.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Field Dialog */}
      <Dialog open={isEditFieldModalOpen} onOpenChange={setIsEditFieldModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Edit Form Field
            </DialogTitle>
            <DialogDescription>
              Update the field configuration.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(fieldHandler, onUpdateField)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Field Name"
                name="name"
                value={getFormData(fieldHandler).name}
                onChange={handleInputChange(fieldHandler)}
                error={getFormErrors(fieldHandler).name}
                placeholder="firstName"
                required
              />
              <FormField
                label="Field Label"
                name="label"
                value={getFormData(fieldHandler).label}
                onChange={handleInputChange(fieldHandler)}
                error={getFormErrors(fieldHandler).label}
                placeholder="First Name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Field Type</label>
                <select
                  name="type"
                  value={getFormData(fieldHandler).type}
                  onChange={handleInputChange(fieldHandler)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="textarea">Textarea</option>
                  <option value="file">File</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Required</label>
                <select
                  name="required"
                  value={getFormData(fieldHandler).required}
                  onChange={handleInputChange(fieldHandler)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            <FormField
              label="Section"
              name="section"
              value={getFormData(fieldHandler).section}
              onChange={handleInputChange(fieldHandler)}
              error={getFormErrors(fieldHandler).section}
              placeholder="Personal Information"
              required
            />

            <FormField
              label="Placeholder"
              name="placeholder"
              value={getFormData(fieldHandler).placeholder}
              onChange={handleInputChange(fieldHandler)}
              error={getFormErrors(fieldHandler).placeholder}
              placeholder="Enter your first name"
            />

            <FormField
              label="Options (comma-separated, for select fields)"
              name="options"
              value={getFormData(fieldHandler).options}
              onChange={handleInputChange(fieldHandler)}
              error={getFormErrors(fieldHandler).options}
              placeholder="Option 1, Option 2, Option 3"
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditFieldModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Update Field
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Field Confirmation */}
      <AlertDialog open={isDeleteFieldModalOpen} onOpenChange={setIsDeleteFieldModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the field "{selectedField?.label}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteField} className="bg-red-600 hover:bg-red-700">
              Delete Field
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
