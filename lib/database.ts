// lib/database.ts
import { supabase } from '@/lib/supabase';
import { GeneratedForm } from '@/lib/ai';

// ... (keep all your other existing functions)

export const getPublishedFormIds = async () => {
  const { data, error } = await supabase
    .from('forms')
    .select('id')
    .not('published_at', 'is', null);

  if (error) {
    console.error('Error fetching published form IDs:', error);
    return [];
  }
  // Ensure we always return an array, even if Supabase returns null
  return data || [];
};

export const saveForm = async (userId: string, form: GeneratedForm) => {
  const { data, error } = await supabase
    .from('forms')
    .insert([{ 
        user_id: userId, 
        title: form.title, 
        description: form.description, 
        content: form,
        published: false, // Keep this for backward compatibility or simple state
        published_at: null,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getUserForms = async (userId: string) => {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const getFormById = async (formId: string) => {
  const { data, error } = await supabase
    .from('forms')
    .select('id, content, published_at') // Fetch published_at
    .eq('id', formId)
    .single();

  if (error) throw new Error(error.message);

  // Combine data correctly
  const form = data.content as GeneratedForm;
  form.id = data.id;
  form.publishedAt = data.published_at ? new Date(data.published_at) : undefined;
  
  return form;
};


export const updateForm = async (formId: string, form: GeneratedForm) => {
    const { data, error } = await supabase
        .from('forms')
        .update({ 
            title: form.title, 
            description: form.description, 
            content: form,
            published: !!form.publishedAt,
            published_at: form.publishedAt ? form.publishedAt.toISOString() : null,
        })
        .eq('id', formId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

export const deleteForm = async (formId: string) => {
    const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId);

    if (error) throw new Error(error.message);
    return;
};


export const saveSubmission = async (formId: string, submissionData: any) => {
  const { data, error } = await supabase
    .from('form_submissions')
    .insert([{ form_id: formId, data: submissionData }]);

  if (error) throw new Error(error.message);
  return data;
};