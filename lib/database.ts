// lib/database.ts
import { supabase } from '@/lib/supabase';
import { GeneratedForm } from '@/lib/ai';

export const saveForm = async (userId: string, form: GeneratedForm) => {
  const { data, error } = await supabase
    .from('forms')
    .insert([{ user_id: userId, title: form.title, description: form.description, content: form }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

export const getUserForms = async (userId: string) => {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data;
};

export const getFormById = async (formId: string) => {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const saveSubmission = async (formId: string, submissionData: any) => {
  const { data, error } = await supabase
    .from('form_submissions')
    .insert([{ form_id: formId, data: submissionData }]);

  if (error) throw new Error(error.message);
  return data;
};