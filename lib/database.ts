// lib/database.ts
import { supabase } from '@/lib/supabase';
import { GeneratedForm } from '@/lib/ai';

export const saveForm = async (userId: string, form: GeneratedForm) => {
  const { data, error } = await supabase
    .from('forms')
    .insert([{ 
        user_id: userId, 
        title: form.title, 
        description: form.description, 
        content: form,
        published: false
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
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data;
};

export const getFormById = async (formId: string) => {
  const { data, error } = await supabase
    .from('forms')
    .select('content')
    .eq('id', formId)
    .single();

  if (error) throw new Error(error.message);
  return data.content; 
};

export const updateForm = async (formId: string, form: GeneratedForm) => {
    const { data, error } = await supabase
        .from('forms')
        .update({ 
            title: form.title, 
            description: form.description, 
            content: form,
            published: form.publishedAt ? true : false
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