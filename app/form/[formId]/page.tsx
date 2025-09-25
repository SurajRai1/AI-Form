// app/form/[formId]/page.tsx
import { getFormById } from '@/lib/database';
import PublicFormClient from '@/components/public-form-client';
import { notFound } from 'next/navigation';

// This is the server component that fetches data for each page when a user visits the URL.
export default async function PublicFormPage({ params }: { params: { formId: string } }) {
  try {
    const form = await getFormById(params.formId);

    // If the form is not found or not published, show a 404 page.
    if (!form || !form.publishedAt) {
      notFound();
    }

    // Pass the fetched form data to the client component to be rendered.
    return <PublicFormClient form={form} />;
  } catch (error) {
    console.error(`Error fetching form for ID ${params.formId}:`, error);
    notFound();
  }
}