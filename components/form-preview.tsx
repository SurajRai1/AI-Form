// components/form-preview.tsx

'use client';

import React, { useState } from 'react';
import { CheckCircle, Send, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { GeneratedForm, FormField } from '@/lib/ai';
import { cn } from '@/lib/utils';


interface FormPreviewProps {
  form: GeneratedForm;
  onSubmit?: (data: any) => void;
  readOnly?: boolean;
}

export default function FormPreview({ form, onSubmit, readOnly = false }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    form.fields.forEach(field => {
      if (field.required) {
        const value = formData[field.id];
        if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.id] = 'This field is required';
        }
      }
      
      // Additional validation
      if (field.validation) {
        const value = formData[field.id];
        if (value) {
          if (field.type === "text" || field.type === "textarea" || field.type === "password"){
            if (field.validation.min && value.length < field.validation.min) {
              newErrors[field.id] = `Minimum ${field.validation.min} characters required`;
            }
            if (field.validation.max && value.length > field.validation.max) {
              newErrors[field.id] = `Maximum ${field.validation.max} characters allowed`;
            }
          }
          if (field.validation.pattern) {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(value)) {
              newErrors[field.id] = 'Invalid format';
            }
          }
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

    const renderField = (field: FormField) => {
        const value = formData[field.id];
        const error = errors[field.id];

        const commonInputProps = {
            id: field.id,
            value: value || '',
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleFieldChange(field.id, e.target.value),
            disabled: readOnly,
            className: `w-full ${error ? 'border-red-500' : ''}`,
            placeholder: field.placeholder,
        };
        
        // Helper to handle both string and object options
        const getOptionValue = (option: any) => typeof option === 'object' && option !== null ? option.value : option;
        const getOptionLabel = (option: any) => typeof option === 'object' && option !== null ? option.label : option;


        switch (field.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'password':
            case 'date':
            case 'file':
                return <Input {...commonInputProps} type={field.type} />;
            case 'textarea':
                return <Textarea {...commonInputProps} rows={4} />;
            case 'select':
                return (
                    <Select value={value || ''} onValueChange={(val) => handleFieldChange(field.id, val)} disabled={readOnly}>
                        <SelectTrigger className={error ? 'border-red-500' : ''}>
                            <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option, index) => (
                                <SelectItem key={index} value={getOptionValue(option)}>
                                    {getOptionLabel(option)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case 'radio':
                return (
                    <RadioGroup value={value} onValueChange={(val) => handleFieldChange(field.id, val)} disabled={readOnly} className="space-y-2">
                        {field.options?.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <RadioGroupItem value={getOptionValue(option)} id={`${field.id}-${index}`} />
                                <Label htmlFor={`${field.id}-${index}`} className="font-normal">{getOptionLabel(option)}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {field.options?.map((option, index) => {
                            const optionValue = getOptionValue(option);
                            return (
                                <div key={index} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${field.id}-${index}`}
                                        checked={Array.isArray(value) && value.includes(optionValue)}
                                        onCheckedChange={(checked) => {
                                            const currentValues = Array.isArray(value) ? value : [];
                                            const newValues = checked
                                                ? [...currentValues, optionValue]
                                                : currentValues.filter(v => v !== optionValue);
                                            handleFieldChange(field.id, newValues);
                                        }}
                                        disabled={readOnly}
                                    />
                                    <Label htmlFor={`${field.id}-${index}`} className="font-normal">{getOptionLabel(option)}</Label>
                                </div>
                            )
                        })}
                    </div>
                );
            case 'switch':
                return (
                    <div className="flex items-center space-x-2">
                        <Switch id={field.id} checked={!!value} onCheckedChange={(checked) => handleFieldChange(field.id, checked)} disabled={readOnly} />
                        <Label htmlFor={field.id}>{field.placeholder || "Toggle"}</Label>
                    </div>
                );
            case 'slider':
                return (
                    <div className="flex items-center gap-4 pt-2">
                        <Slider
                            id={field.id}
                            value={[value ?? field.validation?.min ?? 0]}
                            onValueChange={([val]) => handleFieldChange(field.id, val)}
                            min={field.validation?.min}
                            max={field.validation?.max}
                            step={field.validation?.step}
                            disabled={readOnly}
                        />
                         <span className="text-sm font-medium w-12 text-center">{value ?? field.validation?.min ?? 0}</span>
                    </div>
                );
            case 'rating':
                const [hoverRating, setHoverRating] = useState(0);
                const maxRating = field.validation?.max || 5;
                return (
                    <div className="flex items-center gap-1">
                        {[...Array(maxRating)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <Star
                                    key={ratingValue}
                                    className={cn('h-8 w-8 transition-colors',
                                        readOnly ? 'cursor-default' : 'cursor-pointer',
                                        ratingValue <= (hoverRating || value || 0)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300 dark:text-gray-600'
                                    )}
                                    onClick={() => !readOnly && handleFieldChange(field.id, ratingValue)}
                                    onMouseEnter={() => !readOnly && setHoverRating(ratingValue)}
                                    onMouseLeave={() => !readOnly && setHoverRating(0)}
                                />
                            );
                        })}
                    </div>
                );
            default:
                return <Input {...commonInputProps} type="text" />;
        }
    };


  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Thank you!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your response has been submitted successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {form.title}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {form.description}
            </CardDescription>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
              <Sparkles className="mr-1 h-3 w-3" />
              AI-Powered Form
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
              {form.language}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                
                {renderField(field)}
                
                {errors[field.id] && (
                  <p className="text-sm text-red-600 dark:text-red-400 pt-1">
                    {errors[field.id]}
                  </p>
                )}
              </div>
            ))}
            
            {!readOnly && (
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Submit Form
                    <Send className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}