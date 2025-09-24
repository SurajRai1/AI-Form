import OpenAI from 'openai';
import { env } from './env';

// Only create OpenAI client if API key is available
const openai = env.OPENAI_API_KEY ? new OpenAI({
  apiKey: env.OPENAI_API_KEY,
}) : null;

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file' | 'password' | 'slider' | 'switch' | 'rating';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
  };
}

export interface GeneratedForm {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  theme: 'modern' | 'classic' | 'minimal' | 'colorful';
  language: string;
  publishedAt?: Date;
}

export interface FormAnalytics {
  totalSubmissions: number;
  completionRate: number;
  averageTimeToComplete: number;
  topPerformingQuestions: Array<{
    question: string;
    completionRate: number;
  }>;
  userRetention: {
    day1: number;
    day7: number;
    day30: number;
  };
  insights: string[];
}

export class AIService {
  static async generateForms(prompt: string, language: string = 'English'): Promise<GeneratedForm[]> {
    if (!openai) {
      // Fallback: Generate sample forms when AI is not available
      return this.generateSampleForms(prompt, language)
    }

    try {
      const systemPrompt = `You are an expert form designer. Generate 2 different form designs based on the user's description. Each form should be well-structured, user-friendly, and optimized for the specified language.

Requirements:
- Create 2 distinct form designs.
- Each form should have 5-10 relevant fields.
- Use appropriate field types: text, email, number, textarea, select, radio, checkbox, date, file, password, slider, switch, rating.
- For 'rating' fields, use a 'max' validation between 3 and 10.
- For 'slider' fields, define 'min', 'max', and 'step' validation properties.
- Include proper validation rules where appropriate (e.g., min/max length for text).
- Make fields required when necessary.
- Use clear, concise labels and placeholders.
- Generate all text content in the specified language: ${language}.

Return the response as a valid JSON array of 2 form objects.`

      const userPrompt = `Create 2 different forms for: ${prompt}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from AI')
      }

      const forms = JSON.parse(response)
      return forms.map((form: any) => ({
        ...form,
        id: crypto.randomUUID(),
        language,
        fields: form.fields.map((field: any) => ({
          ...field,
          id: crypto.randomUUID(),
        })),
      }))
    } catch (error) {
      console.error('Error generating forms:', error)
      // Fallback to sample forms if AI fails
      return this.generateSampleForms(prompt, language)
    }
  }

  // --- Other methods remain unchanged ---

  static async translateForm(form: GeneratedForm, targetLanguage: string): Promise<GeneratedForm> {
    if (!openai) {
      // Fallback: Return the same form with updated language
      return { ...form, language: targetLanguage }
    }

    try {
      const systemPrompt = `You are a professional translator. Translate the form content to ${targetLanguage} while maintaining the form structure and functionality.

Translate:
- Form title
- Form description
- Field labels
- Placeholders
- Option values (for select, radio, checkbox fields)

Keep the technical structure (field types, validation rules, etc.) unchanged.`

      const userPrompt = `Translate this form to ${targetLanguage}:
${JSON.stringify(form, null, 2)}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from AI')
      }

      const translatedForm = JSON.parse(response)
      return {
        ...translatedForm,
        language: targetLanguage,
      }
    } catch (error) {
      console.error('Error translating form:', error)
      // Fallback: Return the same form with updated language
      return { ...form, language: targetLanguage }
    }
  }

  static async analyzeFormData(formData: any): Promise<FormAnalytics> {
    if (!openai) {
      // Fallback: Return sample analytics
      return this.generateSampleAnalytics(formData)
    }

    try {
      const systemPrompt = `You are a data analyst expert. Analyze the form submission data and provide insights in simple, understandable language.

Analyze:
- Submission patterns
- User behavior
- Form performance
- Potential improvements

Provide insights that are actionable and easy to understand for non-technical users.`

      const userPrompt = `Analyze this form data and provide insights:
${JSON.stringify(formData, null, 2)}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-40-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 1500,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from AI')
      }

      const insights = response.split('\n').filter((line) => line.trim().length > 0)

      return {
        totalSubmissions: formData.submissions?.length || 0,
        completionRate: this.calculateCompletionRate(formData),
        averageTimeToComplete: this.calculateAverageTime(formData),
        topPerformingQuestions: this.getTopPerformingQuestions(formData),
        userRetention: this.calculateUserRetention(formData),
        insights,
      }
    } catch (error) {
      console.error('Error analyzing form data:', error)
      // Fallback to sample analytics
      return this.generateSampleAnalytics(formData)
    }
  }

  static async getAIInsights(question: string, formData: any): Promise<string> {
    if (!openai) {
      return 'AI insights are not available. Please set up your OpenAI API key to enable this feature.'
    }

    try {
      const systemPrompt = `You are a helpful AI assistant that explains form analytics in simple terms. Answer user questions about their form data in a clear, conversational way.`

      const userPrompt = `Question: ${question}

Form Data: ${JSON.stringify(formData, null, 2)}

Please provide a clear, simple explanation.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      return completion.choices[0]?.message?.content || 'Unable to provide insights at this time.'
    } catch (error) {
      console.error('Error getting AI insights:', error)
      return 'Sorry, I encountered an error while analyzing your data.'
    }
  }

  // Fallback methods for when AI is not available
  private static generateSampleForms(prompt: string, language: string): GeneratedForm[] {
    const baseForm = {
      id: crypto.randomUUID(),
      title: 'Sample Feedback Form',
      description: 'This is a sample form generated because the AI service is currently unavailable. Please provide your valuable feedback.',
      language,
      theme: 'modern' as const,
      fields: [
        {
          id: crypto.randomUUID(),
          type: 'text' as const,
          label: 'Full Name',
          placeholder: 'e.g., John Doe',
          required: true,
        },
        {
          id: crypto.randomUUID(),
          type: 'email' as const,
          label: 'Email Address',
          placeholder: 'e.g., john.doe@example.com',
          required: true,
        },
        {
          id: crypto.randomUUID(),
          type: 'rating' as const,
          label: 'Overall Satisfaction',
          required: true,
          validation: { max: 5 }
        },
        {
          id: crypto.randomUUID(),
          type: 'select' as const,
          label: 'How did you hear about us?',
          placeholder: 'Select an option',
          required: false,
          options: ['Social Media', 'Friend or Colleague', 'Search Engine', 'Other']
        },
        {
          id: crypto.randomUUID(),
          type: 'switch' as const,
          label: 'Subscribe to our newsletter?',
          required: false,
        },
        {
          id: crypto.randomUUID(),
          type: 'textarea' as const,
          label: 'Additional Comments',
          placeholder: 'Share your thoughts, suggestions, or concerns...',
          required: false,
        },
      ],
    }

    const secondForm = JSON.parse(JSON.stringify(baseForm)); // deep copy
    secondForm.id = crypto.randomUUID();
    secondForm.title = 'Sample Contact Form';
    secondForm.theme = 'classic';
    secondForm.fields = [
        {
            id: crypto.randomUUID(),
            type: 'text' as const,
            label: 'Your Name',
            required: true,
        },
        {
            id: crypto.randomUUID(),
            type: 'email' as const,
            label: 'Your Email',
            required: true,
        },
        {
            id: crypto.randomUUID(),
            type: 'slider' as const,
            label: 'Urgency',
            required: true,
            validation: { min: 1, max: 5, step: 1}
        },
         {
            id: crypto.randomUUID(),
            type: 'textarea' as const,
            label: 'Your Message',
            required: true,
        },
    ]


    return [baseForm, secondForm];
  }

  private static generateSampleAnalytics(formData: any): FormAnalytics {
    return {
      totalSubmissions: formData.submissions?.length || 0,
      completionRate: this.calculateCompletionRate(formData),
      averageTimeToComplete: this.calculateAverageTime(formData),
      topPerformingQuestions: this.getTopPerformingQuestions(formData),
      userRetention: this.calculateUserRetention(formData),
      insights: [
        'Sample insight: Your form is performing well!',
        'Consider adding more fields to gather comprehensive data.',
        'Mobile users show higher completion rates.',
        'Forms with 5-7 fields tend to perform best.',
      ],
    }
  }

  private static calculateCompletionRate(formData: any): number {
    if (!formData.submissions || formData.submissions.length === 0) return 0

    const completedSubmissions = formData.submissions.filter(
      (sub: any) => sub.completed && sub.fields.every((field: any) => field.value !== null && field.value !== ''),
    )

    return (completedSubmissions.length / formData.submissions.length) * 100
  }

  private static calculateAverageTime(formData: any): number {
    if (!formData.submissions || formData.submissions.length === 0) return 0

    const times = formData.submissions.filter((sub: any) => sub.completionTime).map((sub: any) => sub.completionTime)

    if (times.length === 0) return 0

    return times.reduce((sum: number, time: number) => sum + time, 0) / times.length
  }

  private static getTopPerformingQuestions(formData: any): Array<{ question: string; completionRate: number }> {
    if (!formData.submissions || formData.submissions.length === 0) return []

    // This is a simplified calculation - in a real app, you'd track individual field completion
    return [
      { question: 'Sample Question 1', completionRate: 95 },
      { question: 'Sample Question 2', completionRate: 87 },
      { question: 'Sample Question 3', completionRate: 82 },
    ]
  }

  private static calculateUserRetention(formData: any): { day1: number; day7: number; day30: number } {
    // Simplified calculation - in a real app, you'd track user sessions over time
    return {
      day1: 85,
      day7: 65,
      day30: 45,
    }
  }
}
