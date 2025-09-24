'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Send,
  Plus,
  BarChart3,
  FileText,
  Eye,
  Trash2,
  Edit,
  Users,
  TrendingUp,
  Clock,
  Star,
  MoreHorizontal,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserForms, saveForm, deleteForm as dbDeleteForm, updateForm as dbUpdateForm } from '@/lib/database';
import { AIService, GeneratedForm } from '@/lib/ai';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type ChatMessage = {
  id: number;
  type: 'assistant' | 'user';
  content: React.ReactNode;
  timestamp: Date;
};

type FormItem = GeneratedForm & {
    created_at: string;
    responses: number;
    views: number;
    status: 'active' | 'draft';
    published: boolean;
};

// Local date formatting helper
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

interface AIDashboardProps {
  activeTab: 'chat' | 'forms' | 'analytics' | 'settings';
  setActiveTab: (tab: 'chat' | 'forms' | 'analytics' | 'settings') => void;
}

// ... (Keep the ChatInterface component as it is)
interface ChatInterfaceProps {
    chatMessages: ChatMessage[];
    isTyping: boolean;
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: () => void;
    handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatMessages, isTyping, inputMessage, setInputMessage, handleSendMessage, handleKeyPress }) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                        className={`max-w-3xl p-4 rounded-2xl ${
                            message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow'
                            : 'bg-white/80 dark:bg-slate-900/80 text-gray-800 dark:text-gray-100 border border-gray-200/60 dark:border-gray-700/60 backdrop-blur'
                        }`}
                        >
                        <div className="text-sm leading-relaxed">{message.content}</div>
                        <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            })}
                        </p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white/80 dark:bg-slate-900/80 text-gray-800 dark:text-gray-100 p-4 rounded-2xl max-w-3xl border border-gray-200/60 dark:border-gray-700/60">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                        ></div>
                    </div>
                    </div>
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur shrink-0">
                <div className="flex space-x-4">
                <div className="flex-1 relative">
                    <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Describe the form you want to create..."
                    className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 dark:bg-slate-950/60"
                    rows={2}
                    />
                    <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow"
                    >
                    <Send size={16} />
                    </button>
                </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                Try: "Create a registration form" or "Build a customer survey with
                rating scale"
                </div>
            </div>
        </div>
    );
};

// ... (Keep Analytics component as it is)
interface AnalyticsProps {
    forms: FormItem[];
}

