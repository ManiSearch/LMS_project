import { useState, useCallback } from 'react';
import { FormState, initializeFormState, validateField, toastHelpers, simulateAsyncOperation } from '@/utils/formUtils';

// Generic form handler hook
export function useFormHandler(
  initialFields: string[],
  initialValues: Record<string, any> = {},
  validationRules: Record<string, Array<(value: any) => string | null>> = {}
) {
  const [formState, setFormState] = useState<FormState>(() => 
    initializeFormState(initialFields, initialValues)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update field value
  const updateField = useCallback((fieldName: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        touched: true,
        error: validationRules[fieldName] 
          ? validateField(value, validationRules[fieldName])
          : null
      }
    }));
  }, [validationRules]);

  // Update multiple fields at once
  const updateFields = useCallback((updates: Record<string, any>) => {
    setFormState(prev => {
      const newState = { ...prev };
      Object.entries(updates).forEach(([fieldName, value]) => {
        newState[fieldName] = {
          ...prev[fieldName],
          value,
          touched: true,
          error: validationRules[fieldName] 
            ? validateField(value, validationRules[fieldName])
            : null
        };
      });
      return newState;
    });
  }, [validationRules]);

  // Set field error
  const setFieldError = useCallback((fieldName: string, error: string | null) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error
      }
    }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormState(initializeFormState(initialFields, initialValues));
    setIsSubmitting(false);
  }, [initialFields, initialValues]);

  // Validate all fields
  const validateForm = useCallback(() => {
    let isValid = true;
    const newState = { ...formState };

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(formState[fieldName]?.value, validationRules[fieldName]);
      newState[fieldName] = {
        ...newState[fieldName],
        error,
        touched: true
      };
      if (error) isValid = false;
    });

    setFormState(newState);
    return isValid;
  }, [formState, validationRules]);

  // Submit form
  const submitForm = useCallback(async (onSubmit: (data: Record<string, any>) => Promise<any>) => {
    if (!validateForm()) {
      toastHelpers.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = Object.keys(formState).reduce((acc, key) => {
        acc[key] = formState[key].value;
        return acc;
      }, {} as Record<string, any>);

      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, validateForm]);

  // Get field props for easy binding
  const getFieldProps = useCallback((fieldName: string) => ({
    value: formState[fieldName]?.value || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string) => {
      // Handle both event objects and direct values (for Select components)
      const value = typeof e === 'string' ? e : e.target.value;
      updateField(fieldName, value);
    },
    error: formState[fieldName]?.error,
    touched: formState[fieldName]?.touched
  }), [formState, updateField]);

  return {
    formState,
    updateField,
    updateFields,
    setFieldError,
    resetForm,
    validateForm,
    submitForm,
    getFieldProps,
    isSubmitting,
    hasErrors: Object.values(formState).some(field => field.error),
    isDirty: Object.values(formState).some(field => field.touched)
  };
}

