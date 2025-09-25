'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Settings, Eye, Save, Globe, Sparkles, ArrowLeft, Star, ToggleLeft, SlidersHorizontal, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { GeneratedForm, FormField } from '@/lib/ai';
import { useAuth } from '@/contexts/AuthContext';
import { updateForm } from '@/lib/database';
import { toast } from 'sonner';

interface FormBuilderProps {
  form: GeneratedForm;
  onSaveSuccess: () => void;
}

const fieldTypes = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'password', label: 'Password', icon: <Lock className="h-4 w-4" /> },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'textarea', label: 'Text Area', icon: '📄' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'radio', label: 'Radio Buttons', icon: '🔘' },
  { value: 'checkbox', label: 'Checkboxes', icon: '☑️' },
  { value: 'date', label: 'Date Picker', icon: '📅' },
  { value: 'switch', label: 'Switch', icon: <ToggleLeft className="h-4 w-4" /> },
  { value: 'slider', label: 'Slider', icon: <SlidersHorizontal className="h-4 w-4" /> },
  { value: 'rating', label: 'Rating', icon: <Star className="h-4 w-4" /> },
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
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  // Ghost element for drag-and-drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      const ghost = document.getElementById('ghost-drag-item');
      if (ghost) {
        ghost.style.left = `${e.clientX + 15}px`;
        ghost.style.top = `${e.clientY}px`;
      }
    };

    const handleDragEnd = () => {
      const ghost = document.getElementById('ghost-drag-item');
      if (ghost) {
        ghost.remove();
      }
      setDragging(false);
    };

    if (dragging) {
      window.addEventListener('dragover', handleDragOver);
      window.addEventListener('dragend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragend', handleDragEnd);
      handleDragEnd();
    };
  }, [dragging]);


  const handleSave = async () => {
    if (!user) {
        toast.error("You must be logged in to save a form.");
        return;
    }

    setIsSaving(true);
    try {
        await updateForm(currentForm.id, currentForm);
        toast.success("Form saved successfully!");
        onSaveSuccess();
    } catch (error) {
        console.error("Error saving form:", error);
        toast.error("Failed to save the form. Please try again.");
    } finally {
        setIsSaving(false);
    }
  };
  
  const updateCurrentForm = (updates: Partial<GeneratedForm>) => {
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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    const ghost = e.currentTarget.cloneNode(true) as HTMLElement;
    ghost.id = 'ghost-drag-item';
    ghost.style.position = 'absolute';
    ghost.style.top = `${e.clientY}px`;
    ghost.style.left = `${e.clientX + 15}px`;
    ghost.style.pointerEvents = 'none';
    ghost.style.opacity = '0.8';
    ghost.style.width = `${e.currentTarget.offsetWidth}px`;
    document.body.appendChild(ghost);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', ''); // For Firefox compatibility
    setDragging(true);
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      return;
    }
    
    const newFields = [...currentForm.fields];
    const draggedItemContent = newFields.splice(dragItem.current, 1)[0];
    newFields.splice(dragOverItem.current, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    setCurrentForm(prev => ({ ...prev, fields: newFields }));
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
          {['text', 'email', 'number', 'textarea', 'password'].includes(field.type) && (
            <div className="space-y-2">
              <Label>Placeholder</Label>
              <Input
                value={field.placeholder || ''}
                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </div>
          )}
          
          {/* Options for select/radio/checkbox */}
          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(field.options || [])];
                        newOptions[index] = e.target.value;
                        updateField(field.id, { options: newOptions });
                      }}
                    />
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => {
                        const newOptions = [...(field.options || [])];
                        newOptions.splice(index, 1);
                        updateField(field.id, { options: newOptions });
                    }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
               <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                  const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                  updateField(field.id, { options: newOptions });
              }}>
                  <Plus className="h-4 w-4 mr-2"/> Add Option
              </Button>
            </div>
          )}

          {/* Slider Settings */}
          {field.type === 'slider' && (
             <div className="space-y-2">
                <Label>Slider Configuration</Label>
                <div className="grid grid-cols-3 gap-2">
                    <Input type="number" placeholder="Min" value={field.validation?.min ?? 0} onChange={e => updateField(field.id, { validation: { ...field.validation, min: Number(e.target.value) }})} />
                    <Input type="number" placeholder="Max" value={field.validation?.max ?? 100} onChange={e => updateField(field.id, { validation: { ...field.validation, max: Number(e.target.value) }})} />
                    <Input type="number" placeholder="Step" value={field.validation?.step ?? 1} onChange={e => updateField(field.id, { validation: { ...field.validation, step: Number(e.target.value) }})} />
                </div>
             </div>
          )}

           {/* Rating Settings */}
           {field.type === 'rating' && (
             <div className="space-y-2">
                <Label>Max Rating</Label>
                <Input type="number" placeholder="Max" value={field.validation?.max ?? 5} max={10} min={3} onChange={e => updateField(field.id, { validation: { ...field.validation, max: Number(e.target.value) }})} />
             </div>
          )}


          {/* Required */}
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id={`required-${field.id}`}
              checked={field.required}
              onCheckedChange={(checked) => updateField(field.id, { required: checked })}
            />
            <Label htmlFor={`required-${field.id}`}>Required field</Label>
          </div>

        </CardContent>
      </Card>
    );
  };

  const renderFieldPreview = (field: FormField, index: number) => {
    const isSelected = selectedField === field.id;
    
    return (
      <div
        key={field.id}
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragEnter={() => handleDragEnter(index)}
        onDragEnd={handleSort}
        onDragOver={(e) => e.preventDefault()}
        className={`p-4 border-2 rounded-lg transition-all ${
          isSelected
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50'
            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
        } ${dragging && dragItem.current === index ? 'opacity-50' : ''}`}
        onClick={() => setSelectedField(field.id)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
            <Badge variant="outline" className="text-xs">
              {fieldTypes.find(t => t.value === field.type)?.icon} {field.type}
            </Badge>
            {field.required && (
              <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                Required
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          
          {['text', 'email', 'number', 'textarea', 'password', 'date', 'file'].includes(field.type) && (
            <Input type={field.type} placeholder={field.placeholder} disabled />
          )}

          {field.type === 'switch' && (
            <div className="flex items-center space-x-2">
                <Switch disabled />
                <Label>{field.placeholder || "Toggle"}</Label>
            </div>
          )}

          {field.type === 'slider' && (
             <Slider defaultValue={[field.validation?.min || 50]} min={field.validation?.min || 0} max={field.validation?.max || 100} step={field.validation?.step || 1} disabled />
          )}

          {field.type === 'rating' && (
            <div className="flex items-center gap-1">
              {[...Array(field.validation?.max || 5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-gray-300" />
              ))}
            </div>
          )}
          
          {field.type === 'select' && (
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
            </Select>
          )}

          { (field.type === 'radio' || field.type === 'checkbox') && (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type={field.type} disabled />
                  <Label className="text-sm font-normal">{option}</Label>
                </div>
              ))}
            </div>
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
            disabled={isSaving}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save & Close'}
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
                  onChange={(e) => updateCurrentForm({ title: e.target.value })}
                  placeholder="Enter form title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={currentForm.description}
                  onChange={(e) => updateCurrentForm({ description: e.target.value })}
                  placeholder="Enter form description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={currentForm.theme} onValueChange={(value) => updateCurrentForm({ theme: value as any })}>
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
                <Select value={currentForm.language} onValueChange={(value) => updateCurrentForm({ language: value })}>
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
                  {currentForm.fields.map((field, index) => renderFieldPreview(field, index))}
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