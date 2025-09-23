'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Sparkles,
  BarChart3,
  Globe,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Users,
  FileText,
  TrendingUp,
  Eye,
  Menu, // Import the Menu icon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'; // Import the Sheet component

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FormCraft AI
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              Pricing
            </Button>
            <ThemeToggle />
            <Button
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate to different sections of the website.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Button variant="ghost">Features</Button>
                  <Button variant="ghost">Pricing</Button>
                  <Button variant="outline">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button>
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center max-w-7xl mx-auto">
          {/* Left side - Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Form Builder
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
              Create Beautiful Forms
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                with AI Magic
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl lg:max-w-none">
              Transform your ideas into stunning, professional forms in
              seconds. Just describe what you need, and our AI will craft the
              perfect form for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 transform hover:scale-105"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Start Building for Free
                  <ArrowRight
                    className={`ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform ${
                      isHovered ? 'translate-x-1' : ''
                    }`}
                  />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 dark:border-gray-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-gray-500 dark:text-gray-400 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Setup in 30 seconds
              </div>
            </div>
          </div>

          {/* Right side - Interactive Demo */}
          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
            <Card className="relative border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden max-w-lg mx-auto lg:max-w-none">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <CardTitle className="text-lg">Live Demo</CardTitle>
                <CardDescription>Try our AI form generator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Describe your form:
                  </label>
                  <div className="relative">
                    <Textarea
                      placeholder="Create a customer feedback form with name, email, rating scale, and comments..."
                      className="min-h-[80px] resize-none border-blue-200 focus:border-blue-400 pr-12"
                      defaultValue="Create a customer feedback form with name, email, rating scale, and comments"
                    />
                    <Button
                      size="sm"
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        AI is generating your form...
                      </span>
                    </div>

                    <div className="space-y-2 opacity-60">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Preview Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            See It In Action
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Watch how our AI transforms your ideas into beautiful, functional
            forms
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start max-w-7xl mx-auto">
          {/* Left - Input */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                AI Form Generator
              </CardTitle>
              <CardDescription>
                Describe what you need in plain English
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Try: 'Create a job application form with personal details, experience, and file upload'"
                className="min-h-[120px] border-blue-200 focus:border-blue-400"
                defaultValue="Create a customer satisfaction survey with rating questions, multiple choice options, and a comment section for additional feedback"
              />
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Form
              </Button>
            </CardContent>
          </Card>

          {/* Right - Generated Form Preview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Generated Form
              </CardTitle>
              <CardDescription>
                Your AI-generated form is ready!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Your Name *</Label>
                  <Input placeholder="Enter your full name" className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Overall Satisfaction *
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Additional Comments
                  </Label>
                  <Textarea
                    placeholder="Share your thoughts..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  Submit Response
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 transform hover:scale-105"
          >
            Try It Yourself - Free
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </section>

      {/* AI Magic Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              The AI Magic Behind It
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              See how our AI understands your needs and creates perfect forms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 group hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">
                  Natural Language Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm sm:text-base leading-relaxed">
                  Our AI understands your plain English descriptions and
                  converts them into structured form requirements.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 group hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">
                  Smart Field Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm sm:text-base leading-relaxed">
                  Automatically generates appropriate field types, validation
                  rules, and user-friendly labels.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 group hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">
                  Instant Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm sm:text-base leading-relaxed">
                  Forms are optimized for conversion rates, user experience,
                  and mobile responsiveness from the start.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Why Choose FormCraft AI?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Experience the future of form building with AI-powered automation
            and beautiful design
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/50 dark:to-slate-900 group hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                AI-Powered Creation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-sm sm:text-base leading-relaxed">
                Simply describe your form in natural language. Our AI
                understands your needs and creates professional forms
                instantly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/50 dark:to-slate-900 group hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Smart Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-sm sm:text-base leading-relaxed">
                Get AI-powered insights from your form responses. Understand
                trends, patterns, and user behavior automatically.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-white dark:from-green-950/50 dark:to-slate-900 group hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Global Ready
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-sm sm:text-base leading-relaxed">
                Built-in multilingual support starting with English and Hindi.
                Reach your global audience effortlessly.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center text-white max-w-4xl mx-auto">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 animate-pulse">
                50K+
              </div>
              <div className="text-sm sm:text-base text-blue-100 dark:text-blue-200">
                Forms Created
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 animate-pulse">
                2M+
              </div>
              <div className="text-sm sm:text-base text-blue-100 dark:text-blue-200">
                Responses Collected
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 animate-pulse">
                15K+
              </div>
              <div className="text-sm sm:text-base text-blue-100 dark:text-blue-200">
                Happy Users
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 animate-pulse">
                99.9%
              </div>
              <div className="text-sm sm:text-base text-blue-100 dark:text-blue-200">
                Uptime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Loved by Thousands
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            See what our users are saying about FormCraft AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {[
            {
              name: 'Sarah Chen',
              role: 'Product Manager',
              company: 'TechCorp',
              avatar:
                'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
              content:
                'FormCraft AI saved us hours of work. The AI understands exactly what we need and creates beautiful forms instantly.',
              rating: 5,
            },
            {
              name: 'Raj Patel',
              role: 'Marketing Director',
              company: 'GrowthLab',
              avatar:
                'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
              content:
                'The multilingual support is fantastic. We can now reach our global audience without any barriers.',
              rating: 5,
            },
            {
              name: 'Emily Rodriguez',
              role: 'UX Designer',
              company: 'DesignStudio',
              avatar:
                'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
              content:
                'The forms look absolutely stunning. Our response rates increased by 40% after switching to FormCraft AI.',
              rating: 5,
            },
          ].map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 dark:from-slate-950 dark:to-blue-950 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Ready to Transform Your Forms?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 dark:text-blue-200 leading-relaxed">
              Join thousands of users who are already creating beautiful,
              intelligent forms with AI. Start your free account today and
              experience the future of form building.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Start Building for Free
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-blue-300 text-blue-100 hover:bg-blue-800 dark:hover:bg-blue-900 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-200"
              >
                Schedule Demo
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-blue-200 dark:text-blue-300 justify-center">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Enterprise Security
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Lightning Fast
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold">FormCraft AI</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 leading-relaxed text-sm sm:text-base">
                The most intelligent form builder powered by AI. Create, share,
                and analyze forms like never before.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">
                Product
              </h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500 text-sm sm:text-base">
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">
                Company
              </h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500 text-sm sm:text-base">
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">
                Support
              </h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500 text-sm sm:text-base">
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 dark:text-gray-500 text-sm sm:text-base">
            <p>&copy; 2024 FormCraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}