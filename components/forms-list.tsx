'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Eye, Edit, Share2, BarChart3, Search, Copy, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface FormsListProps {
  selectedForm: string | null;
  onSelectForm: (formId: string) => void;
}

const mockForms = [
  {
    id: 'form-1',
    title: 'Customer Feedback Survey',
    description: 'Collect feedback about our services',
    responses: 156,
    completion: 82,
    status: 'active',
    createdAt: '2024-01-15',
    views: 1240
  },
  {
    id: 'form-2',
    title: 'Job Application Form',
    description: 'Application form for open positions',
    responses: 89,
    completion: 91,
    status: 'active',
    createdAt: '2024-01-10',
    views: 567
  },
  {
    id: 'form-3',
    title: 'Event Registration',
    description: 'Register for our upcoming conference',
    responses: 234,
    completion: 67,
    status: 'paused',
    createdAt: '2024-01-08',
    views: 2100
  },
  {
    id: 'form-4',
    title: 'Product Survey',
    description: 'Survey about product preferences',
    responses: 67,
    completion: 75,
    status: 'active',
    createdAt: '2024-01-05',
    views: 445
  }
];

export function FormsList({ selectedForm, onSelectForm }: FormsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredForms = mockForms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || form.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={filter === 'paused' ? 'default' : 'outline'}
            onClick={() => setFilter('paused')}
            size="sm"
          >
            Paused
          </Button>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredForms.map((form) => (
          <Card 
            key={form.id} 
            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${
              selectedForm === form.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onSelectForm(form.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg line-clamp-1">{form.title}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {form.description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge 
                  variant={form.status === 'active' ? 'default' : 'secondary'}
                  className={form.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                >
                  {form.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {new Date(form.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Responses</p>
                  <p className="font-semibold text-blue-600">{form.responses}</p>
                </div>
                <div>
                  <p className="text-gray-600">Completion</p>
                  <p className="font-semibold text-green-600">{form.completion}%</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No forms found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}