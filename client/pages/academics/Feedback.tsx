import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { FormField } from '@/components/forms/FormField';
import { useFormHandler } from '@/hooks/useFormHandlers';
import { MessageSquare, Plus, Search, Star, Send, Eye, Edit, Trash2, Filter, Download, FileText, X } from 'lucide-react';

interface FeedbackItem {
  id: number;
  from: string;
  fromType: string;
  to: string;
  toType: string;
  subject: string;
  rating: number;
  message: string;
  date: string;
  status: string;
  response?: string;
  responseDate?: string;
}

const initialFeedbackData: FeedbackItem[] = [
  {
    id: 1,
    from: 'Suresh',
    fromType: 'Student',
    to: 'Dr. Lakshmi',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Helpful feedback on assignments.',
    date: '2023-12-18',
    status: 'Pending'
  },
  {
    id: 2,
    from: 'Divya',
    fromType: 'Student',
    to: 'Dr. Lakshmi',
    toType: 'Teacher',
    subject: 'English Literature',
    rating: 4,
    message: 'More group activities would be nice.',
    date: '2023-05-24',
    status: 'Pending'
  },
  {
    id: 3,
    from: 'Vignesh',
    fromType: 'Student',
    to: 'Dr. Mohan',
    toType: 'Teacher',
    subject: 'Chemistry Assignment',
    rating: 3,
    message: 'More group activities would be nice.',
    date: '2024-06-30',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2024-07-03'
  },
  {
    id: 4,
    from: 'Santhosh',
    fromType: 'Student',
    to: 'Dr. Arun',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Helpful feedback on assignments.',
    date: '2023-03-28',
    status: 'Pending'
  },
  {
    id: 5,
    from: 'Mohan',
    fromType: 'Student',
    to: 'Dr. Santhosh',
    toType: 'Teacher',
    subject: 'Mathematics Class',
    rating: 3,
    message: 'Helpful feedback on assignments.',
    date: '2023-09-19',
    status: 'Pending'
  },
  {
    id: 6,
    from: 'Anitha',
    fromType: 'Student',
    to: 'Dr. Bhavani',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 3,
    message: 'Enjoyed the interactive quizzes.',
    date: '2023-04-20',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2023-04-27'
  },
  {
    id: 7,
    from: 'Vignesh',
    fromType: 'Student',
    to: 'Dr. Mohan',
    toType: 'Teacher',
    subject: 'Chemistry Assignment',
    rating: 5,
    message: 'Helpful feedback on assignments.',
    date: '2023-02-18',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2023-02-20'
  },
  {
    id: 8,
    from: 'Mohan',
    fromType: 'Student',
    to: 'Dr. Karthik',
    toType: 'Teacher',
    subject: 'English Literature',
    rating: 5,
    message: 'Helpful feedback on assignments.',
    date: '2023-03-14',
    status: 'Pending'
  },
  {
    id: 9,
    from: 'Anitha',
    fromType: 'Student',
    to: 'Dr. Arun',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Great explanation of concepts. Would appreciate more examples.',
    date: '2024-02-07',
    status: 'Pending'
  },
  {
    id: 10,
    from: 'Karthik',
    fromType: 'Student',
    to: 'Dr. Keerthana',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 4,
    message: 'Enjoyed the interactive quizzes.',
    date: '2024-05-19',
    status: 'Resolved',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2024-05-20'
  },
  {
    id: 11,
    from: 'Revathi',
    fromType: 'Student',
    to: 'Dr. Vignesh',
    toType: 'Teacher',
    subject: 'Physics Lab',
    rating: 4,
    message: 'Great explanation of concepts. Would appreciate more examples.',
    date: '2024-04-10',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2024-04-12'
  },
  {
    id: 12,
    from: 'Arun',
    fromType: 'Student',
    to: 'Dr. Meena',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 5,
    message: 'Enjoyed the interactive quizzes.',
    date: '2023-08-15',
    status: 'New'
  },
  {
    id: 13,
    from: 'Anitha',
    fromType: 'Student',
    to: 'Dr. Pradeep',
    toType: 'Teacher',
    subject: 'Mathematics Class',
    rating: 4,
    message: 'Request more reference materials.',
    date: '2024-01-25',
    status: 'Resolved',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2024-01-27'
  },
  {
    id: 14,
    from: 'Karthik',
    fromType: 'Student',
    to: 'Dr. Lakshmi',
    toType: 'Teacher',
    subject: 'English Literature',
    rating: 3,
    message: 'Well-structured session, but a bit fast.',
    date: '2023-11-09',
    status: 'Pending'
  },
  {
    id: 15,
    from: 'Yamini',
    fromType: 'Student',
    to: 'Dr. Suresh',
    toType: 'Teacher',
    subject: 'Chemistry Assignment',
    rating: 5,
    message: 'Helpful feedback on assignments.',
    date: '2024-03-14',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2024-03-15'
  },
  {
    id: 16,
    from: 'Naveen',
    fromType: 'Student',
    to: 'Dr. Janani',
    toType: 'Teacher',
    subject: 'Physics Lab',
    rating: 4,
    message: 'More group activities would be nice.',
    date: '2023-07-22',
    status: 'Resolved',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2023-07-24'
  },
  {
    id: 17,
    from: 'Meena',
    fromType: 'Student',
    to: 'Dr. Santhosh',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 5,
    message: 'Great explanation of concepts. Would appreciate more examples.',
    date: '2024-06-05',
    status: 'New'
  },
  {
    id: 18,
    from: 'Pradeep',
    fromType: 'Student',
    to: 'Dr. Keerthana',
    toType: 'Teacher',
    subject: 'Mathematics Class',
    rating: 3,
    message: 'Request more reference materials.',
    date: '2023-05-30',
    status: 'Pending'
  },
  {
    id: 19,
    from: 'Keerthana',
    fromType: 'Student',
    to: 'Dr. Arun',
    toType: 'Teacher',
    subject: 'English Literature',
    rating: 4,
    message: 'Enjoyed the interactive quizzes.',
    date: '2023-10-02',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2023-10-03'
  },
  {
    id: 20,
    from: 'Divya',
    fromType: 'Student',
    to: 'Dr. Saravanan',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Helpful feedback on assignments.',
    date: '2023-12-19',
    status: 'New'
  },

  {
    id: 21,
    from: 'Saravanan',
    fromType: 'Student',
    to: 'Dr. Bhavani',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 4,
    message: 'Helpful feedback on assignments.',
    date: '2024-06-14',
    status: 'New'
  },
  {
    id: 22,
    from: 'Bhavani',
    fromType: 'Student',
    to: 'Dr. Keerthana',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 5,
    message: 'Enjoyed the interactive quizzes.',
    date: '2024-07-18',
    status: 'Resolved',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2024-07-21'
  },
  {
    id: 23,
    from: 'Ravi',
    fromType: 'Student',
    to: 'Dr. Karthik',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 4,
    message: 'Helpful feedback on assignments.',
    date: '2024-08-01',
    status: 'New'
  },
  {
    id: 24,
    from: 'Mohan',
    fromType: 'Student',
    to: 'Dr. Meena',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 5,
    message: 'More group activities would be nice.',
    date: '2023-03-21',
    status: 'Resolved',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2023-03-22'
  },
  {
    id: 25,
    from: 'Janani',
    fromType: 'Student',
    to: 'Dr. Mohan',
    toType: 'Teacher',
    subject: 'English Literature',
    rating: 5,
    message: 'More group activities would be nice.',
    date: '2023-10-25',
    status: 'Pending'
  },
  {
    id: 26,
    from: 'Arun',
    fromType: 'Student',
    to: 'Dr. Bhavani',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Well-structured session, but a bit fast.',
    date: '2023-09-18',
    status: 'Pending'
  },
  {
    id: 27,
    from: 'Meena',
    fromType: 'Student',
    to: 'Dr. Pradeep',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 4,
    message: 'Helpful feedback on assignments.',
    date: '2024-06-04',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2024-06-06'
  },
  {
    id: 28,
    from: 'Revathi',
    fromType: 'Student',
    to: 'Dr. Keerthana',
    toType: 'Teacher',
    subject: 'English Literature',
    rating: 4,
    message: 'Helpful feedback on assignments.',
    date: '2023-12-14',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2023-12-15'
  },
  {
    id: 29,
    from: 'Keerthana',
    fromType: 'Student',
    to: 'Dr. Priya',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Enjoyed the interactive quizzes.',
    date: '2024-01-09',
    status: 'New'
  },
  {
    id: 30,
    from: 'Ravi',
    fromType: 'Student',
    to: 'Dr. Divya',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Request more reference materials.',
    date: '2024-03-19',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2024-03-22'
  },
  {
    id: 21,
    from: 'Saravanan',
    fromType: 'Student',
    to: 'Dr. Bhavani',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 4,
    message: 'Helpful feedback on assignments.',
    date: '2024-06-14',
    status: 'New'
  },
  {
    id: 22,
    from: 'Bhavani',
    fromType: 'Student',
    to: 'Dr. Keerthana',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 5,
    message: 'Enjoyed the interactive quizzes.',
    date: '2024-07-18',
    status: 'Resolved',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2024-07-21'
  },
  {
    id: 23,
    from: 'Ravi',
    fromType: 'Student',
    to: 'Dr. Karthik',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 4,
    message: 'Helpful feedback on assignments.',
    date: '2024-08-01',
    status: 'New'
  },
  {
    id: 24,
    from: 'Mohan',
    fromType: 'Student',
    to: 'Dr. Meena',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 5,
    message: 'More group activities would be nice.',
    date: '2023-03-21',
    status: 'Resolved',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2023-03-22'
  },
  {
    id: 25,
    from: 'Janani',
    fromType: 'Student',
    to: 'Dr. Mohan',
    toType: 'Teacher',
    subject: 'English Literature',
    rating: 5,
    message: 'More group activities would be nice.',
    date: '2023-10-25',
    status: 'Pending'
  },
  {
    id: 26,
    from: 'Arun',
    fromType: 'Student',
    to: 'Dr. Bhavani',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Well-structured session, but a bit fast.',
    date: '2023-09-18',
    status: 'Pending'
  },
  {
    id: 27,
    from: 'Meena',
    fromType: 'Student',
    to: 'Dr. Pradeep',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 4,
    message: 'Helpful feedback on assignments.',
    date: '2024-06-04',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2024-06-06'
  },
  {
    id: 28,
    from: 'Revathi',
    fromType: 'Student',
    to: 'Dr. Keerthana',
    toType: 'Teacher',
    subject: 'English Literature',
    rating: 4,
    message: 'Helpful feedback on assignments.',
    date: '2023-12-14',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2023-12-15'
  },
  {
    id: 29,
    from: 'Keerthana',
    fromType: 'Student',
    to: 'Dr. Priya',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Enjoyed the interactive quizzes.',
    date: '2024-01-09',
    status: 'New'
  },
  {
    id: 30,
    from: 'Ravi',
    fromType: 'Student',
    to: 'Dr. Divya',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Request more reference materials.',
    date: '2024-03-19',
    status: 'Reviewed',
    response: 'Thank you for the feedback. Will incorporate your suggestions.',
    responseDate: '2024-03-22'
  },
  {
    id: 31,
    from: 'Karthika',
    fromType: 'Student',
    to: 'Dr. Mohan',
    toType: 'Teacher',
    subject: 'Mathematics Class',
    rating: 4,
    message: 'Would appreciate more practice problems.',
    date: '2024-01-10',
    status: 'Reviewed',
    response: 'I will include more in the upcoming sessions.',
    responseDate: '2024-01-12'
  },
  {
    id: 32,
    from: 'Vignesh',
    fromType: 'Student',
    to: 'Dr. Yamini',
    toType: 'Teacher',
    subject: 'Chemistry Assignment',
    rating: 5,
    message: 'Very clear and concise instructions.',
    date: '2024-02-18',
    status: 'New'
  },
  {
    id: 33,
    from: 'Priya',
    fromType: 'Student',
    to: 'Dr. Saravanan',
    toType: 'Teacher',
    subject: 'Physics Lab',
    rating: 3,
    message: 'Lab materials were missing.',
    date: '2023-12-02',
    status: 'Pending'
  },
  {
    id: 34,
    from: 'Ravi',
    fromType: 'Student',
    to: 'Dr. Bhavani',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 5,
    message: 'Appreciate your engaging teaching style!',
    date: '2023-09-21',
    status: 'Resolved',
    response: 'Glad to hear! Thanks for your kind words.',
    responseDate: '2023-09-23'
  },
  {
    id: 35,
    from: 'Janani',
    fromType: 'Student',
    to: 'Dr. Pradeep',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Nice flow of topics.',
    date: '2023-11-10',
    status: 'Reviewed',
    response: 'Thanks, I’ll continue this approach.',
    responseDate: '2023-11-12'
  },
  {
    id: 36,
    from: 'Suresh',
    fromType: 'Student',
    to: 'Dr. Meena',
    toType: 'Teacher',
    subject: 'English Literature',
    rating: 3,
    message: 'Slides were not shared on time.',
    date: '2024-04-03',
    status: 'Pending'
  },
  {
    id: 37,
    from: 'Divya',
    fromType: 'Student',
    to: 'Dr. Naveen',
    toType: 'Teacher',
    subject: 'Mathematics Class',
    rating: 4,
    message: 'Easy to follow. Thank you!',
    date: '2024-03-15',
    status: 'New'
  },
  {
    id: 38,
    from: 'Arun',
    fromType: 'Student',
    to: 'Dr. Lakshmi',
    toType: 'Teacher',
    subject: 'Physics Lab',
    rating: 5,
    message: 'Great experiments. Very hands-on.',
    date: '2023-08-28',
    status: 'Resolved',
    response: 'Happy to hear that. Thanks!',
    responseDate: '2023-08-30'
  },
  {
    id: 39,
    from: 'Keerthana',
    fromType: 'Student',
    to: 'Dr. Suresh',
    toType: 'Teacher',
    subject: 'Chemistry Assignment',
    rating: 4,
    message: 'Assignments are relevant to the exam.',
    date: '2023-07-10',
    status: 'Reviewed',
    response: 'Glad they help. I’ll keep that up.',
    responseDate: '2023-07-11'
  },
  {
    id: 40,
    from: 'Santhosh',
    fromType: 'Student',
    to: 'Dr. Janani',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 4,
    message: 'Can we have more live coding demos?',
    date: '2023-06-05',
    status: 'New'
  },
  {
    id: 41,
    from: 'Meena',
    fromType: 'Student',
    to: 'Dr. Vignesh',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Interesting lecture, more diagrams please.',
    date: '2023-09-11',
    status: 'Reviewed',
    response: 'Sure, I will add more diagrams.',
    responseDate: '2023-09-13'
  },
  {
    id: 42,
    from: 'Pradeep',
    fromType: 'Student',
    to: 'Dr. Revathi',
    toType: 'Teacher',
    subject: 'Statistics Class',
    rating: 5,
    message: 'Loved the real-world examples.',
    date: '2024-01-05',
    status: 'Resolved',
    response: 'Happy to hear! Thank you.',
    responseDate: '2024-01-07'
  },
  {
    id: 43,
    from: 'Bhavani',
    fromType: 'Student',
    to: 'Dr. Ravi',
    toType: 'Teacher',
    subject: 'Physics Lab',
    rating: 4,
    message: 'Please provide previous year questions.',
    date: '2024-02-12',
    status: 'Pending'
  },
  {
    id: 44,
    from: 'Anitha',
    fromType: 'Student',
    to: 'Dr. Saravanan',
    toType: 'Teacher',
    subject: 'Computer Science',
    rating: 5,
    message: 'Clear explanations and detailed notes.',
    date: '2023-10-22',
    status: 'New'
  },
  {
    id: 45,
    from: 'Mohan',
    fromType: 'Student',
    to: 'Dr. Keerthana',
    toType: 'Teacher',
    subject: 'Mathematics Class',
    rating: 4,
    message: 'Could we get recorded sessions?',
    date: '2023-12-13',
    status: 'Reviewed',
    response: 'I will try to arrange that soon.',
    responseDate: '2023-12-14'
  },
  {
    id: 46,
    from: 'Lakshmi',
    fromType: 'Student',
    to: 'Dr. Karthik',
    toType: 'Teacher',
    subject: 'English Literature',
    rating: 5,
    message: 'Amazing storytelling in class!',
    date: '2024-04-20',
    status: 'Resolved',
    response: 'Thanks! I’ll continue to engage.',
    responseDate: '2024-04-21'
  },
  {
    id: 47,
    from: 'Naveen',
    fromType: 'Student',
    to: 'Dr. Divya',
    toType: 'Teacher',
    subject: 'Chemistry Assignment',
    rating: 3,
    message: 'Could you reduce the assignment load?',
    date: '2023-11-30',
    status: 'Pending'
  },
  {
    id: 48,
    from: 'Revathi',
    fromType: 'Student',
    to: 'Dr. Mohan',
    toType: 'Teacher',
    subject: 'Statistics Class',
    rating: 4,
    message: 'Helpful class, appreciate the pace.',
    date: '2024-02-01',
    status: 'Reviewed',
    response: 'Thanks! Let me know if we need to slow down.',
    responseDate: '2024-02-03'
  },
  {
    id: 49,
    from: 'Ravi',
    fromType: 'Student',
    to: 'Dr. Priya',
    toType: 'Teacher',
    subject: 'Physics Lab',
    rating: 5,
    message: 'Well-prepared lab notes.',
    date: '2024-01-18',
    status: 'New'
  },
  {
    id: 50,
    from: 'Yamini',
    fromType: 'Student',
    to: 'Dr. Santhosh',
    toType: 'Teacher',
    subject: 'Biology Lecture',
    rating: 4,
    message: 'Please include more practicals.',
    date: '2023-09-17',
    status: 'Reviewed',
    response: 'Sure, I’ll include more practical sessions.',
    responseDate: '2023-09-18'
  },
  {
    id: 51,
    from: 'Kavitha',
    fromType: 'Student',
    to: 'Dr. Vasanth',
    toType: 'Teacher',
    subject: 'Environmental Science',
    rating: 4,
    message: 'Liked the field trip session.',
    date: '2024-03-02',
    status: 'Reviewed',
    response: 'Glad it was useful!',
    responseDate: '2024-03-04'
  },
  {
    id: 52,
    from: 'Dinesh',
    fromType: 'Student',
    to: 'Dr. Harini',
    toType: 'Teacher',
    subject: 'Civil Engineering',
    rating: 3,
    message: 'Would like more diagrams in notes.',
    date: '2023-10-10',
    status: 'Pending'
  },
  {
    id: 53,
    from: 'Meera',
    fromType: 'Student',
    to: 'Dr. Saran',
    toType: 'Teacher',
    subject: 'Architecture Theory',
    rating: 5,
    message: 'Very insightful class examples!',
    date: '2024-01-08',
    status: 'Resolved',
    response: 'Thank you! I’ll continue the same.',
    responseDate: '2024-01-09'
  },
  {
    id: 54,
    from: 'Rajkumar',
    fromType: 'Student',
    to: 'Dr. Kavitha',
    toType: 'Teacher',
    subject: 'Ethics in Engineering',
    rating: 4,
    message: 'Good pace and clear explanations.',
    date: '2023-08-21',
    status: 'New'
  },
  {
    id: 55,
    from: 'Harini',
    fromType: 'Student',
    to: 'Dr. Arun',
    toType: 'Teacher',
    subject: 'Fluid Mechanics',
    rating: 5,
    message: 'Excellent use of simulations.',
    date: '2024-02-14',
    status: 'Reviewed',
    response: 'Thanks! Simulations will be added more.',
    responseDate: '2024-02-15'
  },
  {
    id: 56,
    from: 'Vasanth',
    fromType: 'Student',
    to: 'Dr. Janani',
    toType: 'Teacher',
    subject: 'Thermodynamics',
    rating: 4,
    message: 'Can we get session notes sooner?',
    date: '2023-11-27',
    status: 'Pending'
  },
  {
    id: 57,
    from: 'Deepa',
    fromType: 'Student',
    to: 'Dr. Prakash',
    toType: 'Teacher',
    subject: 'Mechanics of Solids',
    rating: 3,
    message: 'Too many formulae in one session.',
    date: '2023-10-15',
    status: 'Reviewed',
    response: 'Will split over multiple classes.',
    responseDate: '2023-10-17'
  },
  {
    id: 58,
    from: 'Raghu',
    fromType: 'Student',
    to: 'Dr. Preethi',
    toType: 'Teacher',
    subject: 'Digital Electronics',
    rating: 5,
    message: 'Love the practical focus!',
    date: '2024-01-26',
    status: 'Resolved',
    response: 'Glad you’re enjoying it!',
    responseDate: '2024-01-27'
  },
  {
    id: 59,
    from: 'Monica',
    fromType: 'Student',
    to: 'Dr. Senthil',
    toType: 'Teacher',
    subject: 'Engineering Graphics',
    rating: 4,
    message: 'Good illustrations. Can we get 3D models too?',
    date: '2023-09-11',
    status: 'New'
  },
  {
    id: 60,
    from: 'Saravanan',
    fromType: 'Student',
    to: 'Dr. Aishwarya',
    toType: 'Teacher',
    subject: 'Machine Design',
    rating: 4,
    message: 'Diagrams are very helpful.',
    date: '2024-04-09',
    status: 'Reviewed',
    response: 'Thanks! I’ll add labeled versions too.',
    responseDate: '2024-04-10'
  },
  {
    id: 61,
    from: 'Aishwarya',
    fromType: 'Student',
    to: 'Dr. Gokul',
    toType: 'Teacher',
    subject: 'Control Systems',
    rating: 4,
    message: 'Concepts well explained.',
    date: '2024-02-12',
    status: 'New'
  },
  {
    id: 62,
    from: 'Sathish',
    fromType: 'Student',
    to: 'Dr. Anjali',
    toType: 'Teacher',
    subject: 'Engineering Maths',
    rating: 3,
    message: 'Please slow down a bit.',
    date: '2023-07-19',
    status: 'Reviewed',
    response: 'Sure! I’ll reduce the speed slightly.',
    responseDate: '2023-07-21'
  },
  {
    id: 63,
    from: 'Kaviya',
    fromType: 'Student',
    to: 'Dr. Ramesh',
    toType: 'Teacher',
    subject: 'Power Systems',
    rating: 5,
    message: 'Loved the use of real case studies.',
    date: '2024-03-05',
    status: 'Resolved',
    response: 'Happy to know! I’ll include more.',
    responseDate: '2024-03-06'
  },
  {
    id: 64,
    from: 'Prakash',
    fromType: 'Student',
    to: 'Dr. Indhu',
    toType: 'Teacher',
    subject: 'Embedded Systems',
    rating: 4,
    message: 'Well structured content.',
    date: '2023-11-01',
    status: 'Reviewed',
    response: 'Thank you!',
    responseDate: '2023-11-02'
  },
  {
    id: 65,
    from: 'Revathi',
    fromType: 'Student',
    to: 'Dr. Elango',
    toType: 'Teacher',
    subject: 'Construction Techniques',
    rating: 5,
    message: 'Useful site examples!',
    date: '2023-10-25',
    status: 'New'
  },
  {
    id: 66,
    from: 'Gokul',
    fromType: 'Student',
    to: 'Dr. Shalini',
    toType: 'Teacher',
    subject: 'Operating Systems',
    rating: 4,
    message: 'Good balance of theory and practice.',
    date: '2024-01-18',
    status: 'Reviewed',
    response: 'Thanks for the feedback.',
    responseDate: '2024-01-19'
  },
  {
    id: 67,
    from: 'Shalini',
    fromType: 'Student',
    to: 'Dr. Karthikeyan',
    toType: 'Teacher',
    subject: 'Database Systems',
    rating: 4,
    message: 'Can we get more SQL practice sets?',
    date: '2023-09-17',
    status: 'Reviewed',
    response: 'Yes! Will upload more.',
    responseDate: '2023-09-18'
  },
  {
    id: 68,
    from: 'Manoj',
    fromType: 'Student',
    to: 'Dr. Priyanka',
    toType: 'Teacher',
    subject: 'Computer Networks',
    rating: 4,
    message: 'Animations helped a lot.',
    date: '2023-12-04',
    status: 'New'
  },
  {
    id: 69,
    from: 'Indhu',
    fromType: 'Student',
    to: 'Dr. Natarajan',
    toType: 'Teacher',
    subject: 'Digital Signal Processing',
    rating: 5,
    message: 'Great energy and delivery.',
    date: '2023-08-14',
    status: 'Resolved',
    response: 'Thanks for the motivation!',
    responseDate: '2023-08-15'
  },
  {
    id: 70,
    from: 'Ramesh',
    fromType: 'Student',
    to: 'Dr. Haritha',
    toType: 'Teacher',
    subject: 'Control Systems',
    rating: 4,
    message: 'Appreciate the class discussions.',
    date: '2024-03-10',
    status: 'Reviewed',
    response: 'I’ll keep encouraging participation.',
    responseDate: '2024-03-12'
  },
  {
    id: 71,
    from: 'Nandhini',
    fromType: 'Student',
    to: 'Dr. Surya',
    toType: 'Teacher',
    subject: 'Probability and Statistics',
    rating: 5,
    message: 'Very clear and concise lectures.',
    date: '2024-02-05',
    status: 'Resolved',
    response: 'Thank you!',
    responseDate: '2024-02-06'
  },
  {
    id: 72,
    from: 'Vignesh',
    fromType: 'Student',
    to: 'Dr. Ramya',
    toType: 'Teacher',
    subject: 'Instrumentation',
    rating: 4,
    message: 'Good explanation, more examples needed.',
    date: '2024-01-15',
    status: 'Reviewed',
    response: 'Will do!',
    responseDate: '2024-01-16'
  },
  {
    id: 73,
    from: 'Anitha',
    fromType: 'Student',
    to: 'Dr. Manoj',
    toType: 'Teacher',
    subject: 'Materials Science',
    rating: 4,
    message: 'Interesting and practical sessions.',
    date: '2023-09-22',
    status: 'New'
  },
  {
    id: 74,
    from: 'Sundar',
    fromType: 'Student',
    to: 'Dr. Lavanya',
    toType: 'Teacher',
    subject: 'Computer Architecture',
    rating: 5,
    message: 'Great use of diagrams.',
    date: '2024-03-12',
    status: 'Reviewed',
    response: 'Glad to hear!',
    responseDate: '2024-03-13'
  },
  {
    id: 75,
    from: 'Priya',
    fromType: 'Student',
    to: 'Dr. Murugan',
    toType: 'Teacher',
    subject: 'Signal Processing',
    rating: 3,
    message: 'A bit too fast sometimes.',
    date: '2023-11-17',
    status: 'Pending'
  },
  {
    id: 76,
    from: 'Karthik',
    fromType: 'Student',
    to: 'Dr. Latha',
    toType: 'Teacher',
    subject: 'Software Engineering',
    rating: 4,
    message: 'Enjoyed group project sessions.',
    date: '2024-01-20',
    status: 'Resolved',
    response: 'Glad it helped!',
    responseDate: '2024-01-21'
  },
  {
    id: 77,
    from: 'Shruthi',
    fromType: 'Student',
    to: 'Dr. Rajan',
    toType: 'Teacher',
    subject: 'Structural Analysis',
    rating: 5,
    message: 'Really engaging lectures.',
    date: '2023-08-28',
    status: 'New'
  },
  {
    id: 78,
    from: 'Bala',
    fromType: 'Student',
    to: 'Dr. Divya',
    toType: 'Teacher',
    subject: 'Compiler Design',
    rating: 4,
    message: 'Clear breakdown of concepts.',
    date: '2023-09-05',
    status: 'Reviewed',
    response: 'Thanks Bala!',
    responseDate: '2023-09-06'
  },
  {
    id: 79,
    from: 'Keerthana',
    fromType: 'Student',
    to: 'Dr. Raghav',
    toType: 'Teacher',
    subject: 'Data Communication',
    rating: 5,
    message: 'Excellent slides and pace.',
    date: '2024-02-02',
    status: 'Resolved',
    response: 'Appreciate the feedback!',
    responseDate: '2024-02-03'
  },
  {
    id: 80,
    from: 'Yogesh',
    fromType: 'Student',
    to: 'Dr. Meena',
    toType: 'Teacher',
    subject: 'Numerical Methods',
    rating: 4,
    message: 'Helpful examples in class.',
    date: '2023-10-10',
    status: 'New'
  },
  {
    id: 81,
    from: 'Swetha',
    fromType: 'Student',
    to: 'Dr. Arjun',
    toType: 'Teacher',
    subject: 'Cloud Computing',
    rating: 5,
    message: 'Loved the AWS demos!',
    date: '2024-03-08',
    status: 'Reviewed',
    response: 'Happy you found it useful.',
    responseDate: '2024-03-09'
  },
  {
    id: 82,
    from: 'Naveen',
    fromType: 'Student',
    to: 'Dr. Shobana',
    toType: 'Teacher',
    subject: 'Mobile App Development',
    rating: 4,
    message: 'Enjoyed working on Android apps.',
    date: '2023-11-02',
    status: 'Reviewed'
  },
  {
    id: 83,
    from: 'Divya',
    fromType: 'Student',
    to: 'Dr. Rajesh',
    toType: 'Teacher',
    subject: 'Compiler Techniques',
    rating: 3,
    message: 'Can you simplify parsing part?',
    date: '2023-09-25',
    status: 'Pending'
  },
  {
    id: 84,
    from: 'Ganesh',
    fromType: 'Student',
    to: 'Dr. Nithya',
    toType: 'Teacher',
    subject: 'Wireless Communication',
    rating: 4,
    message: 'Great interaction in class.',
    date: '2024-01-27',
    status: 'Resolved',
    response: 'Thanks Ganesh!',
    responseDate: '2024-01-28'
  },
  {
    id: 85,
    from: 'Radha',
    fromType: 'Student',
    to: 'Dr. Elangovan',
    toType: 'Teacher',
    subject: 'Cryptography',
    rating: 5,
    message: 'Fascinating content!',
    date: '2023-12-05',
    status: 'Reviewed'
  },
  {
    id: 86,
    from: 'Saran',
    fromType: 'Student',
    to: 'Dr. Pavithra',
    toType: 'Teacher',
    subject: 'AI Fundamentals',
    rating: 4,
    message: 'Loved the project assignments.',
    date: '2024-01-05',
    status: 'New'
  },
  {
    id: 87,
    from: 'Shree',
    fromType: 'Student',
    to: 'Dr. Ramesh',
    toType: 'Teacher',
    subject: 'Blockchain Basics',
    rating: 4,
    message: 'Interesting and easy to follow.',
    date: '2024-02-11',
    status: 'Reviewed'
  },
  {
    id: 88,
    from: 'Vishnu',
    fromType: 'Student',
    to: 'Dr. Krithika',
    toType: 'Teacher',
    subject: 'Cyber Security',
    rating: 5,
    message: 'Great labs and demos.',
    date: '2024-03-17',
    status: 'Resolved',
    response: 'Thank you Vishnu!',
    responseDate: '2024-03-18'
  },
  {
    id: 89,
    from: 'Mohana',
    fromType: 'Student',
    to: 'Dr. Kannan',
    toType: 'Teacher',
    subject: 'Web Development',
    rating: 5,
    message: 'Enjoyed ReactJS session a lot!',
    date: '2023-10-15',
    status: 'Reviewed'
  },
  {
    id: 90,
    from: 'Aravind',
    fromType: 'Student',
    to: 'Dr. Shruthi',
    toType: 'Teacher',
    subject: 'Machine Learning',
    rating: 4,
    message: 'Good Jupyter notebook tutorials.',
    date: '2023-09-30',
    status: 'New'
  },
  {
    id: 91,
    from: 'Kavya',
    fromType: 'Student',
    to: 'Dr. Santhosh',
    toType: 'Teacher',
    subject: 'Database Systems',
    rating: 5,
    message: 'Great explanation of normalization.',
    date: '2024-03-01',
    status: 'Reviewed',
    response: 'Glad to hear that!',
    responseDate: '2024-03-02'
  },
  {
    id: 92,
    from: 'Hari',
    fromType: 'Student',
    to: 'Dr. Priya',
    toType: 'Teacher',
    subject: 'Discrete Mathematics',
    rating: 4,
    message: 'Good teaching. More quizzes would help.',
    date: '2024-02-08',
    status: 'New'
  },
  {
    id: 93,
    from: 'Meena',
    fromType: 'Student',
    to: 'Dr. Dinesh',
    toType: 'Teacher',
    subject: 'Digital Logic Design',
    rating: 3,
    message: 'Need better pacing in lectures.',
    date: '2023-10-20',
    status: 'Pending'
  },
  {
    id: 94,
    from: 'Arun',
    fromType: 'Student',
    to: 'Dr. Swathi',
    toType: 'Teacher',
    subject: 'Cloud Fundamentals',
    rating: 4,
    message: 'Interesting course content.',
    date: '2024-01-15',
    status: 'Reviewed'
  },
  {
    id: 95,
    from: 'Revathi',
    fromType: 'Student',
    to: 'Dr. Gokul',
    toType: 'Teacher',
    subject: 'Thermodynamics',
    rating: 5,
    message: 'Amazing examples and notes.',
    date: '2024-03-12',
    status: 'Resolved',
    response: 'Thank you!',
    responseDate: '2024-03-13'
  },
  {
    id: 96,
    from: 'Suresh',
    fromType: 'Student',
    to: 'Dr. Nivetha',
    toType: 'Teacher',
    subject: 'Microprocessors',
    rating: 4,
    message: 'Helpful diagrams and timing charts.',
    date: '2023-12-18',
    status: 'Reviewed'
  },
  {
    id: 97,
    from: 'Abinaya',
    fromType: 'Student',
    to: 'Dr. Harish',
    toType: 'Teacher',
    subject: 'Power Electronics',
    rating: 3,
    message: 'Could use more practice sets.',
    date: '2024-02-10',
    status: 'Pending'
  },
  {
    id: 98,
    from: 'Saravanan',
    fromType: 'Student',
    to: 'Dr. Lavanya',
    toType: 'Teacher',
    subject: 'Robotics',
    rating: 5,
    message: 'Excellent use of real-world demos!',
    date: '2023-11-25',
    status: 'Resolved',
    response: 'Glad you enjoyed it!',
    responseDate: '2023-11-26'
  },
  {
    id: 99,
    from: 'Deepa',
    fromType: 'Student',
    to: 'Dr. Aravind',
    toType: 'Teacher',
    subject: 'Electromagnetics',
    rating: 4,
    message: 'Very informative class.',
    date: '2024-01-03',
    status: 'Reviewed'
  },
  {
    id: 100,
    from: 'Manoj',
    fromType: 'Student',
    to: 'Dr. Bhavani',
    toType: 'Teacher',
    subject: 'Digital Signal Processing',
    rating: 5,
    message: 'Appreciated the hands-on lab sessions.',
    date: '2024-03-20',
    status: 'Reviewed'
  }

];