const Analytics: React.FC<AnalyticsProps> = ({ forms }) => {
    const totalResponses = forms.reduce((sum, form) => sum + form.responses, 0);
    const totalViews = forms.reduce((sum, form) => sum + form.views, 0);
    const conversionRate =
      totalViews > 0 ? ((totalResponses / totalViews) * 100).toFixed(1) : 0;

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Analytics Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 p-6 border border-gray-200 dark:border-gray-700 rounded-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Forms
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {forms.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp size={14} className="text-green-600 mr-1" />
              <span className="text-sm text-green-600">+2 this week</span>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-6 border border-gray-200 dark:border-gray-700 rounded-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Responses
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {totalResponses}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp size={14} className="text-green-600 mr-1" />
              <span className="text-sm text-green-600">+12% vs last week</span>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-6 border border-gray-200 dark:border-gray-700 rounded-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Views
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {totalViews}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp size={14} className="text-green-600 mr-1" />
              <span className="text-sm text-green-600">+8% vs last week</span>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-6 border border-gray-200 dark:border-gray-700 rounded-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Conversion Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {conversionRate}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp size={14} className="text-green-600 mr-1" />
              <span className="text-sm text-green-600">+2.1% vs last week</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 dark:bg-slate-900/80 p-6 border border-gray-200 dark:border-gray-700 rounded-xl backdrop-blur">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Top Performing Forms
            </h3>
            <div className="space-y-4">
              {[...forms]
                .sort((a, b) => b.responses - a.responses)
                .slice(0, 3)
                .map((form, index) => (
                  <div
                    key={form.id}
                    className="flex items-center justify-between p-3 bg-white/70 dark:bg-slate-800/60 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0
                            ? 'bg-yellow-500'
                            : index === 1
                            ? 'bg-gray-400'
                            : 'bg-orange-400'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {form.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {form.responses} responses
                        </p>
                      </div>
                    </div>
                    <Star className="h-4 w-4 text-yellow-400" />
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-6 border border-gray-200 dark:border-gray-700 rounded-xl backdrop-blur">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-white/70 dark:bg-slate-800/60 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    New response on Contact Form
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/70 dark:bg-slate-800/60 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Form "Customer Survey" published
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    1 day ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/70 dark:bg-slate-800/60 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    5 new responses on Job Application
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    3 days ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

interface FormsLibraryProps {
    forms: FormItem[];
    setActiveTab: (tab: 'chat' | 'forms' | 'analytics' | 'settings') => void;
    isLoading: boolean;
    onDelete: (formId: string) => void;
    onUpdate: (formId: string, updatedForm: GeneratedForm) => void;
    onPreview: (form: GeneratedForm) => void;
    onEdit: (form: GeneratedForm) => void;
}

const FormsLibrary: React.FC<FormsLibraryProps> = ({ forms, setActiveTab, isLoading, onDelete, onUpdate, onPreview, onEdit }) => {
    
    if (isLoading) {
        return <div className="p-6 text-center">Loading forms...</div>
    }
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                My Forms
                </h2>
                <button
                onClick={() => setActiveTab('chat')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors shadow"
                >
                <Plus size={16} />
                <span>Create New Form</span>
                </button>
            </div>

            {forms.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">You haven't created any forms yet.</p>
                    <p className="text-gray-500">Click "Create New Form" to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forms.map((form) => (
                    <div
                        key={form.id}
                        className="bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow backdrop-blur flex flex-col"
                    >
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                                    {form.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {form.description}
                                    </p>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    form.status === 'active'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                    }`}
                                >
                                    {form.status}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <span>Created: {formatDate(form.created_at)}</span>
                                <span>{form.fields.length} fields</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                    <Users size={14} />
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {form.responses}
                                    </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Responses
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                    <Eye size={14} />
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {form.views}
                                    </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Views
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => onPreview(form)}>
                                <Eye size={14} className="mr-2"/> Preview
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <MoreHorizontal size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => onEdit(form)}>
                                        <Edit size={14} className="mr-2"/> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onUpdate(form.id, { ...form, publishedAt: form.status === 'draft' ? new Date() : undefined })}>
                                        {form.status === 'draft' ? <Check size={14} className="mr-2"/> : <X size={14} className="mr-2"/>}
                                        {form.status === 'draft' ? 'Publish' : 'Unpublish'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500" onClick={() => onDelete(form.id)}>
                                        <Trash2 size={14} className="mr-2"/> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AIDashboard: React.FC<AIDashboardProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'assistant',
      content:
        "Hello! I'm your AI form builder assistant. I can help you create custom forms by describing what you need. Try saying something like 'Create a contact form' or 'Build a survey for customer feedback'.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const fetchForms = async () => {
    if (!user) return;
    setLoadingForms(true);
    try {
        const userFormsData = await getUserForms(user.id);
        const formattedForms = userFormsData
            .filter(form => form.content) // Filter out forms without content
            .map((form: any) => ({
            ...form.content,
            id: form.id,
            created_at: form.created_at,
            responses: 0,
            views: 0,
            status: form.published ? 'active' : 'draft',
        }));
        setForms(formattedForms);
    } catch (error) {
        console.error("Error fetching forms:", error);
        toast.error("Could not fetch your forms.");
    } finally {
        setLoadingForms(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [user]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    const generatingMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "Great! I'm generating a couple of form options for you. This might take a moment...",
        timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, generatingMessage]);

    try {
        const generatedForms = await AIService.generateForms(currentInput);
        
        for (const form of generatedForms) {
            await saveForm(user.id, form);
        }

        const generatedMessage: ChatMessage = {
          id: Date.now() + 2,
          type: 'assistant',
          content: (
            <div className="space-y-3">
              <p>I've created two new form drafts for you!</p>
              <Button
                onClick={() => {
                  fetchForms();
                  setActiveTab('forms');
                }}
                size="sm"
                className="bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Generated Forms
              </Button>
            </div>
          ),
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, generatedMessage]);
        toast.success("New forms have been generated!");

    } catch (error) {
        console.error("Failed to generate and save forms:", error);
        const errorMessage: ChatMessage = {
            id: Date.now() + 2,
            type: 'assistant',
            content: "I'm sorry, I encountered an error while generating your forms. Please try again.",
            timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, errorMessage]);
        toast.error("Form generation failed.");
    } finally {
        setIsTyping(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleDeleteForm = async (formId: string) => {
    if(window.confirm("Are you sure you want to delete this form?")){
        try {
            await dbDeleteForm(formId);
            fetchForms();
            toast.success("Form deleted successfully!");
        } catch (error) {
            console.error("Error deleting form:", error);
            toast.error("Failed to delete form.");
        }
    }
  };
  
  const handleUpdateForm = async (formId: string, updatedForm: GeneratedForm) => {
      try {
          await dbUpdateForm(formId, updatedForm);
          fetchForms();
          toast.success("Form updated successfully!");
      } catch (error) {
          console.error("Error updating form:", error);
          toast.error("Failed to update form.");
      }
  };

  const handlePreview = (form: GeneratedForm) => {
      router.push(`/dashboard?view=preview&formId=${form.id}`);
  };
  
  const handleEdit = (form: GeneratedForm) => {
      router.push(`/dashboard?view=builder&formId=${form.id}`);
  };

  return (
    <div className="flex flex-col h-full">
      {activeTab === 'chat' && <ChatInterface 
        chatMessages={chatMessages}
        isTyping={isTyping}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
      />}
      {activeTab === 'forms' && <div className="overflow-y-auto h-full"><FormsLibrary forms={forms} setActiveTab={setActiveTab} isLoading={loadingForms} onDelete={handleDeleteForm} onUpdate={handleUpdateForm} onPreview={handlePreview} onEdit={handleEdit} /></div>}
      {activeTab === 'analytics' && <div className="overflow-y-auto h-full"><Analytics forms={forms}/></div>}
      {activeTab === 'settings' && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Coming soon.</p>
        </div>
      )}
    </div>
  );
};

export default AIDashboard;