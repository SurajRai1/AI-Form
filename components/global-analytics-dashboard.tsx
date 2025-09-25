'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Clock, TrendingUp, Sparkles, Loader2, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getAggregatedFormStats } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GlobalAnalytics {
  totalForms: number;
  totalSubmissions: number;
  overallCompletionRate: number;
  averageTimeToComplete: number;
  mostActiveForm: { title: string; submissions: number } | null;
  leastActiveForm: { title: string; submissions: number } | null;
}

export default function GlobalAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<GlobalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const analyticsData = await getAggregatedFormStats(user.id);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error loading global analytics:', error);
        toast.error("Could not load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading global analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.totalForms === 0) {
    return (
      <div className="p-6 text-center">
         <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
        <p className="text-muted-foreground">Create and share a form to see your analytics here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Global Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            An overview of all your forms' performance.
          </p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
          <Sparkles className="mr-2 h-4 w-4" />
          AI-Powered Overview
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalForms}</div>
            <p className="text-xs text-muted-foreground">
              forms created
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              across all forms
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overallCompletionRate.toFixed(1)}%</div>
            <Progress value={analytics.overallCompletionRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time to Complete</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analytics.averageTimeToComplete)}s</div>
             <p className="text-xs text-muted-foreground">
              average across all forms
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Form Performance Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Most Active Form</CardTitle>
                <CardDescription>Your form with the highest number of submissions.</CardDescription>
            </CardHeader>
            <CardContent>
                {analytics.mostActiveForm ? (
                    <div>
                        <p className="text-lg font-semibold text-primary">{analytics.mostActiveForm.title}</p>
                        <p className="text-2xl font-bold">{analytics.mostActiveForm.submissions} <span className="text-sm font-normal text-muted-foreground">submissions</span></p>
                    </div>
                ) : <p className="text-muted-foreground">Not enough data.</p>}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Least Active Form</CardTitle>
                <CardDescription>Your form with the lowest number of submissions.</CardDescription>
            </CardHeader>
            <CardContent>
                 {analytics.leastActiveForm ? (
                    <div>
                        <p className="text-lg font-semibold text-muted-foreground">{analytics.leastActiveForm.title}</p>
                        <p className="text-2xl font-bold">{analytics.leastActiveForm.submissions} <span className="text-sm font-normal text-muted-foreground">submissions</span></p>
                    </div>
                ) : <p className="text-muted-foreground">Not enough data.</p>}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}