'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, Globe, Loader2, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIService, GeneratedForm } from '@/lib/ai';
import { env } from '@/lib/env';

interface AIFormGeneratorProps {
  onFormGenerated: (forms: GeneratedForm[]) => void;
}

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Russian', 'Japanese', 'Korean', 'Chinese', 'Arabic', 'Hindi',
  'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish'
];

export default function AIFormGenerator({ onFormGenerated }: AIFormGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAIAvailable = !!env.OPENAI_API_KEY;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe the form you want to create');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const forms = await AIService.generateForms(prompt, language);
      onFormGenerated(forms);
    } catch (error) {
      setError('Failed to generate forms. Please try again.');
      console.error('Error generating forms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
          <Wand2 className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            AI Form Generator
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Describe your form and let AI create 2 beautiful options for you
          </CardDescription>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-4 py-2 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
            <Sparkles className="mr-2 h-4 w-4" />
            {isAIAvailable ? 'Powered by GPT-4' : 'Demo Mode'}
          </Badge>
          {!isAIAvailable && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-4 py-2 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
              <AlertCircle className="mr-2 h-4 w-4" />
              AI Not Available
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* AI Status Notification */}
        {!isAIAvailable && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  AI Features Not Available
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  OpenAI API key is not configured. You'll see sample forms instead of AI-generated ones. 
                  To enable full AI features, add your OpenAI API key to the environment variables.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Form Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Describe your form
          </label>
          <Textarea
            placeholder="e.g., Create a customer feedback form for a restaurant with questions about food quality, service, and overall experience..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Be specific about the type of form, target audience, and what information you want to collect
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Form Language
          </label>
          <Select value={language} onValueChange={setLanguage} disabled={loading}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
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

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isAIAvailable ? 'Generating forms...' : 'Creating sample forms...'}
            </div>
          ) : (
            <div className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4" />
              {isAIAvailable ? 'Generate 2 Form Options' : 'Create Sample Forms'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips for better results:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Mention the purpose and target audience</li>
            <li>• Specify the type of information you need</li>
            <li>• Include any specific requirements or preferences</li>
            <li>• Be clear about the form's tone and style</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}