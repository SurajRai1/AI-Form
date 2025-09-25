'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Bell,
  CircleUser,
  Menu,
  Package2,
  Search,
  FileText,
  Send,
  Settings as SettingsIcon,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import AIDashboard from '@/components/ai-dashboard';
import FormBuilder from '@/components/form-builder';
import FormPreview from '@/components/form-preview';
import SubmissionsView from '@/components/submissions-view';
import AnalyticsDashboard from '@/components/analytics-dashboard'; // Import the new component
import { GeneratedForm } from '@/lib/ai';
import { getFormById, getFormSubmissions } from '@/lib/database';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme-toggle';

// A wrapper to use searchParams
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const formId = searchParams.get('formId');
  const tab = searchParams.get('tab') || 'forms'; // Default to forms tab

  const [activeTab, setActiveTab] = useState(tab);
  const [formToLoad, setFormToLoad] = React.useState<GeneratedForm | null>(null);
  const [formSubmissions, setFormSubmissions] = React.useState<any[]>([]);
  const [isLoadingForm, setIsLoadingForm] = React.useState(false);

  // Update activeTab when URL changes
  React.useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  React.useEffect(() => {
    if ((view === 'builder' || view === 'preview' || view === 'submissions' || view === 'analytics') && formId) {
      setIsLoadingForm(true);
      const fetchFormData = async () => {
        try {
          const form = await getFormById(formId);
          setFormToLoad(form);
          if (view === 'analytics') {
            const submissions = await getFormSubmissions(formId);
            setFormSubmissions(submissions);
          }
        } catch (error) {
          toast.error('Failed to load the form data.');
          console.error(error);
          router.push('/dashboard');
        } finally {
          setIsLoadingForm(false);
        }
      };
      fetchFormData();
    }
  }, [view, formId, router]);
  
  const handleBackToDashboard = () => {
    router.push('/dashboard?tab=forms');
  };

  if (isLoadingForm) {
      return (
        <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
  }

  if (view === 'builder' && formToLoad) {
    return <FormBuilder form={formToLoad} onSaveSuccess={handleBackToDashboard} />;
  }

  if (view === 'preview' && formToLoad) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Button onClick={handleBackToDashboard} variant="outline" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Forms
            </Button>
            <FormPreview form={formToLoad} />
        </div>
    );
  }

  if (view === 'submissions' && formToLoad) {
    return <SubmissionsView form={formToLoad} onBack={handleBackToDashboard} />;
  }

  if (view === 'analytics' && formToLoad) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Button onClick={handleBackToDashboard} variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forms
        </Button>
        <AnalyticsDashboard formId={formToLoad.id} formData={{ ...formToLoad, submissions: formSubmissions }} />
      </div>
    );
  }
  
  return <AIDashboard activeTab={activeTab as any} setActiveTab={(newTab) => router.push(`/dashboard?tab=${newTab}`)} />;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">FormCraft AI</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {/* These links now navigate via URL, which is more robust */}
              <Link
                href="/dashboard?tab=chat"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Send className="h-4 w-4" />
                AI Chat
              </Link>
              <Link
                href="/dashboard?tab=forms"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <FileText className="h-4 w-4" />
                My Forms
              </Link>
              <Link
                href="/dashboard?tab=analytics"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link
                href="/dashboard?tab=settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col max-h-screen overflow-hidden">
        {/* Header with Theme Toggle */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetHeader>
                <SheetTitle>FormCraft AI</SheetTitle>
                <SheetDescription>
                  Navigate to different sections of the application.
                </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="">FormCraft AI</span>
                </Link>
                 <Link
                    href="/dashboard?tab=chat"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                 >
                    <Send className="h-5 w-5" />
                    AI Chat
                </Link>
                <Link
                    href="/dashboard?tab=forms"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                    <FileText className="h-5 w-5" />
                    My Forms
                </Link>
                <Link
                    href="/dashboard?tab=analytics"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                    <BarChart3 className="h-5 w-5" />
                    Analytics
                </Link>
                <Link
                    href="/dashboard?tab=settings"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                    <SettingsIcon className="h-5 w-5" />
                    Settings
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search forms..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user ? user.email : 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto">
            <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
              <DashboardContent />
            </Suspense>
        </main>
      </div>
    </div>
  );
}