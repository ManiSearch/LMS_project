// Form utilities and validation helpers
import toast from 'react-hot-toast';

// Common validation rules
export const validationRules = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
    return null;
  },
  
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
  
  phone: (value: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },
  
  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Minimum ${min} characters required`;
    }
    return null;
  },
  
  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Maximum ${max} characters allowed`;
    }
    return null;
  },
  
  numeric: (value: string) => {
    if (value && isNaN(Number(value))) {
      return 'Please enter a valid number';
    }
    return null;
  },
  
  positiveNumber: (value: string) => {
    const num = Number(value);
    if (value && (isNaN(num) || num <= 0)) {
      return 'Please enter a positive number';
    }
    return null;
  },
  
  dateRange: (minDate?: Date, maxDate?: Date) => (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    if (minDate && date < minDate) {
      return `Date must be after ${minDate.toLocaleDateString()}`;
    }
    if (maxDate && date > maxDate) {
      return `Date must be before ${maxDate.toLocaleDateString()}`;
    }
    return null;
  }
};

// Form field interface
export interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
}

// Form state interface
export interface FormState {
  [key: string]: FormField;
}

// Initialize form state
export function initializeFormState(fields: string[] = [], initialValues: Record<string, any> = {}): FormState {
  const state: FormState = {};
  if (!fields || !Array.isArray(fields)) {
    console.warn('initializeFormState: fields parameter must be an array');
    return state;
  }
  fields.forEach(field => {
    state[field] = {
      value: initialValues[field] || '',
      error: null,
      touched: false
    };
  });
  return state;
}

// Validate single field
export function validateField(value: any, rules: Array<(value: any) => string | null>): string | null {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
}

// Validate entire form
export function validateForm(formState: FormState, validationRules: Record<string, Array<(value: any) => string | null>>): boolean {
  let isValid = true;
  
  Object.keys(validationRules).forEach(field => {
    const error = validateField(formState[field]?.value, validationRules[field]);
    if (error) {
      isValid = false;
    }
  });
  
  return isValid;
}

// Toast notification helpers
export const toastHelpers = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: 'white',
        fontWeight: '500',
      }
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#EF4444',
        color: 'white',
        fontWeight: '500',
      }
    });
  },
  
  warning: (message: string) => {
    toast(message, {
      duration: 3500,
      position: 'top-right',
      style: {
        background: '#F59E0B',
        color: 'white',
        fontWeight: '500',
      }
    });
  },
  
  info: (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#3B82F6',
        color: 'white',
        fontWeight: '500',
      }
    });
  },
  
  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6B7280',
        color: 'white',
        fontWeight: '500',
      }
    });
  },
  
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  }
};

// Simulate async operations with loading
export async function simulateAsyncOperation<T>(
  operation: () => Promise<T> | T,
  loadingMessage: string = 'Processing...',
  successMessage?: string,
  delay: number = 1500
): Promise<T> {
  const toastId = toastHelpers.loading(loadingMessage);
  
  try {
    // Add artificial delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const result = await operation();
    
    toastHelpers.dismiss(toastId);
    
    if (successMessage) {
      toastHelpers.success(successMessage);
    }
    
    return result;
  } catch (error) {
    toastHelpers.dismiss(toastId);
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toastHelpers.error(errorMessage);
    
    throw error;
  }
}

// Format helpers
export const formatHelpers = {
  capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  
  formatName: (firstName: string, lastName: string) => 
    `${formatHelpers.capitalize(firstName)} ${formatHelpers.capitalize(lastName)}`,
    
  formatPhone: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },
  
  formatDate: (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },
  
  formatTime: (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }
};

// File upload helpers
export const fileHelpers = {
  validateFileType: (file: File, allowedTypes: string[]) => {
    return allowedTypes.includes(file.type);
  },
  
  validateFileSize: (file: File, maxSizeInMB: number) => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  },
  
  readFileAsText: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  },
  
  downloadFile: (data: any, filename: string, type: string = 'application/json') => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