// Academic event handlers
export function useAcademicHandlers() {
  // Student management handlers
  const studentHandlers = {
    create: async (studentData: any) => {
      return simulateAsyncOperation(
        async () => {
          // Mock student creation
          const newStudent = {
            id: `ST${Date.now()}`,
            ...studentData,
            createdAt: new Date().toISOString(),
            status: 'Active'
          };
          return newStudent;
        },
        'Creating student...',
        `Student ${studentData.firstName} ${studentData.lastName} created successfully`
      );
    },

    update: async (studentId: string, studentData: any) => {
      return simulateAsyncOperation(
        async () => {
          return { id: studentId, ...studentData, updatedAt: new Date().toISOString() };
        },
        'Updating student...',
        'Student updated successfully'
      );
    },

    delete: async (studentId: string) => {
      return simulateAsyncOperation(
        async () => {
          return { id: studentId, deleted: true };
        },
        'Deleting student...',
        'Student deleted successfully'
      );
    },

    bulkImport: async (file: File) => {
      return simulateAsyncOperation(
        async () => {
          // Mock file processing
          const importedCount = Math.floor(Math.random() * 50) + 10;
          return { importedCount, errors: [] };
        },
        'Importing students...',
        `Successfully imported students from file`,
        2000
      );
    }
  };

  // Attendance handlers
  const attendanceHandlers = {
    markAttendance: async (classId: string, attendanceData: any[]) => {
      return simulateAsyncOperation(
        async () => {
          return {
            classId,
            date: new Date().toISOString(),
            marked: attendanceData.length,
            present: attendanceData.filter(a => a.status === 'present').length,
            absent: attendanceData.filter(a => a.status === 'absent').length
          };
        },
        'Marking attendance...',
        `Attendance marked for ${attendanceData.length} students`
      );
    },

    generateReport: async (dateRange: { from: string; to: string }) => {
      return simulateAsyncOperation(
        async () => {
          return {
            totalDays: 20,
            averageAttendance: 87.5,
            studentsAboveThreshold: 156,
            studentsBelowThreshold: 12
          };
        },
        'Generating attendance report...',
        'Attendance report generated successfully'
      );
    }
  };

  // Timetable handlers
  const timetableHandlers = {
    create: async (timetableData: any) => {
      return simulateAsyncOperation(
        async () => {
          return {
            id: `TT${Date.now()}`,
            ...timetableData,
            status: 'Active',
            createdAt: new Date().toISOString()
          };
        },
        'Creating timetable...',
        'Timetable created successfully'
      );
    },

    update: async (timetableId: string, updates: any) => {
      return simulateAsyncOperation(
        async () => {
          return { id: timetableId, ...updates, updatedAt: new Date().toISOString() };
        },
        'Updating timetable...',
        'Timetable updated successfully'
      );
    },

    import: async (file: File) => {
      return simulateAsyncOperation(
        async () => {
          return { 
            imported: true, 
            classesImported: 15,
            conflicts: 2
          };
        },
        'Importing timetable...',
        'Timetable imported successfully',
        2500
      );
    },

    export: async (format: 'pdf' | 'excel' | 'csv') => {
      return simulateAsyncOperation(
        async () => {
          // Mock file download
          const blob = new Blob(['Mock timetable data'], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `timetable.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          return { exported: true, format };
        },
        `Exporting timetable as ${format.toUpperCase()}...`,
        `Timetable exported as ${format.toUpperCase()} successfully`
      );
    },

    autoGenerate: async (constraints: any) => {
      return simulateAsyncOperation(
        async () => {
          return {
            id: `ATT${Date.now()}`,
            academicYear: constraints.academicYear,
            program: constraints.program,
            semester: constraints.semester,
            className: constraints.className,
            generatedAt: new Date().toISOString(),
            conflicts: 0,
            utilization: 94,
            status: 'Generated'
          };
        },
        'Auto-generating timetable based on constraints...',
        'Timetable auto-generated successfully',
        3000
      );
    },

    assignFlexible: async (assignmentData: any) => {
      return simulateAsyncOperation(
        async () => {
          return {
            id: `FA${Date.now()}`,
            subject: assignmentData.subject,
            primaryTeacher: assignmentData.primaryTeacher,
            alternateTeachers: assignmentData.alternateTeachers,
            timeSlot: assignmentData.timeSlot,
            assignedAt: new Date().toISOString(),
            status: 'Active'
          };
        },
        'Creating flexible assignment...',
        'Flexible assignment created successfully'
      );
    }
  };

  return {
    studentHandlers,
    attendanceHandlers,
    timetableHandlers
  };
}

// LMS event handlers
export function useLMSHandlers() {
  const courseHandlers = {
    create: async (courseData: any) => {
      return simulateAsyncOperation(
        async () => {
          return {
            id: `C${Date.now()}`,
            ...courseData,
            enrolled: 0,
            status: 'Active',
            createdAt: new Date().toISOString()
          };
        },
        'Creating course...',
        `Course "${courseData.name}" created successfully`
      );
    },

    enroll: async (courseId: string, studentId: string) => {
      return simulateAsyncOperation(
        async () => {
          return { courseId, studentId, enrolledAt: new Date().toISOString() };
        },
        'Enrolling student...',
        'Student enrolled successfully'
      );
    },

    updateProgress: async (courseId: string, studentId: string, progress: number) => {
      return simulateAsyncOperation(
        async () => {
          return { courseId, studentId, progress, updatedAt: new Date().toISOString() };
        },
        'Updating progress...',
        'Progress updated successfully'
      );
    }
  };

  const assignmentHandlers = {
    create: async (assignmentData: any) => {
      return simulateAsyncOperation(
        async () => {
          return {
            id: `A${Date.now()}`,
            ...assignmentData,
            submissions: 0,
            status: 'Active',
            createdAt: new Date().toISOString()
          };
        },
        'Creating assignment...',
        `Assignment "${assignmentData.title}" created successfully`
      );
    },

    submit: async (assignmentId: string, submission: any) => {
      return simulateAsyncOperation(
        async () => {
          return {
            assignmentId,
            studentId: submission.studentId,
            submittedAt: new Date().toISOString(),
            status: 'Submitted'
          };
        },
        'Submitting assignment...',
        'Assignment submitted successfully'
      );
    },

    grade: async (submissionId: string, grade: number, feedback: string) => {
      return simulateAsyncOperation(
        async () => {
          return {
            submissionId,
            grade,
            feedback,
            gradedAt: new Date().toISOString()
          };
        },
        'Grading assignment...',
        'Assignment graded successfully'
      );
    }
  };

  return {
    courseHandlers,
    assignmentHandlers
  };
}

// Exam event handlers
export function useExamHandlers() {
  const examHandlers = {
    schedule: async (examData: any) => {
      return simulateAsyncOperation(
        async () => {
          return {
            id: `E${Date.now()}`,
            ...examData,
            status: 'Scheduled',
            createdAt: new Date().toISOString(),
            hallTicketsGenerated: false
          };
        },
        'Scheduling exam...',
        `Exam "${examData.subject}" scheduled successfully`
      );
    },

    generateHallTickets: async (examId: string) => {
      return simulateAsyncOperation(
        async () => {
          const ticketCount = Math.floor(Math.random() * 200) + 50;
          return {
            examId,
            ticketsGenerated: ticketCount,
            generatedAt: new Date().toISOString()
          };
        },
        'Generating hall tickets...',
        'Hall tickets generated successfully',
        2000
      );
    },

    publishResults: async (examId: string, results: any[]) => {
      return simulateAsyncOperation(
        async () => {
          return {
            examId,
            resultsPublished: results.length,
            publishedAt: new Date().toISOString(),
            averageScore: 78.5
          };
        },
        'Publishing results...',
        'Exam results published successfully'
      );
    },

    generateReports: async (examId: string, reportType: string) => {
      return simulateAsyncOperation(
        async () => {
          return {
            examId,
            reportType,
            generatedAt: new Date().toISOString()
          };
        },
        `Generating ${reportType} report...`,
        `${reportType} report generated successfully`
      );
    }
  };

  return { examHandlers };
}

// File operation handlers
export function useFileHandlers() {
  const handleFileUpload = useCallback(async (
    file: File,
    allowedTypes: string[] = ['application/json', 'text/csv', 'application/vnd.ms-excel'],
    maxSizeInMB: number = 5
  ) => {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toastHelpers.error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      throw new Error('Invalid file type');
    }

    // Validate file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toastHelpers.error(`File size exceeds ${maxSizeInMB}MB limit`);
      throw new Error('File size too large');
    }

    return simulateAsyncOperation(
      async () => {
        return {
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString()
        };
      },
      'Uploading file...',
      `File "${file.name}" uploaded successfully`
    );
  }, []);

  const handleFileDownload = useCallback(async (data: any, filename: string, format: string) => {
    return simulateAsyncOperation(
      async () => {
        let content: string;
        let mimeType: string;

        switch (format.toLowerCase()) {
          case 'json':
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            break;
          case 'csv':
            content = convertToCSV(data);
            mimeType = 'text/csv';
            break;
          default:
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return { downloaded: true, filename: `${filename}.${format}` };
      },
      'Preparing download...',
      `File downloaded successfully`
    );
  }, []);

  return {
    handleFileUpload,
    handleFileDownload
  };
}

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(',')
    )
  ].join('\n');
  
  return csvContent;
}
