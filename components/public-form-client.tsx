'use client';

import { useState } from 'react';
import { GeneratedForm } from '@/lib/ai';
import FormPreview from '@/components/form-preview';
import { saveSubmission } from '@/lib/database';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

interface PublicFormClientProps {
  form: GeneratedForm;
}

export default function PublicFormClient({ form }: PublicFormClientProps) {
  const handleSubmit = async (submissionData: any) => {
    try {
      await saveSubmission(form.id, submissionData);
      // The success message is handled within FormPreview component
    } catch (error) {
      toast.error("Failed to submit your response. Please try again.");
      console.error(error);
      // Re-throw to let FormPreview know submission failed
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-12 px-4">
      <FormPreview form={form} onSubmit={handleSubmit} />
      <footer className="text-center mt-8">
        <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            Powered by <Sparkles className="h-4 w-4 text-purple-500" /> FormCraft AI
        </a>
      </footer>
    </div>
  );
}