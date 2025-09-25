'use client';

import React, { useEffect, useState } from 'react';
import { getFormSubmissions } from '@/lib/database';
import { GeneratedForm, FormField } from '@/lib/ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface SubmissionsViewProps {
  form: GeneratedForm;
  onBack: () => void;
}

// Helper to format date strings
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function SubmissionsView({ form, onBack }: SubmissionsViewProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const fetchedSubmissions = await getFormSubmissions(form.id);
        setSubmissions(fetchedSubmissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [form.id]);

  const headers = form.fields.map((field: FormField) => ({
    id: field.id,
    label: field.label,
  }));

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? <Badge variant="default">Yes</Badge> : <Badge variant="secondary">No</Badge>;
    }
    return value?.toString() || '-';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
       <Button onClick={onBack} variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forms
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{form.title} - Submissions</CardTitle>
          <CardDescription>
            Viewing {submissions.length} response(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No submissions yet for this form.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Submission Date</TableHead>
                    {headers.map(header => (
                      <TableHead key={header.id}>{header.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{formatDate(submission.created_at)}</TableCell>
                      {headers.map(header => (
                        <TableCell key={header.id}>
                          {renderValue(submission.data[header.id])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}