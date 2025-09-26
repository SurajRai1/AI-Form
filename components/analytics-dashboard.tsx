'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Clock, TrendingUp, MessageSquare, Sparkles, Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AIService, FormAnalytics } from '@/lib/ai';
import { getCachedAnalysis, cacheAnalysis } from '@/lib/database';
import { toast } from 'sonner';


interface AnalyticsDashboardProps {
  formId: string;
  formData: any;
}

export default function AnalyticsDashboard({ formId, formData }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<FormAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [formData]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
        const cachedData = await getCachedAnalysis(formId);
        const cacheTimestamp = cachedData ? new Date(cachedData.generated_at) : null;
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        if (cachedData && cacheTimestamp && cacheTimestamp > oneHourAgo) {
            setAnalytics(cachedData.analysis);
            toast.info("Loaded cached analytics data.");
        } else {
            const analyticsData = await AIService.analyzeFormData(formData);
            await cacheAnalysis(formId, analyticsData);
            setAnalytics(analyticsData);
            toast.success("Generated new form analytics.");
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
        toast.error("Failed to load analytics data.");
    } finally {
        setLoading(false);
    }
  };


  const askAI = async () => {
    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    try {
      const response = await AIService.getAIInsights(aiQuestion, formData);
      setAiResponse(response);
    } catch (error) {
      setAiResponse('Sorry, I encountered an error while analyzing your data.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Form Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered insights and detailed performance metrics
          </p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
          <Sparkles className="mr-2 h-4 w-4" />
          AI-Powered
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completionRate.toFixed(1)}%</div>
            <Progress value={analytics.completionRate} className="mt-2" />
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
              -5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Retention</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.userRetention.day1}%</div>
            <p className="text-xs text-muted-foreground">
              Day 1 retention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Questions</CardTitle>
            <CardDescription>
              Questions with the highest completion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPerformingQuestions.map((question, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">{question.question}</p>
                    <p className="text-xs text-muted-foreground">
                      {question.completionRate}% completion rate
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    #{index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Retention Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Retention</CardTitle>
            <CardDescription>
              How users engage with your form over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Day 1</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${analytics.userRetention.day1}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analytics.userRetention.day1}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Day 7</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${analytics.userRetention.day7}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analytics.userRetention.day7}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Day 30</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${analytics.userRetention.day30}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analytics.userRetention.day30}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI-Generated Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Automated analysis of your form performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.insights.slice(0, 5).map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-blue-900 dark:text-blue-100">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ask AI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Ask AI Assistant
            </CardTitle>
            <CardDescription>
              Get personalized insights about your form data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Ask about your form performance..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askAI()}
              />
              <Button 
                onClick={askAI} 
                disabled={aiLoading || !aiQuestion.trim()}
                className="w-full"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Ask AI
                  </>
                )}
              </Button>
            </div>

            {aiResponse && (
              <div className="p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-purple-900 dark:text-purple-100">{aiResponse}</p>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="font-medium mb-1">Example questions:</p>
              <ul className="space-y-1">
                <li>• "Why is my completion rate low?"</li>
                <li>• "Which questions are causing drop-offs?"</li>
                <li>• "How can I improve user engagement?"</li>
                <li>• "What patterns do you see in the data?"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>
            Latest form submissions and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.submissions?.slice(0, 5).map((submission: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Submission #{submission.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(submission.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant={submission.completed ? "default" : "secondary"}>
                  {submission.completed ? "Completed" : "Incomplete"}
                </Badge>
              </div>
            ))}
            
            {(!formData.submissions || formData.submissions.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No submissions yet. Share your form to start collecting data!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}