'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  Plus,
  BarChart3,
  FileText,
  Eye,
  Download,
  Trash2,
  Edit,
  Users,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react';

type ChatMessage = {
  id: number;
  type: 'assistant' | 'user';
  content: string;
  timestamp: Date;
};

type FormItem = {
  id: number;
  title: string;
  description: string;
  created: string;
  responses: number;
  views: number;
  status: 'active' | 'draft';
  fields: string[];
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
                        <p className="text-sm leading-relaxed">{message.content}</p>
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

interface FormsLibraryProps {
    forms: FormItem[];
    setActiveTab: (tab: 'chat' | 'forms' | 'analytics' | 'settings') => void;
}

const FormsLibrary: React.FC<FormsLibraryProps> = ({ forms, setActiveTab }) => {
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map((form) => (
                <div
                    key={form.id}
                    className="bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow backdrop-blur"
                >
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
                    <span>Created: {formatDate(form.created)}</span>
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

                    <div className="flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <Eye size={14} />
                        <span className="text-sm">Preview</span>
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <Edit size={14} />
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <Download size={14} />
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                        <Trash2 size={14} />
                    </button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
};

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


const AIDashboard: React.FC<AIDashboardProps> = ({
  activeTab,
  setActiveTab,
}) => {
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
  const [forms, setForms] = useState<FormItem[]>([
    {
      id: 1,
      title: 'Contact Form',
      description: 'Basic contact form with name, email, and message',
      created: '2024-01-20',
      responses: 45,
      views: 120,
      status: 'active',
      fields: ['name', 'email', 'message'],
    },
    {
      id: 2,
      title: 'Customer Feedback Survey',
      description: 'Comprehensive feedback form for service quality',
      created: '2024-01-18',
      responses: 89,
      views: 200,
      status: 'active',
      fields: ['rating', 'experience', 'recommendations'],
    },
    {
      id: 3,
      title: 'Job Application Form',
      description: 'Detailed application form for hiring process',
      created: '2024-01-15',
      responses: 23,
      views: 78,
      status: 'draft',
      fields: ['personal_info', 'experience', 'skills', 'resume'],
    },
  ]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponses = [
        "I'll help you create that form! Let me generate a custom form based on your requirements. What specific fields would you like to include?",
        'Great idea! I can build that form for you. Would you like me to add any specific validation rules or styling preferences?',
        "Perfect! I'll create a professional form for you. Should I include any conditional logic or multi-step functionality?",
        'I understand what you need. Let me design a form that captures all the necessary information. Any particular design style you prefer?',
      ];

      const aiMessage: ChatMessage = {
        id: chatMessages.length + 2,
        type: 'assistant',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      if (
        userMessage.content.toLowerCase().includes('create') ||
        userMessage.content.toLowerCase().includes('build')
      ) {
        setTimeout(() => {
          const newForm: FormItem = {
            id: forms.length + 1,
            title: `Generated Form ${forms.length + 1}`,
            description: 'AI-generated form based on your prompt',
            created: new Date().toISOString().split('T')[0],
            responses: 0,
            views: 0,
            status: 'draft',
            fields: ['field1', 'field2', 'field3'],
          };
          setForms((prev) => [...prev, newForm]);
        }, 1000);
      }
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
      {activeTab === 'forms' && <div className="overflow-y-auto h-full"><FormsLibrary forms={forms} setActiveTab={setActiveTab} /></div>}
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