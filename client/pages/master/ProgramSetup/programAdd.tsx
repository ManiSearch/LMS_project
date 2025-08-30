import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormHandler } from '@/hooks/useFormHandlers';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { GraduationCap, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import programService from '@/services/programService';


export default function ProgramAdd() {
  const navigate = useNavigate();
  const formHandler = useFormHandler(
    ['name', 'code', 'level', 'type', 'department', 'duration', 'totalCredits', 'totalStudents', 'description', 'status', 'specializations'],
    {
      name: '',
      code: '',
      level: 'UG',
      type: 'Regular',
      department: '',
      duration: '',
      totalCredits: '',
      totalStudents: '',
      description: '',
      status: 'draft',
      specializations: ''
    }
  );

  const {
    formState,
    updateField,
    resetForm,
    submitForm,
    isSubmitting
  } = formHandler;

  const formData = Object.keys(formState).reduce((acc, key) => {
    acc[key] = formState[key].value;
    return acc;
  }, {} as Record<string, any>);

  const errors = Object.keys(formState).reduce((acc, key) => {
    acc[key] = formState[key].error;
    return acc;
  }, {} as Record<string, any>);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(e.target.name, e.target.value);
  };

  const handleSelectChange = (fieldName: string) => (value: string) => {
    updateField(fieldName, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(onSubmit);
  };

  const onSubmit = async (data: any) => {
    try {
      // Create program data object
      const programData = {
        name: data.name,
        code: data.code,
        level: data.level,
        type: data.type,
        department: data.department,
        duration: parseInt(data.duration),
        totalCredits: parseInt(data.totalCredits),
        totalStudents: parseInt(data.totalStudents) || 0,
        description: data.description,
        status: data.status,
        specializations: data.specializations ? data.specializations.split(',').map((s: string) => s.trim()) : []
      };

      // Use program service to create and save to program.json
      const response = await programService.createProgram(programData);

      if (response.success) {
        toast.success(`Program created successfully! ID: ${response.program?.id}`);

        // Show additional info about file download if needed
        setTimeout(() => {
          toast.success(
            'If you don\'t see the program in the list, check for a downloaded program.json file and replace public/program.json with it.',
            { duration: 8000 }
          );
        }, 2000);

        navigate('/master/program-setup', { state: { refreshPrograms: true } });
      } else {
        toast.error(response.message || 'Failed to create program');
        console.error('Validation errors:', response.errors);
      }
    } catch (error) {
      console.error('Error creating program:', error);
      toast.error('Failed to create program');
    }
  };

  const handleCancel = () => {
    navigate('/master/program-setup');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="page-title flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              Add New Program
            </h1>
            <p className="page-subtitle">
              Create a new academic program with all required details
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <div className="section-card">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Program Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  placeholder="Bachelor of Technology in Computer Science"
                  required
                />
                <FormField
                  label="Program Code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  error={errors.code}
                  placeholder="B.Tech CSE"
                  required
                />
              </div>
            </div>

            {/* Program Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Program Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Program Level"
                  name="level"
                  type="select"
                  value={formData.level}
                  onChange={handleSelectChange('level')}
                  error={errors.level}
                  options={[
                    { label: 'Undergraduate (UG)', value: 'UG' },
                    { label: 'Postgraduate (PG)', value: 'PG' },
                    { label: 'Diploma', value: 'Diploma' },
                    { label: 'Certificate', value: 'Certificate' }
                  ]}
                  required
                />
                <FormField
                  label="Program Type"
                  name="type"
                  type="select"
                  value={formData.type}
                  onChange={handleSelectChange('type')}
                  error={errors.type}
                  options={[
                    { label: 'Regular', value: 'Regular' },
                    { label: 'Distance', value: 'Distance' },
                    { label: 'Part-time', value: 'Part-time' },
                    { label: 'Full-time', value: 'Full-time' },
                    { label: 'Online', value: 'Online' }
                  ]}
                  required
                />
                <FormField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  error={errors.department}
                  placeholder="Computer Science"
                  required
                />
              </div>
            </div>

            {/* Academic Configuration */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Academic Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Duration (Years)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  error={errors.duration}
                  placeholder="4"
                  required
                />
                <FormField
                  label="Total Credits"
                  name="totalCredits"
                  type="number"
                  value={formData.totalCredits}
                  onChange={handleInputChange}
                  error={errors.totalCredits}
                  placeholder="160"
                  required
                />
                <FormField
                  label="Total Students"
                  name="totalStudents"
                  type="number"
                  value={formData.totalStudents}
                  onChange={handleInputChange}
                  error={errors.totalStudents}
                  placeholder="0"
                  helpText="Current number of enrolled students"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Additional Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Description"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleInputChange}
                    error={errors.description}
                    placeholder="Brief description of the program, its objectives, and scope..."
                    rows={4}
                    required
                  />
                  <div className="space-y-6">
                    <FormField
                      label="Program Status"
                      name="status"
                      type="select"
                      value={formData.status}
                      onChange={handleSelectChange('status')}
                      error={errors.status}
                      options={[
                        { label: 'Draft', value: 'draft' },
                        { label: 'Active', value: 'active' },
                        { label: 'Inactive', value: 'inactive' }
                      ]}
                      required
                      helpText="Current status of the program"
                    />
                  </div>
                </div>
                <FormField
                  label="Specializations (comma-separated)"
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleInputChange}
                  error={errors.specializations}
                  placeholder="Artificial Intelligence, Data Science, Cybersecurity, Software Engineering"
                  helpText="Enter specializations offered within this program, separated by commas"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="flex-1 md:flex-none"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 md:flex-none bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Program'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
