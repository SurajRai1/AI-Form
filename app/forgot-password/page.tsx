'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-green-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Check your email
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  We've sent you a password reset link to your email address.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please check your email and click the reset link to create a new password.
              </p>
              <Link href="/signin">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          FormCraft AI
        </h1>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Reset your password
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Form Builder
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                {error}
              </div>
            )}

            {/* Reset Password Form */}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending reset link...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Send reset link
                    <Mail className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Back to Sign In Link */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <Link
                href="/signin"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>By requesting a password reset, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
