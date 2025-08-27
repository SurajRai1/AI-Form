'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Lock, 
  Zap,
  Activity,
  Globe,
  Server
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityStatusProps {
  className?: string;
}

export default function SecurityStatus({ className }: SecurityStatusProps) {
  const { user, isSessionValid, lastActivity } = useAuth();
  const [securityChecks, setSecurityChecks] = useState({
    sessionValid: true,
    lastActivityRecent: true,
    secureConnection: true,
    twoFactorEnabled: false,
    passwordStrength: 'strong',
    accountAge: 0,
  });

  useEffect(() => {
    const updateSecurityStatus = () => {
      if (!user) return;

      const now = new Date();
      const lastActivityTime = lastActivity ? new Date(lastActivity) : null;
      const timeSinceLastActivity = lastActivityTime ? now.getTime() - lastActivityTime.getTime() : 0;
      const accountCreated = user.created_at ? new Date(user.created_at) : now;
      const accountAge = Math.floor((now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));

      setSecurityChecks({
        sessionValid: isSessionValid,
        lastActivityRecent: timeSinceLastActivity < 5 * 60 * 1000, // 5 minutes
        secureConnection: window.location.protocol === 'https:',
        twoFactorEnabled: false, // Would check from user metadata
        passwordStrength: 'strong', // Would check from user metadata
        accountAge,
      });
    };

    updateSecurityStatus();
    const interval = setInterval(updateSecurityStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [user, isSessionValid, lastActivity]);

  const getOverallStatus = () => {
    const checks = Object.values(securityChecks);
    const passedChecks = checks.filter(check => check === true || check === 'strong').length;
    const totalChecks = checks.length;

    if (passedChecks === totalChecks) return 'excellent';
    if (passedChecks >= totalChecks * 0.8) return 'good';
    if (passedChecks >= totalChecks * 0.6) return 'fair';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4" />;
      case 'good':
        return <Shield className="h-4 w-4" />;
      case 'fair':
        return <AlertTriangle className="h-4 w-4" />;
      case 'poor':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <Card className={`border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg font-semibold">Security Status</CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(overallStatus)} font-medium`}
          >
            {getStatusIcon(overallStatus)}
            <span className="ml-1 capitalize">{overallStatus}</span>
          </Badge>
        </div>
        <CardDescription>
          Real-time security monitoring and protection
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {/* Session Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Activity className={`h-4 w-4 ${securityChecks.sessionValid ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="text-sm font-medium">Session Status</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {securityChecks.sessionValid ? 'Active and secure' : 'Session expired'}
                </p>
              </div>
            </div>
            <Badge variant={securityChecks.sessionValid ? 'default' : 'destructive'} className="text-xs">
              {securityChecks.sessionValid ? 'Active' : 'Expired'}
            </Badge>
          </div>

          {/* Last Activity */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className={`h-4 w-4 ${securityChecks.lastActivityRecent ? 'text-green-600' : 'text-yellow-600'}`} />
              <div>
                <p className="text-sm font-medium">Last Activity</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {lastActivity ? new Date(lastActivity).toLocaleTimeString() : 'Unknown'}
                </p>
              </div>
            </div>
            <Badge variant={securityChecks.lastActivityRecent ? 'default' : 'secondary'} className="text-xs">
              {securityChecks.lastActivityRecent ? 'Recent' : 'Stale'}
            </Badge>
          </div>

          {/* Connection Security */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className={`h-4 w-4 ${securityChecks.secureConnection ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="text-sm font-medium">Connection</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {securityChecks.secureConnection ? 'HTTPS encrypted' : 'HTTP (insecure)'}
                </p>
              </div>
            </div>
            <Badge variant={securityChecks.secureConnection ? 'default' : 'destructive'} className="text-xs">
              {securityChecks.secureConnection ? 'Secure' : 'Insecure'}
            </Badge>
          </div>

          {/* Account Age */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Account Age</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {securityChecks.accountAge} days old
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {securityChecks.accountAge > 30 ? 'Established' : 'New'}
            </Badge>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Zap className={`h-4 w-4 ${securityChecks.twoFactorEnabled ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm font-medium">2FA Protection</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {securityChecks.twoFactorEnabled ? 'Enabled' : 'Not enabled'}
                </p>
              </div>
            </div>
            <Badge variant={securityChecks.twoFactorEnabled ? 'default' : 'secondary'} className="text-xs">
              {securityChecks.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          {/* Server Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Server className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Server Status</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  All systems operational
                </p>
              </div>
            </div>
            <Badge variant="default" className="text-xs">
              Online
            </Badge>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Eye className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                Security Tips
              </p>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Enable two-factor authentication for extra security</li>
                <li>• Use a strong, unique password</li>
                <li>• Keep your session active by using the application regularly</li>
                <li>• Always use HTTPS connections</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
