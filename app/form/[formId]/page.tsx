// app/form/[formId]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { getFormById } from '@/lib/database';
import { GeneratedForm } from '@/lib/ai';
import FormPreview from '@/components/form-preview';
import { saveSubmission } from '@/lib/database';
import { toast } from 'sonner';

export default function PublicFormPage({ params }: { params: { formId: string } }) {
  const [form, setForm] = useState<GeneratedForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const formData = await getFormById(params.formId);
        if (formData.publishedAt) { // Only show published forms
            setForm(formData);
        } else {
            setError("This form is not available.");
        }
      } catch (err) {
        setError("Form not found.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [params.formId]);

  const handleSubmit = async (submissionData: any) => {
    try {
        await saveSubmission(params.formId, submissionData);
        toast.success("Your response has been submitted!");
    } catch (error) {
        toast.error("Failed to submit your response.");
        console.error(error);
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading form...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  }

  if (!form) {
    return <div className="flex h-screen items-center justify-center">Form not available.</div>;
  }

  return (
    <div className="min-h-screen bg-muted/40 py-12">
      <FormPreview form={form} onSubmit={handleSubmit} />
    </div>
  );
}