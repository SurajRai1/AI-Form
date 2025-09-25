// lib/ai.ts
import { GoogleGenAI } from '@google/genai'; // Changed import from 'openai'
import { env } from './env';

// Only create Gemini client if API key is available
const gemini = env.GEMINI_API_KEY ? new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
}) : null; // Changed from openai client initialization

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

    // Helper function to call Gemini for a structured JSON response
    private static async getJsonContent(
        systemPrompt: string, 
        userPrompt: string, 
        model: string = 'gemini-2.5-flash'
    ): Promise<any> {
        if (!gemini) {
            throw new Error('Gemini API key is not configured.');
        }

        const response = await gemini.models.generateContent({
            model: model,
            contents: [
                { role: 'user', parts: [{ text: userPrompt }] }
            ],
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json", 
                responseSchema: {
                    type: "object",
                    properties: {
                        forms: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    fields: { type: "array", items: { type: "object" } },
                                    theme: { type: "string" },
                                    language: { type: "string" },
                                }
                            }
                        }
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
             throw new Error('No valid JSON response from AI.');
        }
        
        try {
             // Try to parse the top-level response. It might be the form array, or wrapped in a 'forms' key.
             const parsed = JSON.parse(jsonText);
             return parsed.forms || parsed;
        } catch (e) {
             throw new Error("Failed to parse AI response as JSON.");
        }
    }
    
    // Helper function for general text response (like analysis/insights)
    private static async getTextContent(
        systemPrompt: string, 
        userPrompt: string, 
        model: string = 'gemini-2.5-flash'
    ): Promise<string> {
        if (!gemini) {
            throw new Error('Gemini API key is not configured.');
        }

        const response = await gemini.models.generateContent({
            model: model,
            contents: [
                { role: 'user', parts: [{ text: userPrompt }] }
            ],
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7
            }
        });

        return response.text.trim();
    }


    static async generateForms(prompt: string, language: string = 'English'): Promise<GeneratedForm[]> {
        if (!gemini) { // Check for gemini client instead of openai
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

            const forms = await this.getJsonContent(systemPrompt, userPrompt);
            
            if (!Array.isArray(forms)) {
                 throw new Error("AI did not return a valid array of forms.");
            }

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

    // --- Method for REFINING A FORM ---
    static async refineForm(existingForm: GeneratedForm, prompt: string): Promise<GeneratedForm> {
        if (!gemini) { // Check for gemini client instead of openai
            // Fallback logic for when AI is not available
            const refinedForm = JSON.parse(JSON.stringify(existingForm)); 
            refinedForm.fields.push({
                id: crypto.randomUUID(),
                type: 'text' as const,
                label: `New field based on: "${prompt}" (Fallback)`,
                placeholder: 'This is a sample refined field',
                required: false,
            });
            return refinedForm;
        }

        try {
            const systemPrompt = `You are an expert form editor. The user will provide an existing form as a JSON object and a prompt with instructions to modify it. Your task is to apply the requested changes and return the single, updated form as a valid JSON object.
Requirements:
- Only return ONE updated form object. Do not return an array.
- The returned JSON object must be a complete and valid form structure.
- Do not change the 'id' of the form or the 'id' of existing fields.
- When adding new fields, generate a new unique UUID for the 'id' for them.
- Interpret the user's request and modify the form accordingly (e.g., add, remove, or change fields, update labels, change validation).
- Ensure all text content remains in the form's original language: ${existingForm.language}.`;

            const userPrompt = `Here is the current form:
${JSON.stringify(existingForm, null, 2)}

Please apply this change: "${prompt}"`;

            // Use the JSON helper which now correctly handles the model call
            const refinedForm = await this.getJsonContent(systemPrompt, userPrompt);
            
            // We need to ensure the top-level ID from the original form is preserved
            refinedForm.id = existingForm.id;

            return refinedForm as GeneratedForm;

        } catch (error) {
            console.error('Error refining form:', error);
            throw new Error('Failed to refine form with AI.');
        }
    }


    // --- Method for TRANSLATING A FORM ---
    static async translateForm(form: GeneratedForm, targetLanguage: string): Promise<GeneratedForm> {
        if (!gemini) { // Check for gemini client instead of openai
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
Keep the technical structure (field types, validation rules, etc.) unchanged.
Return the complete translated form as a single valid JSON object.`;

            const userPrompt = `Translate this form to ${targetLanguage}:
${JSON.stringify(form, null, 2)}`

            const translatedForm = await this.getJsonContent(systemPrompt, userPrompt);
            
            return {
                ...translatedForm,
                language: targetLanguage,
            } as GeneratedForm;
            
        } catch (error) {
            console.error('Error translating form:', error)
            // Fallback: Return the same form with updated language
            return { ...form, language: targetLanguage }
        }
    }

    // --- Method for ANALYZING FORM DATA ---
    static async analyzeFormData(formData: any): Promise<FormAnalytics> {
        if (!gemini) { // Check for gemini client instead of openai
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
Provide insights that are actionable and easy to understand for non-technical users.
Return your insights as a numbered list of short, distinct sentences, each on a new line.`;

            const userPrompt = `Analyze this form data and provide insights:
${JSON.stringify(formData, null, 2)}`;

            const responseText = await this.getTextContent(systemPrompt, userPrompt);

            // Split response by new lines to get individual insights
            const insights = responseText.split('\n').map(line => line.trim().replace(/^\d+\.\s*/, '')).filter(line => line.length > 0);

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

    // --- Method for getting AI Insights (Q&A) ---
    static async getAIInsights(question: string, formData: any): Promise<string> {
        if (!gemini) { // Check for gemini client instead of openai
            return 'AI insights are not available. Please set up your GEMINI_API_KEY to enable this feature.'
        }

        try {
            const systemPrompt = `You are a helpful AI assistant that explains form analytics in simple terms. Answer user questions about their form data in a clear, conversational way.`;

            const userPrompt = `Question: ${question}
Form Data: ${JSON.stringify(formData, null, 2)}
Please provide a clear, simple explanation.`;

            return await this.getTextContent(systemPrompt, userPrompt);

        } catch (error) {
            console.error('Error getting AI insights:', error)
            return 'Sorry, I encountered an error while analyzing your data.'
        }
    }
// The fallback methods and utility functions remain unchanged.
// ...
// ...
    // Fallback methods for when AI is not available
    private static generateSampleForms(prompt: string, language: string): GeneratedForm[] {
        // ... (omitted for brevity)
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
        // ... (omitted for brevity)
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