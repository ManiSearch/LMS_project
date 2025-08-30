import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HelpCircle, MessageSquare, FileText, Phone, Mail, Globe, Search, 
  Plus, Send, Clock, CheckCircle, AlertCircle, Star, ThumbsUp, ThumbsDown,
  BookOpen, Video, Download, ExternalLink, Filter, Archive, Trash2,
  Edit, Save, Eye, Users, Headphones, MessageCircle, Zap, Settings,
  Lightbulb, Shield, CreditCard, Database, BarChart3, Calendar
} from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  responses: Array<{
    id: string;
    message: string;
    sender: string;
    role: 'user' | 'support';
    timestamp: string;
  }>;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
  views: number;
}

interface KnowledgeBase {
  id: string;
  title: string;
  content: string;
  category: string;
  type: 'article' | 'video' | 'guide';
  views: number;
  lastUpdated: string;
}

export default function HelpSupport() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ticket form state
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium' as const
  });

  // Mock data with CRUD operations
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Unable to access attendance module',
      description: 'I am getting an error when trying to view the attendance report.',
      category: 'technical',
      priority: 'high',
      status: 'in-progress',
      createdAt: '2024-01-15T10:30:00',
      updatedAt: '2024-01-16T14:20:00',
      responses: [
        {
          id: '1',
          message: 'Thank you for contacting support. We are investigating the attendance module issue.',
          sender: 'Support Team',
          role: 'support',
          timestamp: '2024-01-15T11:00:00'
        },
        {
          id: '2',
          message: 'The issue has been identified and a fix will be deployed shortly.',
          sender: 'Technical Support',
          role: 'support',
          timestamp: '2024-01-16T14:20:00'
        }
      ]
    },
    {
      id: '2',
      title: 'Feature request: Calendar export',
      description: 'It would be helpful to export calendar events to external calendar applications.',
      category: 'feature-request',
      priority: 'medium',
      status: 'open',
      createdAt: '2024-01-10T09:15:00',
      updatedAt: '2024-01-10T09:15:00',
      responses: []
    }
  ]);

  const [faqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and follow the instructions in the email you receive.',
      category: 'account',
      helpful: 25,
      notHelpful: 2,
      views: 150
    },
    {
      id: '2',
      question: 'How do I view my attendance report?',
      answer: 'Navigate to Academics > Attendance in the sidebar menu. You can view your attendance percentage and detailed reports for each subject.',
      category: 'academics',
      helpful: 18,
      notHelpful: 1,
      views: 95
    },
    {
      id: '3',
      question: 'Can I export my timetable?',
      answer: 'Yes, you can export your timetable as PDF or CSV. Go to Academics > Timetable and click the Export button.',
      category: 'academics',
      helpful: 12,
      notHelpful: 0,
      views: 75
    },
    {
      id: '4',
      question: 'How do I update my profile information?',
      answer: 'Click on your profile picture in the top-right corner and select "Profile Settings". You can update your personal information, contact details, and preferences.',
      category: 'account',
      helpful: 30,
      notHelpful: 3,
      views: 200
    },
    {
      id: '5',
      question: 'How do I submit assignments through the LMS?',
      answer: 'Go to Learning Management > Assignments, find your assignment, and click "Submit". Upload your files and add any comments before submitting.',
      category: 'lms',
      helpful: 15,
      notHelpful: 1,
      views: 88
    }
  ]);

  const [knowledgeBase] = useState<KnowledgeBase[]>([
    {
      id: '1',
      title: 'Getting Started with EduERP Suite',
      content: 'A comprehensive guide to help new users navigate the platform...',
      category: 'getting-started',
      type: 'guide',
      views: 500,
      lastUpdated: '2024-01-01'
    },
    {
      id: '2',
      title: 'Academic Calendar Management',
      content: 'Learn how to manage academic events, holidays, and important dates...',
      category: 'academics',
      type: 'article',
      views: 250,
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      title: 'Setting Up Notifications',
      content: 'Configure your notification preferences for optimal communication...',
      category: 'settings',
      type: 'video',
      views: 180,
      lastUpdated: '2024-01-05'
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'account', label: 'Account & Profile' },
    { value: 'academics', label: 'Academics' },
    { value: 'lms', label: 'Learning Management' },
    { value: 'technical', label: 'Technical Issues' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'feature-request', label: 'Feature Requests' },
    { value: 'general', label: 'General' }
  ];

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  // CRUD Operations
  const handleCreateTicket = async () => {
    if (!ticketForm.title || !ticketForm.description) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTicket: Ticket = {
        id: Date.now().toString(),
        title: ticketForm.title,
        description: ticketForm.description,
        category: ticketForm.category,
        priority: ticketForm.priority,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: []
      };

      setTickets(prev => [newTicket, ...prev]);
      setTicketForm({ title: '', description: '', category: 'general', priority: 'medium' });
      setIsCreateTicketOpen(false);
      console.log('Ticket created successfully');
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredKnowledgeBase = knowledgeBase.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground mt-2">
            Find answers, get help, and contact our support team
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>
                  Describe your issue and we'll help you resolve it
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Subject</Label>
                  <Input
                    id="title"
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm(prev => ({...prev, title: e.target.value}))}
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={ticketForm.category} onValueChange={(value) => setTicketForm(prev => ({...prev, category: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat.value !== 'all').map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={ticketForm.priority} onValueChange={(value: any) => setTicketForm(prev => ({...prev, priority: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm(prev => ({...prev, description: e.target.value}))}
                    placeholder="Provide detailed information about your issue..."
                    rows={5}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateTicketOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTicket} disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Ticket'}
                    <Send className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@edu.com</p>
                <p className="text-xs text-green-600">Response in 24 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-sm text-muted-foreground">+91 1800-123-4567</p>
                <p className="text-xs text-green-600">Mon-Fri 9 AM - 6 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Chat with us now</p>
                <p className="text-xs text-green-600">Available now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search FAQs, articles, or tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span>{faq.question}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {faq.views}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Was this helpful?</span>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {faq.helpful}
                              </Button>
                              <Button variant="outline" size="sm">
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                {faq.notHelpful}
                              </Button>
                            </div>
                          </div>
                          <Badge variant="outline">{categories.find(c => c.value === faq.category)?.label}</Badge>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKnowledgeBase.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {article.type === 'video' && <Video className="h-4 w-4 text-blue-600" />}
                        {article.type === 'article' && <FileText className="h-4 w-4 text-green-600" />}
                        {article.type === 'guide' && <BookOpen className="h-4 w-4 text-purple-600" />}
                        <Badge variant="outline" className="text-xs">
                          {article.type}
                        </Badge>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Updated: {new Date(article.lastUpdated).toLocaleDateString()}</span>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Track and manage your support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <Card key={ticket.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{ticket.title}</h3>
                                <Badge className={priorityColors[ticket.priority]}>
                                  {ticket.priority}
                                </Badge>
                                <Badge className={statusColors[ticket.status]}>
                                  {ticket.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{ticket.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                                <span>Category: {categories.find(c => c.value === ticket.category)?.label}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteTicket(ticket.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {ticket.responses.length > 0 && (
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-2">Recent Response:</h4>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">{ticket.responses[ticket.responses.length - 1].sender}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(ticket.responses[ticket.responses.length - 1].timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm">{ticket.responses[ticket.responses.length - 1].message}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                    <p className="text-muted-foreground mb-4">Create a new support ticket to get help</p>
                    <Button onClick={() => setIsCreateTicketOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Ticket
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Email Support</div>
                      <div className="text-sm text-muted-foreground">support@edu.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Phone Support</div>
                      <div className="text-sm text-muted-foreground">+91 1800-123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Business Hours</div>
                      <div className="text-sm text-muted-foreground">Monday - Friday: 9 AM - 6 PM IST</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Website</div>
                      <div className="text-sm text-muted-foreground">www.eduerp.com</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
                <CardDescription>Explore more ways to get help</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download User Manual
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Video Tutorials
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Community Forum
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Feature Requests
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Center
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current status of our services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { service: 'Academic Management', status: 'operational' },
                  { service: 'Learning Management System', status: 'operational' },
                  { service: 'Examination Module', status: 'operational' },
                  { service: 'Authentication Service', status: 'operational' },
                  { service: 'Notification Service', status: 'maintenance' }
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{service.service}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        service.status === 'operational' ? 'bg-green-500' : 
                        service.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm capitalize">{service.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
