import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'date' | 'time' | 'textarea' | 'select';
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => void;
  error?: string | null;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  touched,
  required = false,
  placeholder,
  options = [],
  disabled = false,
  className,
  rows = 3
}: FormFieldProps) {
  const hasError = touched && error;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e);
  };

  const handleSelectChange = (value: string) => {
    onChange(value as any);
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={cn(
              hasError && "border-red-500 focus-visible:ring-red-500",
              className
            )}
          />
        );
      
      case 'select':
        return (
          <Select value={value} onValueChange={handleSelectChange} disabled={disabled}>
            <SelectTrigger className={cn(
              hasError && "border-red-500 focus-visible:ring-red-500",
              className
            )}>
              <SelectValue placeholder={placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return (
          <Input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              hasError && "border-red-500 focus-visible:ring-red-500",
              className
            )}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {renderInput()}
      
      {hasError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
}

// File upload field component
interface FileUploadFieldProps {
  label: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  onFileSelect: (files: FileList | null) => void;
  error?: string | null;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileUploadField({
  label,
  name,
  accept,
  multiple = false,
  onFileSelect,
  error,
  touched,
  required = false,
  disabled = false,
  className
}: FileUploadFieldProps) {
  const hasError = touched && error;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Input
        id={name}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        disabled={disabled}
        className={cn(
          "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90",
          hasError && "border-red-500 focus-visible:ring-red-500",
          className
        )}
      />
      
      {hasError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
}

// Checkbox field component
interface CheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | null;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CheckboxField({
  label,
  name,
  checked,
  onChange,
  error,
  touched,
  required = false,
  disabled = false,
  className
}: CheckboxFieldProps) {
  const hasError = touched && error;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "rounded border-gray-300 text-primary focus:ring-primary",
            hasError && "border-red-500",
            className
          )}
        />
        <Label htmlFor={name} className="text-sm font-medium cursor-pointer">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      
      {hasError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
}

// Multi-select field component
interface MultiSelectFieldProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string | null;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function MultiSelectField({
  label,
  name,
  options,
  selectedValues,
  onChange,
  error,
  touched,
  required = false,
  disabled = false,
  placeholder = "Select options...",
  className
}: MultiSelectFieldProps) {
  const hasError = touched && error;
  
  const handleOptionToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className={cn(
        "border rounded-md p-2 min-h-[40px] bg-background",
        hasError && "border-red-500",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}>
        {selectedValues.length === 0 ? (
          <span className="text-muted-foreground text-sm">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedValues.map(value => {
              const option = options.find(opt => opt.value === value);
              return (
                <span
                  key={value}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary text-primary-foreground"
                >
                  {option?.label || value}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleOptionToggle(value)}
                      className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        )}
        
        {!disabled && (
          <div className="mt-2 space-y-1">
            {options.filter(opt => !selectedValues.includes(opt.value)).map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionToggle(option.value)}
                className="block w-full text-left px-2 py-1 text-sm hover:bg-accent rounded"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {hasError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
}
