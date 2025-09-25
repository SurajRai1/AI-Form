'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GeneratedForm, FormField } from '@/lib/ai';
import { Eye, FileText, Save, CheckCircle } from 'lucide-react';

interface FormChatCardProps {
  form: GeneratedForm;
  onSelect: (formId: string) => void;
  onPreview: (form: GeneratedForm) => void;
  onSave: (form: GeneratedForm) => void;
  isSelected: boolean;
  isSaved: boolean;
}

const getFieldIcon = (type: FormField['type']) => {
    switch (type) {
        case 'text': return '📝';
        case 'email': return '📧';
        case 'number': return '🔢';
        case 'textarea': return '📄';
        case 'select': return '📋';
        case 'radio': return '🔘';
        case 'checkbox': return '☑️';
        case 'date': return '📅';
        case 'file': return '📎';
        case 'password': return '🔒';
        case 'slider': return '🎚️';
        case 'switch': return ' स्विच करें';
        case 'rating': return '⭐';
        default: return '📝';
    }
};

export const FormChatCard: React.FC<FormChatCardProps> = ({ form, onSelect, onPreview, onSave, isSelected, isSaved }) => {
  return (
    <Card className={`w-full max-w-md transition-all duration-300 ${isSelected ? 'border-primary shadow-lg' : 'border-border'} ${isSaved ? 'bg-green-50 dark:bg-green-950/50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg">{form.title}</CardTitle>
                <CardDescription className="mt-1 line-clamp-2">{form.description}</CardDescription>
            </div>
            {isSaved && <Badge variant="default" className="bg-green-600">Saved</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">{form.fields.length} fields</p>
        <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
            {form.fields.slice(0, 4).map(field => (
                <div key={field.id} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{getFieldIcon(field.type)}</span>
                    <span className="truncate">{field.label}</span>
                    {field.required && <span className="text-xs text-red-500">*Required</span>}
                </div>
            ))}
            {form.fields.length > 4 && <p className="text-xs text-muted-foreground">+ {form.fields.length - 4} more fields</p>}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant={isSelected ? "default" : "outline"} className="flex-1" onClick={() => onSelect(form.id)}>
            <CheckCircle className="mr-2 h-4 w-4"/>
            {isSelected ? 'Selected' : 'Select'}
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => onPreview(form)}>
            <Eye className="mr-2 h-4 w-4"/>
            Preview
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => onSave(form)} disabled={isSaved}>
            <Save className="mr-2 h-4 w-4"/>
            {isSaved ? 'Saved' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
};