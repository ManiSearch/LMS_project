/**
 * Comprehensive Evaluation Notification System
 * 
 * Handles all notification requirements for the evaluation module:
 * - Email notifications for evaluator assignments
 * - SMS notifications for schedule updates
 * - Push notifications for real-time updates
 * - Result publication notifications
 * - Revaluation request notifications
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Phone, 
  Bell, 
  Send, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  MessageSquare,
  Smartphone,
  Globe,
  Filter,
  Download,
  Eye,
  Plus
} from 'lucide-react';

// Notification types
export type NotificationType = 
  | 'evaluator_assignment'
  | 'schedule_update'
  | 'evaluation_reminder'
  | 'result_published'
  | 'revaluation_request'
  | 'revaluation_result'
  | 'deadline_reminder'
  | 'system_alert';

// Notification channels
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

// Notification priority levels
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// Notification status
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'read';

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  name: string;
  subject: string;
  content: string;
  channels: NotificationChannel[];
  variables: string[];
  priority: NotificationPriority;
  isActive: boolean;
}

export interface NotificationRecipient {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    in_app: boolean;
  };
}

export interface Notification {
  id: string;
  type: NotificationType;
  templateId: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  subject: string;
  content: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  metadata: Record<string, any>;
  retryCount: number;
  errorMessage?: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  batchingEnabled: boolean;
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
  defaultPriority: NotificationPriority;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface Props {
  onNotificationSent?: (notification: Notification) => void;
  settings?: NotificationSettings;
}

export const EvaluationNotificationSystem: React.FC<Props> = ({
  onNotificationSent,
  settings: initialSettings
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Default notification templates
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 'template_1',
      type: 'evaluator_assignment',
      name: 'Evaluator Assignment Notification',
      subject: 'New Answer Sheets Assigned for Evaluation',
      content: `Dear {{evaluator_name}},

You have been assigned {{sheet_count}} answer sheets for evaluation.

Evaluation Details:
- Subject: {{subject}}
- Exam: {{exam_name}}
- Zone: {{zone_name}}
- Venue: {{venue}}
- Date: {{evaluation_date}}
- Time: {{evaluation_time}}

Please login to the system to view your assignments and download the answer keys.

Instructions:
{{instructions}}

Contact the evaluation coordinator if you have any questions.

Best regards,
Examination Controller`,
      channels: ['email', 'sms'],
      variables: ['evaluator_name', 'sheet_count', 'subject', 'exam_name', 'zone_name', 'venue', 'evaluation_date', 'evaluation_time', 'instructions'],
      priority: 'high',
      isActive: true
    },
    {
      id: 'template_2',
      type: 'schedule_update',
      name: 'Schedule Update Notification',
      subject: 'Evaluation Schedule Updated',
      content: `Dear {{evaluator_name}},

The evaluation schedule has been updated for {{subject}}.

New Schedule:
- Date: {{new_date}}
- Time: {{new_time}}
- Venue: {{new_venue}}

Please make note of the changes and arrive at the new venue on time.

Best regards,
Examination Controller`,
      channels: ['email', 'sms'],
      variables: ['evaluator_name', 'subject', 'new_date', 'new_time', 'new_venue'],
      priority: 'high',
      isActive: true
    },
    {
      id: 'template_3',
      type: 'result_published',
      name: 'Results Published Notification',
      subject: 'Examination Results Published',
      content: `Dear {{student_name}},

Your examination results for {{exam_name}} have been published.

Results Summary:
- Subject: {{subject}}
- Marks: {{marks}}/{{total_marks}}
- Grade: {{grade}}
- Percentage: {{percentage}}%

You can view your detailed results and download the mark sheet by logging into the student portal.

If you wish to apply for revaluation, please do so within 7 days of this notification.

Best regards,
Examination Controller`,
      channels: ['email', 'sms', 'push'],
      variables: ['student_name', 'exam_name', 'subject', 'marks', 'total_marks', 'grade', 'percentage'],
      priority: 'medium',
      isActive: true
    },
    {
      id: 'template_4',
      type: 'revaluation_request',
      name: 'Revaluation Request Notification',
      subject: 'Revaluation Request Received',
      content: `Dear {{student_name}},

Your revaluation request for {{subject}} has been received and is being processed.

Request Details:
- Subject: {{subject}}
- Exam: {{exam_name}}
- Request Date: {{request_date}}
- Reference Number: {{reference_number}}

The revaluation process will take 7-10 working days. You will be notified once the results are available.

Best regards,
Examination Controller`,
      channels: ['email', 'in_app'],
      variables: ['student_name', 'subject', 'exam_name', 'request_date', 'reference_number'],
      priority: 'medium',
      isActive: true
    },
    {
      id: 'template_5',
      type: 'deadline_reminder',
      name: 'Evaluation Deadline Reminder',
      subject: 'Evaluation Deadline Approaching',
      content: `Dear {{evaluator_name}},

This is a reminder that the evaluation deadline for {{subject}} is approaching.

Deadline Details:
- Subject: {{subject}}
- Deadline: {{deadline_date}}
- Remaining Sheets: {{remaining_count}}
- Completed: {{completed_count}}

Please complete your assigned evaluations before the deadline to avoid any delays in result publication.

Best regards,
Examination Controller`,
      channels: ['email', 'sms', 'in_app'],
      variables: ['evaluator_name', 'subject', 'deadline_date', 'remaining_count', 'completed_count'],
      priority: 'high',
      isActive: true
    }
  ]);

  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif_1',
      type: 'evaluator_assignment',
      templateId: 'template_1',
      recipientId: 'EV001',
      recipientName: 'Dr. Sarah Wilson',
      recipientEmail: 'sarah.wilson@university.edu',
      recipientPhone: '+1-555-0101',
      subject: 'New Answer Sheets Assigned for Evaluation',
      content: 'You have been assigned 25 answer sheets for evaluation in Data Structures.',
      channels: ['email', 'sms'],
      priority: 'high',
      status: 'delivered',
      createdAt: '2024-03-18T10:00:00Z',
      sentAt: '2024-03-18T10:01:00Z',
      deliveredAt: '2024-03-18T10:02:00Z',
      metadata: {
        subject: 'Data Structures',
        sheetCount: 25,
        zone: 'Central Zone'
      },
      retryCount: 0
    },
    {
      id: 'notif_2',
      type: 'result_published',
      templateId: 'template_3',
      recipientId: 'ST001',
      recipientName: 'John Doe',
      recipientEmail: 'john.doe@student.edu',
      recipientPhone: '+1-555-0201',
      subject: 'Examination Results Published',
      content: 'Your examination results for Computer Science Mid-term have been published.',
      channels: ['email', 'push'],
      priority: 'medium',
      status: 'read',
      createdAt: '2024-03-18T15:00:00Z',
      sentAt: '2024-03-18T15:01:00Z',
      deliveredAt: '2024-03-18T15:02:00Z',
      readAt: '2024-03-18T16:30:00Z',
      metadata: {
        examName: 'Computer Science Mid-term',
        marks: 85,
        totalMarks: 100,
        grade: 'A'
      },
      retryCount: 0
    },
    {
      id: 'notif_3',
      type: 'deadline_reminder',
      templateId: 'template_5',
      recipientId: 'EV002',
      recipientName: 'Prof. Michael Chen',
      recipientEmail: 'michael.chen@university.edu',
      recipientPhone: '+1-555-0102',
      subject: 'Evaluation Deadline Approaching',
      content: 'Reminder: Evaluation deadline for Mathematics is in 2 days.',
      channels: ['email', 'sms'],
      priority: 'high',
      status: 'pending',
      createdAt: '2024-03-18T09:00:00Z',
      metadata: {
        subject: 'Mathematics',
        deadlineDate: '2024-03-20',
        remainingSheets: 5
      },
      retryCount: 0
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>(
    initialSettings || {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      batchingEnabled: false,
      batchSize: 10,
      retryAttempts: 3,
      retryDelay: 5000,
      defaultPriority: 'medium',
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      }
    }
  );

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent' || n.status === 'delivered' || n.status === 'read').length,
    pending: notifications.filter(n => n.status === 'pending').length,
    failed: notifications.filter(n => n.status === 'failed').length,
    delivered: notifications.filter(n => n.status === 'delivered' || n.status === 'read').length,
    read: notifications.filter(n => n.status === 'read').length
  };

  // Notification functions
  const sendNotification = async (
    templateId: string,
    recipientId: string,
    variables: Record<string, string>,
    customChannels?: NotificationChannel[]
  ) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Replace variables in content
    let processedContent = template.content;
    Object.entries(variables).forEach(([key, value]) => {
      processedContent = processedContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      type: template.type,
      templateId,
      recipientId,
      recipientName: variables.recipient_name || 'User',
      recipientEmail: variables.recipient_email || '',
      recipientPhone: variables.recipient_phone || '',
      subject: template.subject,
      content: processedContent,
      channels: customChannels || template.channels,
      priority: template.priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      metadata: variables,
      retryCount: 0
    };

    // Simulate sending
    setTimeout(() => {
      notification.status = 'sent';
      notification.sentAt = new Date().toISOString();
      
      setTimeout(() => {
        notification.status = 'delivered';
        notification.deliveredAt = new Date().toISOString();
        setNotifications(prev => [...prev, notification]);
        onNotificationSent?.(notification);
      }, 1000);
    }, 500);
  };

  const retryFailedNotification = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId 
        ? { ...n, status: 'pending', retryCount: n.retryCount + 1 }
        : n
    ));
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId 
        ? { ...n, status: 'read', readAt: new Date().toISOString() }
        : n
    ));
  };

  const getStatusIcon = (status: NotificationStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent': return <Send className="h-4 w-4 text-blue-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'read': return <Eye className="h-4 w-4 text-purple-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: NotificationStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification System</h2>
          <p className="text-gray-600">Manage evaluation notifications and alerts</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bell className="h-6 w-6 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Sent</p>
                <p className="text-2xl font-bold text-blue-900">{stats.sent}</p>
              </div>
              <Send className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Delivered</p>
                <p className="text-2xl font-bold text-green-900">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Read</p>
                <p className="text-2xl font-bold text-purple-900">{stats.read}</p>
              </div>
              <Eye className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Failed</p>
                <p className="text-2xl font-bold text-red-900">{stats.failed}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Notifications</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(notification.status)}
                        <div>
                          <p className="font-medium">{notification.subject}</p>
                          <p className="text-sm text-gray-500">
                            To: {notification.recipientName} ({notification.recipientEmail})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>Created: {new Date(notification.createdAt).toLocaleString()}</span>
                        {notification.sentAt && (
                          <span>Sent: {new Date(notification.sentAt).toLocaleString()}</span>
                        )}
                        <div className="flex gap-1">
                          {notification.channels.map((channel) => {
                            const Icon = channel === 'email' ? Mail : 
                                        channel === 'sms' ? Phone :
                                        channel === 'push' ? Smartphone : MessageSquare;
                            return <Icon key={channel} className="h-4 w-4" />;
                          })}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {notification.status === 'failed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => retryFailedNotification(notification.id)}
                          >
                            Retry
                          </Button>
                        )}
                        {notification.status === 'delivered' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{template.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={template.isActive ? 'default' : 'secondary'}>
                            {template.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(template.priority)}>
                            {template.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {template.channels.map((channel) => {
                          const Icon = channel === 'email' ? Mail : 
                                      channel === 'sms' ? Phone :
                                      channel === 'push' ? Smartphone : MessageSquare;
                          return (
                            <div key={channel} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                              <Icon className="h-3 w-3" />
                              {channel}
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Email Delivery Rate</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS Delivery Rate</span>
                    <span className="font-medium">99.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Push Notification Rate</span>
                    <span className="font-medium">96.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Response Time</span>
                    <span className="font-medium">2.3 seconds</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <span className="font-medium">1,247 sent</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>SMS</span>
                    </div>
                    <span className="font-medium">892 sent</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>Push</span>
                    </div>
                    <span className="font-medium">756 sent</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>In-App</span>
                    </div>
                    <span className="font-medium">345 sent</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EvaluationNotificationSystem;
