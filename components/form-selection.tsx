'use client';

import React, { useState } from 'react';
import { CheckCircle, Edit, Globe, Sparkles, ArrowRight, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GeneratedForm } from '@/lib/ai';

interface FormSelectionProps {
  forms: GeneratedForm[];
  onFormSelected: (form: GeneratedForm) => void;
  onEditForm: (form: GeneratedForm) => void;
  onTranslateForm: (form: GeneratedForm, language: string) => void;
}

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Russian', 'Japanese', 'Korean', 'Chinese', 'Arabic', 'Hindi'
];

export default function FormSelection({ forms, onFormSelected, onEditForm, onTranslateForm }: FormSelectionProps) {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [translating, setTranslating] = useState<string | null>(null);

  const handleFormSelect = (formId: string) => {
    setSelectedForm(formId);
  };

  const handleUseForm = () => {
    const form = forms.find(f => f.id === selectedForm);
    if (form) {
      onFormSelected(form);
    }
  };

  const handleTranslate = async (form: GeneratedForm, language: string) => {
    setTranslating(form.id);
    try {
      await onTranslateForm(form, language);
    } finally {
      setTranslating(null);
    }
  };

  const renderFieldPreview = (field: any) => {
    const getFieldIcon = (type: string) => {
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
        default: return '📝';
      }
    };

    return (
      <div key={field.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>{getFieldIcon(field.type)}</span>
        <span className="font-medium">{field.label}</span>
        {field.required && <Badge variant="outline" className="text-xs">Required</Badge>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Choose Your Form
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          We've generated 2 different form designs for you. Select the one you prefer or customize it further.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {forms.map((form, index) => (
          <Card 
            key={form.id} 
            className={`border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
              selectedForm === form.id 
                ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/50' 
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
            onClick={() => handleFormSelect(form.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                      Option {index + 1}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                      <Globe className="mr-1 h-3 w-3" />
                      {form.language}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {form.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    {form.description}
                  </CardDescription>
                </div>
                {selectedForm === form.id && (
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Form Fields Preview */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Form Fields ({form.fields.length})
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {form.fields.slice(0, 5).map(renderFieldPreview)}
                  {form.fields.length > 5 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{form.fields.length - 5} more fields
                    </div>
                  )}
                </div>
              </div>

              {/* Theme */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Theme:</span>
                <Badge variant="outline" className="capitalize">
                  {form.theme}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditForm(form);
                  }}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Copy form data to clipboard
                    navigator.clipboard.writeText(JSON.stringify(form, null, 2));
                  }}
                  className="flex-1"
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Translation Options */}
      {selectedForm && (
        <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Translate Form
            </CardTitle>
            <CardDescription>
              Need the form in a different language? We can translate it for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {languages.slice(0, 8).map((lang) => {
                const form = forms.find(f => f.id === selectedForm);
                const isCurrentLang = form?.language === lang;
                const isLoading = translating === selectedForm;
                
                return (
                  <Button
                    key={lang}
                    variant="outline"
                    size="sm"
                    disabled={isCurrentLang || isLoading}
                    onClick={() => form && handleTranslate(form, lang)}
                    className={`text-xs ${isCurrentLang ? 'bg-green-100 text-green-700 border-green-300' : ''}`}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600" />
                    ) : (
                      lang
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Use Selected Form Button */}
      {selectedForm && (
        <div className="flex justify-center">
          <Button
            onClick={handleUseForm}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Use This Form
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