export default function Feedback() {
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>(initialFeedbackData);
  const [filteredData, setFilteredData] = useState<FeedbackItem[]>(initialFeedbackData);
  const [isCreateFeedbackOpen, setIsCreateFeedbackOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    rating: 'all',
    status: 'all',
    userType: 'all',
    dateRange: 'all'
  });
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Navigation state
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'view' | 'respond'>('list');

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    handlePageChange,
    totalItems,
    pageSize
  } = usePagination(filteredData, 5);

  // Navigation handlers
  const goToCreateFeedback = () => {
    setCurrentView('create');
  };

  const goToViewFeedback = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setCurrentView('view');
  };

  const goToRespondFeedback = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setCurrentView('respond');
  };

  const goBackToList = () => {
    setCurrentView('list');
    setSelectedFeedback(null);
  };

  // Form handlers
  const feedbackFormHandler = useFormHandler(
    ['subject', 'rating', 'message', 'recipient'],
    {
      subject: '',
      rating: 0,
      message: '',
      recipient: ''
    }
  );

  const responseFormHandler = useFormHandler(
    ['response'],
    {
      response: ''
    }
  );

  const getFormData = (handler: any) => {
    return Object.keys(handler.formState).reduce((acc, key) => {
      acc[key] = handler.formState[key].value;
      return acc;
    }, {} as Record<string, any>);
  };

  const handleInputChange = (handler: any) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handler.updateField(e.target.name, e.target.value);
  };

  const handleSubmit = (handler: any, onSubmit: (data: any) => Promise<void>) => (e: React.FormEvent) => {
    e.preventDefault();
    handler.submitForm(onSubmit);
  };

  // Auto-update metrics based on feedback data
  const calculateMetrics = () => {
    const total = feedbackData.length;
    const averageRating = feedbackData.reduce((sum, item) => sum + item.rating, 0) / total;
    const pendingResponses = feedbackData.filter(item => item.status === 'New' || item.status === 'Under Review').length;
    const responded = feedbackData.filter(item => item.status === 'Responded').length;
    const responseRate = (responded / total) * 100;

    return {
      total,
      averageRating: averageRating.toFixed(1),
      pendingResponses,
      responseRate: responseRate.toFixed(0)
    };
  };

  const metrics = calculateMetrics();

  // Search and filter functionality
  useEffect(() => {
    let filtered = feedbackData.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating = filterCriteria.rating === 'all' || item.rating.toString() === filterCriteria.rating;
      const matchesStatus = filterCriteria.status === 'all' || item.status === filterCriteria.status;
      const matchesUserType = filterCriteria.userType === 'all' || item.fromType === filterCriteria.userType;

      return matchesSearch && matchesRating && matchesStatus && matchesUserType;
    });

    setFilteredData(filtered);
  }, [searchTerm, filterCriteria, feedbackData]);

  // Create feedback
  const onCreateFeedback = async (data: any) => {
    const newFeedback: FeedbackItem = {
      id: feedbackData.length + 1,
      from: 'Current User', // In real app, this would come from auth
      fromType: 'Student', // In real app, this would come from user role
      to: data.recipient,
      toType: 'Teacher',
      subject: data.subject,
      rating: selectedRating,
      message: data.message,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };

    setFeedbackData(prev => [newFeedback, ...prev]);
    setIsCreateFeedbackOpen(false);
    feedbackFormHandler.resetForm();
    setSelectedRating(0);
    
    // Show success toast (in real app)
    alert('Feedback submitted successfully!');
  };

  // View feedback details
  const handleViewFeedback = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setIsViewModalOpen(true);
  };

  // Respond to feedback
  const handleRespondFeedback = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setIsRespondModalOpen(true);
  };

  const onSubmitResponse = async (data: any) => {
    if (!selectedFeedback) return;

    setFeedbackData(prev => prev.map(item => 
      item.id === selectedFeedback.id 
        ? { 
            ...item, 
            status: 'Responded', 
            response: data.response,
            responseDate: new Date().toISOString().split('T')[0]
          }
        : item
    ));

    setIsRespondModalOpen(false);
    setSelectedFeedback(null);
    responseFormHandler.resetForm();
    
    alert('Response sent successfully!');
  };

  // Delete feedback
  const handleDeleteFeedback = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteFeedback = () => {
    if (!selectedFeedback) return;

    setFeedbackData(prev => prev.filter(item => item.id !== selectedFeedback.id));
    setIsDeleteDialogOpen(false);
    setSelectedFeedback(null);
    
    alert('Feedback deleted successfully!');
  };

  // Export functionality
  const handleExport = (format: 'csv' | 'excel') => {
    if (format === 'csv') {
      const csvContent = [
        ['From', 'From Type', 'To', 'Subject', 'Rating', 'Message', 'Date', 'Status'].join(','),
        ...filteredData.map(item => [
          item.from,
          item.fromType,
          item.to,
          item.subject,
          item.rating,
          `"${item.message}"`,
          item.date,
          item.status
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `feedback_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      alert('Excel export functionality would be implemented with a library like xlsx');
    }
  };

  const renderStarRating = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
        {!interactive && <span className="text-sm ml-1">{rating}/5</span>}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'destructive';
      case 'Responded':
        return 'default';
      case 'Under Review':
        return 'secondary';
      case 'Read':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Render functions for different views
  const renderCreateFeedbackPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBackToList}>
            <X className="h-4 w-4 mr-2" />
            Back to Feedback
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Feedback</h1>
            <p className="text-muted-foreground mt-2">
              Submit feedback to teachers, administration, or courses
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Feedback</CardTitle>
          <CardDescription>
            Share your thoughts, suggestions, or concerns with the relevant person or department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={feedbackFormHandler.submitForm} className="space-y-4">
            <FormField
              label="Subject"
              name="subject"
              type="text"
              value={feedbackFormHandler.formState.subject?.value || ''}
              onChange={(e) => feedbackFormHandler.updateField('subject', e.target.value)}
              placeholder="Enter feedback subject..."
              required
            />

            <FormField
              label="Recipient"
              name="recipient"
              type="select"
              value={feedbackFormHandler.formState.recipient?.value || ''}
              onChange={(e) => feedbackFormHandler.updateField('recipient', e.target.value)}
              options={[
                { label: 'Dr. Lakshmi', value: 'Dr. Lakshmi' },
                { label: 'Dr. Mohan', value: 'Dr. Mohan' },
                { label: 'Dr. Arun', value: 'Dr. Arun' },
                { label: 'Dr. Santhosh', value: 'Dr. Santhosh' },
                { label: 'Administration', value: 'Administration' }
              ]}
              placeholder="Select recipient..."
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl ${star <= (hoverRating || selectedRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => {
                      setSelectedRating(star);
                      feedbackFormHandler.updateField('rating', star);
                    }}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {selectedRating > 0 ? `${selectedRating} star${selectedRating > 1 ? 's' : ''}` : 'Select a rating'}
                </span>
              </div>
            </div>

            <FormField
              label="Message"
              name="message"
              type="textarea"
              value={feedbackFormHandler.formState.message?.value || ''}
              onChange={(e) => feedbackFormHandler.updateField('message', e.target.value)}
              placeholder="Write your feedback message..."
              rows={6}
              required
            />

            <div className="border-t pt-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Feedback Guidelines:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be specific and constructive in your feedback</li>
                  <li>• Use respectful and professional language</li>
                  <li>• Provide suggestions for improvement when possible</li>
                  <li>• All feedback is anonymous unless you choose to include your contact details</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={goBackToList}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={feedbackFormHandler.isSubmitting}>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderViewFeedbackPage = () => {
    if (!selectedFeedback) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={goBackToList}>
              <X className="h-4 w-4 mr-2" />
              Back to Feedback
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">View Feedback</h1>
              <p className="text-muted-foreground mt-2">
                Feedback details and information
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">{selectedFeedback.subject}</CardTitle>
                <CardDescription>
                  From {selectedFeedback.from} ({selectedFeedback.fromType}) to {selectedFeedback.to} ({selectedFeedback.toType})
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {renderStarRating(selectedFeedback.rating)}
                <Badge variant={getStatusColor(selectedFeedback.status)}>
                  {selectedFeedback.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Feedback Message</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedFeedback.message}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Submitted Date</h4>
                <p className="text-muted-foreground">{selectedFeedback.date}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Rating</h4>
                <div className="flex items-center gap-2">
                  {renderStarRating(selectedFeedback.rating)}
                  <span className="text-sm text-muted-foreground">
                    ({selectedFeedback.rating} out of 5)
                  </span>
                </div>
              </div>
            </div>

            {selectedFeedback.response && (
              <div>
                <h4 className="font-medium mb-2">Response</h4>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="text-blue-800 mb-2">{selectedFeedback.response}</p>
                  {selectedFeedback.responseDate && (
                    <p className="text-xs text-blue-600">
                      Responded on {selectedFeedback.responseDate}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-end gap-3">
                {selectedFeedback.status === 'Pending' && (
                  <Button onClick={() => goToRespondFeedback(selectedFeedback)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Respond to Feedback
                  </Button>
                )}
                <Button variant="outline" onClick={goBackToList}>
                  Close
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRespondFeedbackPage = () => {
    if (!selectedFeedback) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={goBackToList}>
              <X className="h-4 w-4 mr-2" />
              Back to Feedback
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Respond to Feedback</h1>
              <p className="text-muted-foreground mt-2">
                Provide a response to this feedback
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Original Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{selectedFeedback.subject}</h4>
                <p className="text-sm text-muted-foreground">
                  From {selectedFeedback.from} • {selectedFeedback.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {renderStarRating(selectedFeedback.rating)}
                <span className="text-sm text-muted-foreground">
                  ({selectedFeedback.rating}/5)
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm">{selectedFeedback.message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Response Form */}
          <Card>
            <CardHeader>
              <CardTitle>Your Response</CardTitle>
              <CardDescription>
                Provide a thoughtful response to address the feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <FormField
                  label="Response Message"
                  name="response"
                  type="textarea"
                  placeholder="Write your response..."
                  rows={8}
                  required
                />

                <div className="border-t pt-4">
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-green-900 mb-2">Response Guidelines:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Acknowledge the feedback constructively</li>
                      <li>• Address specific points raised</li>
                      <li>• Provide clear action items if applicable</li>
                      <li>• Maintain a professional and respectful tone</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={goBackToList}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Send className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Handle different views
  if (currentView === 'create') {
    return renderCreateFeedbackPage();
  }

  if (currentView === 'view') {
    return renderViewFeedbackPage();
  }

  if (currentView === 'respond') {
    return renderRespondFeedbackPage();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback Management</h1>
          <p className="text-muted-foreground mt-2">
            Collect, manage, and respond to feedback from students, parents, and faculty.
          </p>
        </div>
        <Button className="btn-primary" onClick={goToCreateFeedback}>
          <Plus className="h-4 w-4 mr-2" />
          Create Feedback
        </Button>
        <Dialog open={isCreateFeedbackOpen} onOpenChange={setIsCreateFeedbackOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit New Feedback</DialogTitle>
              <DialogDescription>
                Share your thoughts and suggestions with the appropriate recipient
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(feedbackFormHandler, onCreateFeedback)} className="space-y-4">
              <FormField
                label="Subject"
                name="subject"
                value={getFormData(feedbackFormHandler).subject}
                onChange={handleInputChange(feedbackFormHandler)}
                placeholder="What is this feedback about?"
                required
              />
              
              <FormField
                label="Recipient"
                name="recipient"
                type="select"
                value={getFormData(feedbackFormHandler).recipient}
                onChange={handleInputChange(feedbackFormHandler)}
                options={[
                  { label: 'Dr.Manikandan', value: 'Dr.Manikandan' },
                  { label: 'Prof.Kumar', value: 'Prof.Kumar' },
                  { label: 'Dr.Deevakar', value: 'Dr.Deevakar' },
                  { label: 'IT Department', value: 'IT Department' }
                ]}
                required
              />

              <div>
                <label className="text-sm font-medium block mb-2">Rating</label>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-6 w-6 cursor-pointer transition-colors ${
                        i < (hoverRating || selectedRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                      }`}
                      onClick={() => setSelectedRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                  <span className="ml-2 text-sm">
                    {selectedRating > 0 ? `${selectedRating}/5` : 'Select rating'}
                  </span>
                </div>
              </div>

              <FormField
                label="Message"
                name="message"
                type="textarea"
                value={getFormData(feedbackFormHandler).message}
                onChange={handleInputChange(feedbackFormHandler)}
                placeholder="Share your detailed feedback..."
                rows={4}
                required
              />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateFeedbackOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={feedbackFormHandler.isSubmitting || selectedRating === 0}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
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
              <p className="text-sm font-medium text-blue-600">Total Feedback</p>
              <p className="text-3xl font-bold text-blue-900">{metrics.total}</p>
              <p className="text-xs text-blue-600">All submissions</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Average Rating</p>
              <p className="text-3xl font-bold text-yellow-900">{metrics.averageRating}</p>
              <p className="text-xs text-yellow-600">Out of 5 stars</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Pending Responses</p>
              <p className="text-3xl font-bold text-orange-900">{metrics.pendingResponses}</p>
              <p className="text-xs text-orange-600">Require attention</p>
            </div>
            <MessageSquare className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Response Rate</p>
              <p className="text-3xl font-bold text-green-900">{metrics.responseRate}%</p>
              <p className="text-xs text-green-600">Responded feedback</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="section-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              Feedback List
            </CardTitle>
            <CardDescription>
              View and manage all feedback submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search feedback..." 
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
                    <DialogTitle>Filter Feedback</DialogTitle>
                    <DialogDescription>
                      Apply filters to narrow down the feedback list
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Rating</label>
                      <Select value={filterCriteria.rating} onValueChange={(value) => setFilterCriteria({...filterCriteria, rating: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
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
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Under Review">Under Review</SelectItem>
                          <SelectItem value="Responded">Responded</SelectItem>
                          <SelectItem value="Read">Read</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">User Type</label>
                      <Select value={filterCriteria.userType} onValueChange={(value) => setFilterCriteria({...filterCriteria, userType: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="Student">Students</SelectItem>
                          <SelectItem value="Parent">Parents</SelectItem>
                          <SelectItem value="Teacher">Teachers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => {
                      setFilterCriteria({ rating: 'all', status: 'all', userType: 'all', dateRange: 'all' });
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
                <DialogContent className="sm:max-w-[300px]">
                  <DialogHeader>
                    <DialogTitle>Export Feedback</DialogTitle>
                    <DialogDescription>
                      Choose export format
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => handleExport('csv')} className="h-20 flex flex-col gap-2">
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">CSV</span>
                    </Button>
                    <Button variant="outline" onClick={() => handleExport('excel')} className="h-20 flex flex-col gap-2">
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">Excel</span>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From/To</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {feedback.from.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{feedback.from}</div>
                            <div className="text-xs text-muted-foreground">{feedback.fromType}</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          → {feedback.to} ({feedback.toType})
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{feedback.subject}</TableCell>
                    <TableCell>
                      {renderStarRating(feedback.rating)}
                    </TableCell>
                    <TableCell className="text-sm">{feedback.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(feedback.status)}>
                        {feedback.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => goToViewFeedback(feedback)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => goToRespondFeedback(feedback)}
                          title="Respond"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteFeedback(feedback)}
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

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No feedback found matching your criteria.
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
      </div>

      {/* View Feedback Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              Complete feedback information and response history
            </DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">From</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {selectedFeedback.from.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedFeedback.from}</div>
                      <div className="text-sm text-muted-foreground">{selectedFeedback.fromType}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">To</label>
                  <div className="mt-1">
                    <div className="font-medium">{selectedFeedback.to}</div>
                    <div className="text-sm text-muted-foreground">{selectedFeedback.toType}</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                <div className="font-medium mt-1">{selectedFeedback.subject}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rating</label>
                  <div className="mt-1">
                    {renderStarRating(selectedFeedback.rating)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <div className="font-medium mt-1">{selectedFeedback.date}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <div className="mt-1 p-3 bg-muted rounded-lg">{selectedFeedback.message}</div>
              </div>

              {selectedFeedback.response && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Response</label>
                  <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-800">{selectedFeedback.response}</div>
                    <div className="text-xs text-green-600 mt-2">
                      Responded on: {selectedFeedback.responseDate}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={getStatusColor(selectedFeedback.status)}>
                    {selectedFeedback.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Respond to Feedback Modal */}
      <Dialog open={isRespondModalOpen} onOpenChange={setIsRespondModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Respond to Feedback</DialogTitle>
            <DialogDescription>
              Send a response to this feedback submission
            </DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">{selectedFeedback.subject}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  From: {selectedFeedback.from} ({selectedFeedback.fromType})
                </div>
                <div className="text-sm mt-2">{selectedFeedback.message}</div>
              </div>

              <form onSubmit={handleSubmit(responseFormHandler, onSubmitResponse)} className="space-y-4">
                <FormField
                  label="Your Response"
                  name="response"
                  type="textarea"
                  value={getFormData(responseFormHandler).response}
                  onChange={handleInputChange(responseFormHandler)}
                  placeholder="Type your response here..."
                  rows={4}
                  required
                />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsRespondModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={responseFormHandler.isSubmitting}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedFeedback && (
            <div className="px-6 pb-4">
              <div className="p-3 bg-muted rounded-lg text-sm">
                <div><strong>Subject:</strong> {selectedFeedback.subject}</div>
                <div><strong>From:</strong> {selectedFeedback.from}</div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFeedback} className="bg-red-600 hover:bg-red-700">
              Delete Feedback
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="section-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              Feedback Categories
            </CardTitle>
            <CardDescription>
              Breakdown of feedback by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Teaching Quality</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
                  </div>
                  <span className="text-sm">156</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Facilities</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-3/5"></div>
                  </div>
                  <span className="text-sm">89</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Administration</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full w-2/5"></div>
                  </div>
                  <span className="text-sm">45</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Technology</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full w-1/5"></div>
                  </div>
                  <span className="text-sm">23</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="section-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest feedback and response activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbackData.slice(0, 3).map((feedback) => (
                <div key={feedback.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{feedback.from.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {feedback.from} {feedback.status === 'Responded' ? 'received response' : 'submitted feedback'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {feedback.subject} • {feedback.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
