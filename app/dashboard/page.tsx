'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Sparkles, 
  Globe, 
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';
import AIFormGenerator from '@/components/ai-form-generator';
import FormSelection from '@/components/form-selection';
import FormBuilder from '@/components/form-builder';
import AnalyticsDashboard from '@/components/analytics-dashboard';
import { GeneratedForm } from '@/lib/ai';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [currentStep, setCurrentStep] = useState<'generator' | 'selection' | 'builder' | 'analytics'>('generator');
  const [generatedForms, setGeneratedForms] = useState<GeneratedForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<GeneratedForm | null>(null);
  const [publishedForms, setPublishedForms] = useState<GeneratedForm[]>([]);

  const handleFormsGenerated = (forms: GeneratedForm[]) => {
    setGeneratedForms(forms);
    setCurrentStep('selection');
  };

  const handleFormSelected = (form: GeneratedForm) => {
    setSelectedForm(form);
    setCurrentStep('builder');
  };

  const handleFormEdited = (form: GeneratedForm) => {
    setSelectedForm(form);
    setCurrentStep('builder');
  };

  const handleFormTranslated = async (form: GeneratedForm, language: string) => {
    // This would call the AI translation service
    console.log('Translating form to:', language);
    // For now, just update the language
    const updatedForm = { ...form, language };
    setSelectedForm(updatedForm);
  };

  const handleFormSaved = (form: GeneratedForm) => {
    console.log('Form saved:', form);
    // In a real app, this would save to the database
  };

  const handleFormPublished = (form: GeneratedForm) => {
    const publishedForm = { ...form, id: `published-${Date.now()}`, publishedAt: new Date() };
    setPublishedForms(prev => [...prev, publishedForm]);
    setCurrentStep('analytics');
    
    // Generate a shareable link
    const shareableLink = `${window.location.origin}/form/${publishedForm.id}`;
    console.log('Form published! Shareable link:', shareableLink);
    
    // In a real app, you'd show a modal with the link
    alert(`Form published successfully! Shareable link: ${shareableLink}`);
  };

  const handleBackToGenerator = () => {
    setCurrentStep('generator');
    setGeneratedForms([]);
    setSelectedForm(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FormCraft AI
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>Welcome, {user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="border-gray-300 dark:border-gray-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToGenerator}
              className="text-gray-600 dark:text-gray-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Form
            </Button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Step {currentStep === 'generator' ? 1 : currentStep === 'selection' ? 2 : currentStep === 'builder' ? 3 : 4} of 4</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-2xl">
            <div className={`flex items-center gap-2 ${currentStep === 'generator' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'generator' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Generate</span>
            </div>
            <div className={`flex-1 h-px ${currentStep !== 'generator' ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center gap-2 ${currentStep === 'selection' ? 'text-purple-600' : currentStep === 'builder' || currentStep === 'analytics' ? 'text-gray-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'selection' ? 'bg-purple-100 text-purple-600' : currentStep === 'builder' || currentStep === 'analytics' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Choose</span>
            </div>
            <div className={`flex-1 h-px ${currentStep === 'builder' || currentStep === 'analytics' ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center gap-2 ${currentStep === 'builder' ? 'text-purple-600' : currentStep === 'analytics' ? 'text-gray-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'builder' ? 'bg-purple-100 text-purple-600' : currentStep === 'analytics' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Build</span>
            </div>
            <div className={`flex-1 h-px ${currentStep === 'analytics' ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center gap-2 ${currentStep === 'analytics' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'analytics' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
              }`}>
                4
              </div>
              <span className="text-sm font-medium">Analytics</span>
            </div>
          </div>
            </div>

        {/* Content */}
        <div className="space-y-8">
          {currentStep === 'generator' && (
            <div className="max-w-2xl mx-auto">
              <AIFormGenerator onFormGenerated={handleFormsGenerated} />
            </div>
          )}

          {currentStep === 'selection' && generatedForms.length > 0 && (
            <FormSelection
              forms={generatedForms}
              onFormSelected={handleFormSelected}
              onEditForm={handleFormEdited}
              onTranslateForm={handleFormTranslated}
            />
          )}

          {currentStep === 'builder' && selectedForm && (
            <FormBuilder
              form={selectedForm}
              onSave={handleFormSaved}
              onPublish={handleFormPublished}
              onTranslate={handleFormTranslated}
            />
          )}

          {currentStep === 'analytics' && publishedForms.length > 0 && (
            <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Form Analytics
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Track performance and get AI-powered insights
                </p>
              </div>
              <Button 
                variant="outline"
                  onClick={() => setCurrentStep('generator')}
              >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Form
              </Button>
            </div>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="forms">My Forms</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{publishedForms.length}</div>
                        <p className="text-xs text-muted-foreground">
                          Published forms
                        </p>
                      </CardContent>
                    </Card>

              <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-muted-foreground">
                          +12% from last month
                        </p>
                </CardContent>
              </Card>

              <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                        <div className="text-2xl font-bold">78%</div>
                        <p className="text-xs text-muted-foreground">
                          +5% from last month
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  {publishedForms.map((form, index) => (
                    <Card key={form.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{form.title}</span>
                          <Badge variant="outline">
                            <Globe className="mr-1 h-3 w-3" />
                            {form.language}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{form.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AnalyticsDashboard 
                          formId={form.id} 
                          formData={{
                            submissions: [
                              { id: 1, completed: true, timestamp: new Date(), fields: [] },
                              { id: 2, completed: false, timestamp: new Date(), fields: [] },
                              { id: 3, completed: true, timestamp: new Date(), fields: [] },
                            ]
                          }} 
                        />
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="forms" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publishedForms.map((form) => (
                      <Card key={form.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{form.title}</CardTitle>
                            <Badge variant="outline">
                              <Globe className="mr-1 h-3 w-3" />
                              {form.language}
                            </Badge>
                          </div>
                          <CardDescription>{form.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>Fields:</span>
                              <span className="font-medium">{form.fields.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Theme:</span>
                              <Badge variant="outline" className="capitalize">
                                {form.theme}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Published:</span>
                              <span className="font-medium">
                                {form.publishedAt ? new Date(form.publishedAt).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <Button className="w-full mt-4">
                              View Analytics
                            </Button>
                  </div>
                </CardContent>
              </Card>
                    ))}
            </div>
          </TabsContent>
        </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}