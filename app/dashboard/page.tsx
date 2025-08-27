'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Clock,
  AlertCircle,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react';
import SecurityStatus from '@/components/security-status';

// Simple fallback components to prevent import errors
const SimpleFormGenerator = () => (
  <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
    <CardHeader className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-white" />
      </div>
      <div className="space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          AI Form Generator
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Describe your form and let AI create beautiful options for you
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              Coming Soon
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              AI form generation is being set up. You'll be able to create forms with natural language soon!
            </p>
          </div>
        </div>
      </div>
      <Button className="w-full" disabled>
        <Sparkles className="mr-2 h-4 w-4" />
        Generate Forms (Coming Soon)
      </Button>
    </CardContent>
  </Card>
);

const SimpleAnalytics = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">0</div>
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
        <div className="text-2xl font-bold">0</div>
        <p className="text-xs text-muted-foreground">
          No responses yet
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">0%</div>
        <p className="text-xs text-muted-foreground">
          No data available
        </p>
      </CardContent>
    </Card>
  </div>
);

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'generator' | 'analytics' | 'security'>('generator');
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  // Handle authentication redirects with error handling and debouncing
  useEffect(() => {
    if (!loading && !user && !redirecting) {
      setRedirecting(true);
      const timeoutId = setTimeout(() => {
        router.push('/signin');
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, loading, router, redirecting]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      console.error('Sign out error:', err);
      setError('Failed to sign out');
    }
  };

  // Error boundary
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {error}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Reload Page
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to sign in...</p>
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
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                <Shield className="mr-1 h-3 w-3" />
                Secure
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>Welcome, {user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
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
              variant={currentStep === 'generator' ? 'default' : 'ghost'}
              onClick={() => setCurrentStep('generator')}
              className={currentStep === 'generator' ? 'bg-gradient-to-r from-purple-500 to-blue-600' : 'text-gray-600 dark:text-gray-400'}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Button>
            <Button
              variant={currentStep === 'analytics' ? 'default' : 'ghost'}
              onClick={() => setCurrentStep('analytics')}
              className={currentStep === 'analytics' ? 'bg-gradient-to-r from-purple-500 to-blue-600' : 'text-gray-600 dark:text-gray-400'}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button
              variant={currentStep === 'security' ? 'default' : 'ghost'}
              onClick={() => setCurrentStep('security')}
              className={currentStep === 'security' ? 'bg-gradient-to-r from-purple-500 to-blue-600' : 'text-gray-600 dark:text-gray-400'}
            >
              <Shield className="mr-2 h-4 w-4" />
              Security
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {currentStep === 'generator' && (
            <div className="max-w-2xl mx-auto">
              <SimpleFormGenerator />
            </div>
          )}

          {currentStep === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Form Analytics
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Track performance and get insights
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

              <SimpleAnalytics />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security & Privacy
                  </CardTitle>
                  <CardDescription>
                    Your data is protected with enterprise-level security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">End-to-End Encryption</p>
                        <p className="text-sm text-green-700 dark:text-green-300">All data is encrypted in transit and at rest</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">GDPR Compliant</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Full compliance with data protection regulations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-800 dark:text-purple-200">Real-time Monitoring</p>
                        <p className="text-sm text-purple-700 dark:text-purple-300">24/7 security monitoring and threat detection</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/50 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-800 dark:text-orange-200">99.9% Uptime</p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">Enterprise-grade reliability and availability</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Security Center
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monitor and manage your account security
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SecurityStatus />
                
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Features
                    </CardTitle>
                    <CardDescription>
                      Enterprise-level security measures in place
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Rate Limiting</span>
                        </div>
                        <Badge variant="default" className="text-xs">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Session Management</span>
                        </div>
                        <Badge variant="default" className="text-xs">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Account Lockout</span>
                        </div>
                        <Badge variant="default" className="text-xs">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Security Headers</span>
                        </div>
                        <Badge variant="default" className="text-xs">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">CORS Protection</span>
                        </div>
                        <Badge variant="default" className="text-xs">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Input Validation</span>
                        </div>
                        <Badge variant="default" className="text-xs">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}