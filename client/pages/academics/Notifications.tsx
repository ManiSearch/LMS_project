import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { FormField } from '@/components/forms/FormField';
import { useFormHandler } from '@/hooks/useFormHandlers';
import { MessageSquare, Plus, Search, Send, Download, Upload, Bell, Mail, Smartphone, Users, Eye, FileText, Filter, Edit, Trash2, Calendar, User, Clock } from 'lucide-react';

const initialNotifications = [
  {
    id: 1,
    title: 'Mid-term Exam Schedule Released',
    type: 'Circular',
    recipients: 'All Students',
    channels: ['SMS', 'Email', 'Push'],
    status: 'Sent',
    sentDate: '2024-01-15',
    viewCount: 1245,
    downloadCount: 89,
    content: 'The mid-term examination schedule for all courses has been finalized and is now available. Students are advised to check their respective timetables and prepare accordingly.',
    createdBy: 'Academic Office',
    priority: 'High',
    attachment: 'midterm_schedule.pdf'
  },
  {
    id: 2,
    title: 'Fee Payment Deadline Reminder',
    type: 'Notice',
    recipients: 'Parents',
    channels: ['SMS', 'Email'],
    status: 'Scheduled',
    sentDate: '2024-01-20',
    viewCount: 0,
    downloadCount: 0,
    content: 'This is a reminder that the fee payment deadline for the current semester is approaching. Please ensure timely payment to avoid late fees.',
    createdBy: 'Finance Department',
    priority: 'Medium',
    attachment: null
  },
  {
    id: 3,
    title: 'Cultural Event Registration Open',
    type: 'Announcement',
    recipients: 'Students & Staff',
    channels: ['Push', 'Email'],
    status: 'Draft',
    sentDate: '2024-01-18',
    viewCount: 0,
    downloadCount: 0,
    content: 'Registration is now open for the annual cultural festival. Students and staff are encouraged to participate in various events and competitions.',
    createdBy: 'Cultural Committee',
    priority: 'Low',
    attachment: 'cultural_event_form.pdf'
  },
  {
    id: 4,
    title: 'Sports Day Registration',
    type: 'Notice',
    recipients: 'All Students',
    channels: ['Email', 'Push'],
    status: 'Sent',
    sentDate: '2024-01-12',
    viewCount: 890,
    downloadCount: 45,
    content: 'Annual sports day registration is now open for all students. Multiple sports categories are available for participation.',
    createdBy: 'Sports Department',
    priority: 'Medium',
    attachment: 'sports_registration.pdf'
  },
  {
    id: 5,
    title: 'Library New Books Arrival',
    type: 'Announcement',
    recipients: 'Students & Staff',
    channels: ['Email'],
    status: 'Sent',
    sentDate: '2024-01-10',
    viewCount: 567,
    downloadCount: 23,
    content: 'New collection of books has arrived in the library covering various subjects. Students and faculty are welcome to browse and borrow.',
    createdBy: 'Library',
    priority: 'Low',
    attachment: 'new_books_list.pdf'
  },
  {
    id: 6,
    title: 'Parent Meeting Schedule',
    type: 'Circular',
    recipients: 'Parents',
    channels: ['SMS', 'Email'],
    status: 'Scheduled',
    sentDate: '2024-01-25',
    viewCount: 0,
    downloadCount: 0,
    content: 'Parent-teacher meeting has been scheduled for the upcoming month. Please find the detailed schedule and confirm your attendance.',
    createdBy: 'Principal Office',
    priority: 'High',
    attachment: 'parent_meeting_schedule.pdf'
  },
  {
    id: 7,
    title: 'Holiday Notice',
    type: 'Notice',
    recipients: 'All Students',
    channels: ['SMS', 'Email', 'Push'],
    status: 'Draft',
    sentDate: '2024-01-22',
    viewCount: 0,
    downloadCount: 0,
    content: 'Notice regarding upcoming holidays and revised academic calendar for the semester.',
    createdBy: 'Administration',
    priority: 'Medium',
    attachment: null
  },
  {
    id: 8,
    title: 'Science Fair Registration',
    type: 'Announcement',
    recipients: 'Grade 9-12',
    channels: ['Email', 'Push'],
    status: 'Sent',
    sentDate: '2024-01-08',
    viewCount: 432,
    downloadCount: 67,
    content: 'Registration is now open for the annual science fair. Students from grades 9-12 can participate with their innovative projects.',
    createdBy: 'Science Department',
    priority: 'Medium',
    attachment: 'science_fair_guidelines.pdf'
  }
];

