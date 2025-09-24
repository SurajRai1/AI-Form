'use client';

import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Settings, Eye, Save, Globe, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { GeneratedForm, FormField } from '@/lib/ai';

interface FormBuilderProps {
  form: GeneratedForm;
  onSaveSuccess: () => void;
}

const fieldTypes = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'textarea', label: 'Text Area', icon: '📄' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'radio', label: 'Radio Buttons', icon: '🔘' },
  { value: 'checkbox', label: 'Checkboxes', icon: '☑️' },
  { value: 'date', label: 'Date Picker', icon: '📅' },
  { value: 'file', label: 'File Upload', icon: '📎' },
];

const themes = [
  { value: 'modern', label: 'Modern', color: 'bg-blue-500' },
  { value: 'classic', label: 'Classic', color: 'bg-gray-500' },
  { value: 'minimal', label: 'Minimal', color: 'bg-white border-2 border-gray-300' },
  { value: 'colorful', label: 'Colorful', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Russian', 'Japanese', 'Korean', 'Chinese', 'Arabic', 'Hindi'
];

export default function FormBuilder({ form, onSaveSuccess }: FormBuilderProps) {
  const [currentForm, setCurrentForm] = useState<GeneratedForm>(form);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const updateForm = (updates: Partial<GeneratedForm>) => {
    setCurrentForm(prev => ({ ...prev, ...updates }));
  };

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      label: 'New Field',
      placeholder: 'Enter placeholder text',
      required: false,
    };

    setCurrentForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId: string) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    setCurrentForm(prev => {
      const fields = [...prev.fields];
      const index = fields.findIndex(f => f.id === fieldId);
      
      if (direction === 'up' && index > 0) {
        [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]];
      } else if (direction === 'down' && index < fields.length - 1) {
        [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
      }
      
      return { ...prev, fields };
    });
  };

  const renderFieldEditor = (field: FormField) => {
    return (
      <Card className="border-2 border-purple-200 bg-purple-50/50 dark:bg-purple-950/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Field Settings</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeField(field.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Field Type */}
          <div className="space-y-2">
            <Label>Field Type</Label>
            <Select value={field.type} onValueChange={(value) => updateField(field.id, { type: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              placeholder="Enter field label"
            />
          </div>

          {/* Placeholder */}
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              value={field.placeholder || ''}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
              placeholder="Enter placeholder text"
            />
          </div>

          {/* Options for select/radio/checkbox */}
          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
            <div className="space-y-2">
              <Label>Options</Label>
              <Textarea
                value={field.options?.join('\n') || ''}
                onChange={(e) => updateField(field.id, { 
                  options: e.target.value.split('\n').filter(opt => opt.trim()) 
                })}
                placeholder="Enter options (one per line)"
                rows={3}
              />
            </div>
          )}

          {/* Required */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={field.required}
              onCheckedChange={(checked) => updateField(field.id, { required: checked })}
            />
            <Label>Required field</Label>
          </div>

          {/* Validation */}
          {(field.type === 'number' || field.type === 'text') && (
            <div className="space-y-2">
              <Label>Validation</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={field.validation?.min || ''}
                  onChange={(e) => updateField(field.id, { 
                    validation: { ...field.validation, min: e.target.value ? Number(e.target.value) : undefined }
                  })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={field.validation?.max || ''}
                  onChange={(e) => updateField(field.id, { 
                    validation: { ...field.validation, max: e.target.value ? Number(e.target.value) : undefined }
                  })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderFieldPreview = (field: FormField) => {
    const isSelected = selectedField === field.id;
    
    return (
      <div
        key={field.id}
        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
          isSelected 
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50' 
            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
        }`}
        onClick={() => setSelectedField(field.id)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-gray-400" />
            <Badge variant="outline" className="text-xs">
              {fieldTypes.find(t => t.value === field.type)?.icon} {field.type}
            </Badge>
            {field.required && (
              <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                Required
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                moveField(field.id, 'up');
              }}
              disabled={currentForm.fields.indexOf(field) === 0}
            >
              ↑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                moveField(field.id, 'down');
              }}
              disabled={currentForm.fields.indexOf(field) === currentForm.fields.length - 1}
            >
              ↓
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          
          {field.type === 'text' && (
            <Input placeholder={field.placeholder} disabled />
          )}
          {field.type === 'email' && (
            <Input type="email" placeholder={field.placeholder} disabled />
          )}
          {field.type === 'number' && (
            <Input type="number" placeholder={field.placeholder} disabled />
          )}
          {field.type === 'textarea' && (
            <Textarea placeholder={field.placeholder} disabled rows={3} />
          )}
          {field.type === 'select' && (
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {field.type === 'radio' && (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="radio" disabled />
                  <Label className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
          )}
          {field.type === 'checkbox' && (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="checkbox" disabled />
                  <Label className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
          )}
          {field.type === 'date' && (
            <Input type="date" disabled />
          )}
          {field.type === 'file' && (
            <Input type="file" disabled />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
            <Button onClick={onSaveSuccess} variant="ghost" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Forms
            </Button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Form Builder
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your form and save the changes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {}}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={onSaveSuccess}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save & Close
          </Button>
        </div>
      </div>

      <div className="flex-grow grid lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left Column: Settings (Scrollable) */}
        <div className="lg:col-span-4 xl:col-span-3 h-full overflow-y-auto space-y-6 pr-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Form Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Form Title</Label>
                <Input
                  value={currentForm.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  placeholder="Enter form title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={currentForm.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  placeholder="Enter form description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={currentForm.theme} onValueChange={(value) => updateForm({ theme: value as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {themes.map(theme => (
                      <SelectItem key={theme.value} value={theme.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${theme.color}`}></div>
                          {theme.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={currentForm.language} onValueChange={(value) => updateForm({ language: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {lang}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Add New Field</CardTitle></CardHeader>
            <CardContent>
              <Button onClick={addField} className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Field
              </Button>
            </CardContent>
          </Card>

          {selectedField && renderFieldEditor(currentForm.fields.find(f => f.id === selectedField)!)}
        </div>

        {/* Right Column: Form Preview (Scrollable) */}
        <div className="lg:col-span-8 xl:col-span-9 h-full overflow-y-auto">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
              <CardDescription>
                {currentForm.fields.length} fields • {currentForm.fields.filter(f => f.required).length} required
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center space-y-2 p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-xl font-semibold">{currentForm.title}</h3>
                  <p className="text-muted-foreground">{currentForm.description}</p>
                </div>

                <div className="space-y-4">
                  {currentForm.fields.map(renderFieldPreview)}
                </div>

                {currentForm.fields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No fields added yet. Click "Add Field" to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}