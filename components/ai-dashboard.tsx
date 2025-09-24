'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link'; // <--- THIS WAS THE MISSING IMPORT
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
  Share2,
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

// ... (The rest of the component remains the same)
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

// CHAT INTERFACE COMPONENT
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
                            : 'bg-white/80 dark:bg-slate-900/80 text-foreground border border-border/60 backdrop-blur'
                        }`}
                        >
                        <div className="text-sm leading-relaxed">{message.content}</div>
                        <p className="text-xs opacity-70 mt-2 text-right">
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
                    <div className="bg-white/80 dark:bg-slate-900/80 text-foreground p-4 rounded-2xl max-w-3xl border border-border/60">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                        ></div>
                    </div>
                    </div>
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t bg-background/80 backdrop-blur shrink-0">
                <div className="flex space-x-4">
                <div className="flex-1 relative">
                    <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Describe the form you want to create..."
                    className="w-full p-4 pr-12 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                    rows={1}
                    />
                    <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow"
                    >
                    <Send size={16} />
                    </button>
                </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground text-center">
                Try: "Create a registration form" or "Build a customer survey with
                rating scale"
                </div>
            </div>
        </div>
    );
};

// FORMS LIBRARY COMPONENT
interface FormsLibraryProps {
    forms: FormItem[];
    isLoading: boolean;
    onDelete: (formId: string) => void;
    onUpdateStatus: (form: FormItem) => void;
    onPreview: (form: GeneratedForm) => void;
    onEdit: (form: GeneratedForm) => void;
    onShare: (form: FormItem) => void;
}

const FormsLibrary: React.FC<FormsLibraryProps> = ({ forms, isLoading, onDelete, onUpdateStatus, onPreview, onEdit, onShare }) => {
    
    if (isLoading) {
        return <div className="p-6 text-center text-muted-foreground">Loading your forms...</div>
    }
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    My Forms
                </h2>
                <Button asChild>
                    <Link href="/dashboard?tab=chat">
                        <Plus size={16} className="mr-2" />
                        Create New Form
                    </Link>
                </Button>
            </div>

            {forms.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
                    <p className="text-muted-foreground mb-4">Click "Create New Form" to get started with our AI.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forms.map((form) => (
                    <Card key={form.id} className="hover:shadow-lg transition-shadow flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{form.title}</CardTitle>
                                <Badge variant={form.status === 'active' ? 'default' : 'secondary'}>
                                    {form.status}
                                </Badge>
                            </div>
                            <CardDescription className="line-clamp-2">{form.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Created: {formatDate(form.created_at)}</span>
                                <span>{form.fields.length} fields</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="font-bold text-lg">{form.responses}</div>
                                    <div className="text-xs text-muted-foreground">Responses</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-lg">{form.views}</div>
                                    <div className="text-xs text-muted-foreground">Views</div>
                                </div>
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0 flex space-x-2">
                            <Button variant="outline" className="flex-1" onClick={() => onPreview(form)}>
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
                                    <DropdownMenuItem onClick={() => onUpdateStatus(form)}>
                                        {form.status === 'draft' ? <Check size={14} className="mr-2"/> : <X size={14} className="mr-2"/>}
                                        {form.status === 'draft' ? 'Publish' : 'Unpublish'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onShare(form)}>
                                        <Share2 size={14} className="mr-2"/> Share
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500" onClick={() => onDelete(form.id)}>
                                        <Trash2 size={14} className="mr-2"/> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

// ... (Keep Analytics component as it is)
const Analytics = () => <div className="p-6"><h2 className="text-2xl font-bold">Analytics</h2><p>Analytics coming soon.</p></div>;
const Settings = () => <div className="p-6"><h2 className="text-2xl font-bold">Settings</h2><p>Settings coming soon.</p></div>;


const AIDashboard: React.FC<AIDashboardProps> = ({ activeTab, setActiveTab }) => {
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

  const fetchForms = useCallback(async () => {
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
            published: form.published,
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
  }, [user]);

  useEffect(() => {
    fetchForms();
  }, [user, fetchForms]);

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
                variant="outline"
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
    if(window.confirm("Are you sure you want to delete this form? This action cannot be undone.")){
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
  
  const handleUpdateStatus = async (form: FormItem) => {
      const isPublishing = form.status === 'draft';
      const updatedForm = { ...form, published: isPublishing, publishedAt: isPublishing ? new Date() : undefined };

      try {
          await dbUpdateForm(form.id, updatedForm);
          fetchForms();
          toast.success(`Form ${isPublishing ? 'published' : 'unpublished'} successfully!`);
      } catch (error) {
          console.error("Error updating form status:", error);
          toast.error("Failed to update form status.");
      }
  };

  const handleShare = (form: FormItem) => {
    if (form.status !== 'active') {
        toast.error("Only published forms can be shared.");
        return;
    }
    const url = `${window.location.origin}/form/${form.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard!");
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
      {activeTab === 'forms' && <div className="overflow-y-auto h-full"><FormsLibrary forms={forms} setActiveTab={setActiveTab} isLoading={loadingForms} onDelete={handleDeleteForm} onUpdateStatus={handleUpdateStatus} onPreview={handlePreview} onEdit={handleEdit} onShare={handleShare}/></div>}
      {activeTab === 'analytics' && <Analytics />}
      {activeTab === 'settings' && <Settings />}
    </div>
  );
};

export default AIDashboard;