const quickTemplates = [
  {
    id: 'exam_schedule',
    title: 'Exam Schedule Notice',
    type: 'Circular',
    content: 'The examination schedule for [EXAM_TYPE] has been finalized. Students are advised to check their timetables and prepare accordingly. The exams will commence from [START_DATE] to [END_DATE].',
    defaultRecipients: 'All Students',
    defaultChannels: ['SMS', 'Email', 'Push']
  },
  {
    id: 'fee_reminder',
    title: 'Fee Payment Reminder',
    type: 'Notice',
    content: 'This is a reminder that the fee payment deadline for [SEMESTER] is [DEADLINE]. Please ensure timely payment to avoid late fees. For any queries, contact the finance department.',
    defaultRecipients: 'Parents',
    defaultChannels: ['SMS', 'Email']
  },
  {
    id: 'event_announcement',
    title: 'Event Announcement',
    type: 'Announcement',
    content: 'We are pleased to announce [EVENT_NAME] scheduled for [DATE]. Registration is open from [REG_START] to [REG_END]. For more details, please contact [CONTACT_INFO].',
    defaultRecipients: 'Students & Staff',
    defaultChannels: ['Email', 'Push']
  },
  {
    id: 'attendance_alert',
    title: 'Attendance Alert',
    type: 'Notice',
    content: 'This is to inform you that [STUDENT_NAME]\'s attendance is currently [PERCENTAGE]%, which is below the required minimum. Please ensure regular attendance to meet academic requirements.',
    defaultRecipients: 'Parents',
    defaultChannels: ['SMS', 'Email']
  },
  {
    id: 'result_publication',
    title: 'Results Publication',
    type: 'Circular',
    content: 'The results for [EXAM_TYPE] have been published and are now available on the student portal. Students can access their results using their login credentials.',
    defaultRecipients: 'All Students',
    defaultChannels: ['SMS', 'Email', 'Push']
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filteredNotifications, setFilteredNotifications] = useState(initialNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateNotificationOpen, setIsCreateNotificationOpen] = useState(false);
  const [isViewNotificationOpen, setIsViewNotificationOpen] = useState(false);
  const [isEditNotificationOpen, setIsEditNotificationOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [filterCriteria, setFilterCriteria] = useState({
    type: 'all',
    status: 'all',
    recipients: 'all',
    priority: 'all'
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    handlePageChange,
    totalItems,
    pageSize
  } = usePagination(filteredNotifications, 5);

  // Form handlers
  const notificationFormHandler = useFormHandler(
    ['title', 'type', 'recipients', 'content', 'priority', 'emailEnabled', 'smsEnabled', 'pushEnabled'],
    {
      title: '',
      type: '',
      recipients: '',
      content: '',
      priority: 'Medium',
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true
    }
  );

  // Safety check for form handler
  if (!notificationFormHandler) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  const getFormData = (handler: any) => {
    if (!handler || !handler.formState) {
      return {};
    }
    return Object.keys(handler.formState).reduce((acc, key) => {
      acc[key] = handler.formState[key]?.value || '';
      return acc;
    }, {} as Record<string, any>);
  };

  const handleInputChange = (handler: any) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!handler || !e?.target) {
      return;
    }
    handler.updateField(e.target.name, e.target.value);
  };

  const handleSwitchChange = (handler: any, name: string) => (checked: boolean) => {
    if (!handler || !name) {
      return;
    }
    handler.updateField(name, checked);
  };

  const handleSubmit = (handler: any, onSubmit: (data: any) => Promise<void>) => (e: React.FormEvent) => {
    e.preventDefault();
    if (!handler || !onSubmit) {
      return;
    }
    handler.submitForm(onSubmit);
  };

  // Search and filter functionality
  useEffect(() => {
    if (!notifications || !Array.isArray(notifications)) {
      setFilteredNotifications([]);
      return;
    }

    let filtered = notifications.filter(notification => {
      if (!notification) return false;

      const title = notification.title || '';
      const type = notification.type || '';
      const recipients = notification.recipients || '';
      const status = notification.status || '';
      const content = notification.content || '';
      const priority = notification.priority || '';

      const searchLower = (searchTerm || '').toLowerCase();
      const matchesSearch = title.toLowerCase().includes(searchLower) ||
        type.toLowerCase().includes(searchLower) ||
        recipients.toLowerCase().includes(searchLower) ||
        status.toLowerCase().includes(searchLower) ||
        content.toLowerCase().includes(searchLower);

      const matchesType = filterCriteria.type === 'all' || type === filterCriteria.type;
      const matchesStatus = filterCriteria.status === 'all' || status === filterCriteria.status;
      const matchesRecipients = filterCriteria.recipients === 'all' || recipients.includes(filterCriteria.recipients);
      const matchesPriority = filterCriteria.priority === 'all' || priority === filterCriteria.priority;

      return matchesSearch && matchesType && matchesStatus && matchesRecipients && matchesPriority;
    });
    setFilteredNotifications(filtered);
  }, [searchTerm, notifications, filterCriteria]);

  // Create notification
  const onCreateNotification = async (data: any) => {
    if (!data) {
      console.error('No data provided for notification creation');
      return;
    }

    const channels = [];
    if (data.emailEnabled) channels.push('Email');
    if (data.smsEnabled) channels.push('SMS');
    if (data.pushEnabled) channels.push('Push');

    const newNotification = {
      id: notifications.length + 1,
      title: data.title || '',
      type: data.type || '',
      recipients: data.recipients || '',
      channels: channels,
      status: 'Draft',
      sentDate: new Date().toISOString().split('T')[0],
      viewCount: 0,
      downloadCount: 0,
      content: data.content || '',
      createdBy: 'Current User',
      priority: data.priority || 'Medium',
      attachment: null
    };

    setNotifications(prev => [newNotification, ...prev]);
    setIsCreateNotificationOpen(false);
    notificationFormHandler.resetForm();
    alert('Notification created successfully!');
  };

  // Edit notification
  const onEditNotification = async (data: any) => {
    if (!selectedNotification || !data) {
      console.error('Missing data for notification edit');
      return;
    }

    const channels = [];
    if (data.emailEnabled) channels.push('Email');
    if (data.smsEnabled) channels.push('SMS');
    if (data.pushEnabled) channels.push('Push');

    setNotifications(prev => prev.map(notification =>
      notification.id === selectedNotification.id
        ? {
            ...notification,
            title: data.title || notification.title,
            type: data.type || notification.type,
            recipients: data.recipients || notification.recipients,
            content: data.content || notification.content,
            priority: data.priority || notification.priority,
            channels: channels
          }
        : notification
    ));

    setIsEditNotificationOpen(false);
    setSelectedNotification(null);
    notificationFormHandler.resetForm();
    alert('Notification updated successfully!');
  };

  // View notification
  const handleViewNotification = (notification: any) => {
    if (!notification) {
      console.error('No notification provided');
      return;
    }

    setSelectedNotification(notification);
    setIsViewNotificationOpen(true);

    // Increment view count
    setNotifications(prev => prev.map(n =>
      n.id === notification.id ? { ...n, viewCount: (n.viewCount || 0) + 1 } : n
    ));
  };

  // Edit notification
  const handleEditNotification = (notification: any) => {
    if (!notification || !notificationFormHandler) {
      console.error('Missing notification data or form handler');
      return;
    }

    setSelectedNotification(notification);
    notificationFormHandler.updateField('title', notification.title || '');
    notificationFormHandler.updateField('type', notification.type || '');
    notificationFormHandler.updateField('recipients', notification.recipients || '');
    notificationFormHandler.updateField('content', notification.content || '');
    notificationFormHandler.updateField('priority', notification.priority || 'Medium');
    notificationFormHandler.updateField('emailEnabled', notification.channels?.includes('Email') || false);
    notificationFormHandler.updateField('smsEnabled', notification.channels?.includes('SMS') || false);
    notificationFormHandler.updateField('pushEnabled', notification.channels?.includes('Push') || false);
    setIsEditNotificationOpen(true);
  };

  // Delete notification
  const handleDeleteNotification = (notification: any) => {
    if (!notification) {
      console.error('No notification provided for deletion');
      return;
    }
    setSelectedNotification(notification);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteNotification = () => {
    if (!selectedNotification) {
      console.error('No notification selected for deletion');
      return;
    }

    setNotifications(prev => prev.filter(notification => notification.id !== selectedNotification.id));
    setIsDeleteDialogOpen(false);
    setSelectedNotification(null);
    alert('Notification deleted successfully!');
  };

  // Download notification
  const handleDownloadNotification = (notification: any) => {
    if (!notification) {
      console.error('No notification provided for download');
      return;
    }

    if (notification.attachment) {
      // Simulate download
      alert(`Downloading: ${notification.attachment}`);

      // Increment download count
      setNotifications(prev => prev.map(n =>
        n.id === notification.id ? { ...n, downloadCount: (n.downloadCount || 0) + 1 } : n
      ));
    } else {
      // Create a text file with notification content
      const content = `Title: ${notification.title}\nType: ${notification.type}\nRecipients: ${notification.recipients}\nDate: ${notification.sentDate}\nContent: ${notification.content}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notification_${notification.id}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Use template
  const handleUseTemplate = (template: any) => {
    if (!template || !notificationFormHandler) {
      console.error('Missing template data or form handler');
      return;
    }

    setSelectedTemplate(template);
    notificationFormHandler.updateField('title', template.title || '');
    notificationFormHandler.updateField('type', template.type || '');
    notificationFormHandler.updateField('recipients', template.defaultRecipients || '');
    notificationFormHandler.updateField('content', template.content || '');
    notificationFormHandler.updateField('priority', 'Medium');
    notificationFormHandler.updateField('emailEnabled', template.defaultChannels?.includes('Email') || false);
    notificationFormHandler.updateField('smsEnabled', template.defaultChannels?.includes('SMS') || false);
    notificationFormHandler.updateField('pushEnabled', template.defaultChannels?.includes('Push') || false);
    setIsTemplateDialogOpen(false);
    setIsCreateNotificationOpen(true);
  };

  // Export functionality
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'csv') {
      const csvContent = [
        ['Title', 'Type', 'Recipients', 'Status', 'Sent Date', 'Views', 'Downloads', 'Priority'].join(','),
        ...filteredNotifications.map(notification => [
          `"${notification.title}"`,
          notification.type,
          `"${notification.recipients}"`,
          notification.status,
          notification.sentDate,
          notification.viewCount,
          notification.downloadCount,
          notification.priority || 'Medium'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `notifications_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (format === 'excel') {
      alert('Excel export would be implemented with a library like xlsx');
    } else {
      alert('PDF export would generate a formatted report of all notifications');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent':
        return 'default';
      case 'Scheduled':
        return 'secondary';
      case 'Draft':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      case 'Low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communication & Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Send notices, circulars and communications to students, staff and parents via multiple channels
          </p>
        </div>
        <Dialog open={isCreateNotificationOpen} onOpenChange={setIsCreateNotificationOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Create New Notification
              </DialogTitle>
              <DialogDescription>
                Send notices, circulars or announcements to relevant stakeholders
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(notificationFormHandler, onCreateNotification)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Notification Type"
                  name="type"
                  type="select"
                  value={getFormData(notificationFormHandler).type}
                  onChange={handleInputChange(notificationFormHandler)}
                  options={[
                    { label: 'Notice', value: 'Notice' },
                    { label: 'Circular', value: 'Circular' },
                    { label: 'Announcement', value: 'Announcement' },
                    { label: 'Reminder', value: 'Reminder' },
                    { label: 'Alert', value: 'Alert' }
                  ]}
                  required
                />
                <FormField
                  label="Recipients"
                  name="recipients"
                  type="select"
                  value={getFormData(notificationFormHandler).recipients}
                  onChange={handleInputChange(notificationFormHandler)}
                  options={[
                    { label: 'All Students', value: 'All Students' },
                    { label: 'All Staff', value: 'All Staff' },
                    { label: 'All Parents', value: 'All Parents' },
                    { label: 'Students & Staff', value: 'Students & Staff' },
                    { label: 'Grade 9', value: 'Grade 9' },
                    { label: 'Grade 10', value: 'Grade 10' },
                    { label: 'Grade 11', value: 'Grade 11' },
                    { label: 'Grade 12', value: 'Grade 12' }
                  ]}
                  required
                />
              </div>
              
              <FormField
                label="Title"
                name="title"
                value={getFormData(notificationFormHandler).title}
                onChange={handleInputChange(notificationFormHandler)}
                placeholder="Enter notification title"
                required
              />
              
              <FormField
                label="Message Content"
                name="content"
                type="textarea"
                value={getFormData(notificationFormHandler).content}
                onChange={handleInputChange(notificationFormHandler)}
                placeholder="Enter your message content..."
                rows={4}
                required
              />
              
              <FormField
                label="Priority"
                name="priority"
                type="select"
                value={getFormData(notificationFormHandler).priority}
                onChange={handleInputChange(notificationFormHandler)}
                options={[
                  { label: 'Low', value: 'Low' },
                  { label: 'Medium', value: 'Medium' },
                  { label: 'High', value: 'High' }
                ]}
                required
              />
              
              <div>
                <label className="text-sm font-medium mb-3 block">Communication Channels</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Email Notification</span>
                    </div>
                    <Switch 
                      checked={getFormData(notificationFormHandler).emailEnabled}
                      onCheckedChange={handleSwitchChange(notificationFormHandler, 'emailEnabled')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <span className="text-sm">SMS Notification</span>
                    </div>
                    <Switch 
                      checked={getFormData(notificationFormHandler).smsEnabled}
                      onCheckedChange={handleSwitchChange(notificationFormHandler, 'smsEnabled')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Push Notification</span>
                    </div>
                    <Switch 
                      checked={getFormData(notificationFormHandler).pushEnabled}
                      onCheckedChange={handleSwitchChange(notificationFormHandler, 'pushEnabled')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 btn-primary" disabled={notificationFormHandler.isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  Save as Draft
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Notifications</p>
              <p className="text-3xl font-bold text-blue-900">{notifications.length}</p>
              <p className="text-xs text-blue-600">This month</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Delivery Rate</p>
              <p className="text-3xl font-bold text-green-900">98.5%</p>
              <p className="text-xs text-green-600">Successfully delivered</p>
            </div>
            <Send className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Views</p>
              <p className="text-3xl font-bold text-purple-900">{notifications.reduce((sum, n) => sum + n.viewCount, 0)}</p>
              <p className="text-xs text-purple-600">Across all notifications</p>
            </div>
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Downloads</p>
              <p className="text-3xl font-bold text-orange-900">{notifications.reduce((sum, n) => sum + n.downloadCount, 0)}</p>
              <p className="text-xs text-orange-600">Document downloads</p>
            </div>
            <Download className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <MessageSquare className="h-5 w-5" />
            </div>
            Communication History
          </CardTitle>
          <CardDescription>
            View and track all notices, circulars and communications sent to stakeholders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search notifications..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Filter Notifications</DialogTitle>
                  <DialogDescription>
                    Apply filters to narrow down the notification list
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select value={filterCriteria.type} onValueChange={(value) => setFilterCriteria({...filterCriteria, type: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Notice">Notice</SelectItem>
                        <SelectItem value="Circular">Circular</SelectItem>
                        <SelectItem value="Announcement">Announcement</SelectItem>
                        <SelectItem value="Reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select value={filterCriteria.status} onValueChange={(value) => setFilterCriteria({...filterCriteria, status: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Sent">Sent</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Recipients</label>
                    <Select value={filterCriteria.recipients} onValueChange={(value) => setFilterCriteria({...filterCriteria, recipients: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Recipients</SelectItem>
                        <SelectItem value="Students">Students</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                        <SelectItem value="Parents">Parents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={filterCriteria.priority} onValueChange={(value) => setFilterCriteria({...filterCriteria, priority: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => {
                    setFilterCriteria({ type: 'all', status: 'all', recipients: 'all', priority: 'all' });
                  }}>
                    Reset
                  </Button>
                  <Button onClick={() => setIsFilterDialogOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[350px]">
                <DialogHeader>
                  <DialogTitle>Export Notifications</DialogTitle>
                  <DialogDescription>
                    Choose export format for notifications report
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" onClick={() => handleExport('csv')} className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">CSV</span>
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('excel')} className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Excel</span>
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('pdf')} className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">PDF</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title & Type</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views/Downloads</TableHead>
                <TableHead>Date Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{notification.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{notification.type}</Badge>
                        {notification.priority && (
                          <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                            {notification.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {notification.recipients}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {notification.channels.map((channel) => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(notification.status)}>
                      {notification.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {notification.viewCount} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {notification.downloadCount} downloads
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {notification.sentDate}
                    </div>
                    {notification.createdBy && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {notification.createdBy}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewNotification(notification)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadNotification(notification)}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditNotification(notification)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteNotification(notification)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No notifications found matching your criteria.
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </CardContent>
      </Card>

      {/* View Notification Modal */}
      <Dialog open={isViewNotificationOpen} onOpenChange={setIsViewNotificationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
            <DialogDescription>
              Complete notification information and delivery statistics
            </DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <div className="font-medium mt-1">{selectedNotification.title}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedNotification.type}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Recipients</label>
                  <div className="font-medium mt-1">{selectedNotification.recipients}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusColor(selectedNotification.status)}>
                      {selectedNotification.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Content</label>
                <div className="mt-1 p-3 bg-muted rounded-lg">{selectedNotification.content}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Channels</label>
                  <div className="mt-1 flex gap-1">
                    {selectedNotification.channels.map((channel: string) => (
                      <Badge key={channel} variant="secondary" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <div className="mt-1">
                    <Badge variant={getPriorityColor(selectedNotification.priority || 'Medium')}>
                      {selectedNotification.priority || 'Medium'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Views</label>
                  <div className="font-medium mt-1">{selectedNotification.viewCount}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Downloads</label>
                  <div className="font-medium mt-1">{selectedNotification.downloadCount}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date Sent</label>
                  <div className="font-medium mt-1">{selectedNotification.sentDate}</div>
                </div>
              </div>

              {selectedNotification.attachment && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Attachment</label>
                  <div className="mt-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadNotification(selectedNotification)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {selectedNotification.attachment}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsViewNotificationOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Notification Modal */}
      <Dialog open={isEditNotificationOpen} onOpenChange={setIsEditNotificationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Notification</DialogTitle>
            <DialogDescription>
              Update notification details and delivery settings
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(notificationFormHandler, onEditNotification)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Notification Type"
                name="type"
                type="select"
                value={getFormData(notificationFormHandler).type}
                onChange={handleInputChange(notificationFormHandler)}
                options={[
                  { label: 'Notice', value: 'Notice' },
                  { label: 'Circular', value: 'Circular' },
                  { label: 'Announcement', value: 'Announcement' },
                  { label: 'Reminder', value: 'Reminder' }
                ]}
                required
              />
              <FormField
                label="Recipients"
                name="recipients"
                type="select"
                value={getFormData(notificationFormHandler).recipients}
                onChange={handleInputChange(notificationFormHandler)}
                options={[
                  { label: 'All Students', value: 'All Students' },
                  { label: 'All Staff', value: 'All Staff' },
                  { label: 'All Parents', value: 'All Parents' },
                  { label: 'Students & Staff', value: 'Students & Staff' }
                ]}
                required
              />
            </div>
            
            <FormField
              label="Title"
              name="title"
              value={getFormData(notificationFormHandler).title}
              onChange={handleInputChange(notificationFormHandler)}
              required
            />
            
            <FormField
              label="Message Content"
              name="content"
              type="textarea"
              value={getFormData(notificationFormHandler).content}
              onChange={handleInputChange(notificationFormHandler)}
              rows={4}
              required
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditNotificationOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={notificationFormHandler.isSubmitting}>
                Update Notification
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedNotification && (
            <div className="px-6 pb-4">
              <div className="p-3 bg-muted rounded-lg text-sm">
                <div><strong>Title:</strong> {selectedNotification.title}</div>
                <div><strong>Type:</strong> {selectedNotification.type}</div>
                <div><strong>Recipients:</strong> {selectedNotification.recipients}</div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteNotification} className="bg-red-600 hover:bg-red-700">
              Delete Notification
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="section-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Bell className="h-5 w-5" />
              </div>
              Communication Channels
            </CardTitle>
            <CardDescription>
              Configure notification delivery channels and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Send via registered email addresses</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-muted-foreground">Send to registered mobile numbers</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">Mobile/web push notifications</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="section-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <FileText className="h-5 w-5" />
              </div>
              Quick Templates
            </CardTitle>
            <CardDescription>
              Pre-defined templates for common communications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickTemplates.map((template) => (
              <Button 
                key={template.id}
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleUseTemplate(template)}
              >
                <FileText className="h-4 w-4 mr-2" />
                {template.title}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
