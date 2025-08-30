import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionGuard } from '@/components/PermissionGuard';
import { FileQuestion, Plus, Search, Edit, Upload, Download, Trash2, Eye, BookOpen, Target, Star, Filter } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'mcq' | 'short_answer' | 'long_answer' | 'numerical';
  marks: number;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  tags: string[];
  createdBy: string;
  createdDate: string;
  lastUsed?: string;
  usageCount: number;
  status: 'active' | 'inactive' | 'under_review';
}

interface QuestionCategory {
  id: string;
  name: string;
  subject: string;
  questionCount: number;
  totalMarks: number;
}

export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      text: 'What is the time complexity of binary search algorithm?',
      subject: 'Data Structures',
      topic: 'Searching Algorithms',
      difficulty: 'medium',
      type: 'mcq',
      marks: 2,
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctAnswer: 'O(log n)',
      explanation: 'Binary search divides the search space in half with each iteration.',
      tags: ['algorithm', 'complexity', 'searching'],
      createdBy: 'Dr. Sarah Wilson',
      createdDate: '2024-01-15',
      lastUsed: '2024-03-10',
      usageCount: 15,
      status: 'active'
    },
    {
      id: '2',
      text: 'Explain the concept of polymorphism in object-oriented programming.',
      subject: 'Programming',
      topic: 'OOP Concepts',
      difficulty: 'hard',
      type: 'long_answer',
      marks: 10,
      explanation: 'Polymorphism allows objects of different types to be treated as objects of a common base type.',
      tags: ['oop', 'polymorphism', 'inheritance'],
      createdBy: 'Prof. Michael Brown',
      createdDate: '2024-02-01',
      lastUsed: '2024-03-15',
      usageCount: 8,
      status: 'active'
    },
    {
      id: '3',
      text: 'Calculate the derivative of f(x) = x³ + 2x² - 5x + 3',
      subject: 'Mathematics',
      topic: 'Calculus',
      difficulty: 'medium',
      type: 'numerical',
      marks: 5,
      correctAnswer: '3x² + 4x - 5',
      tags: ['calculus', 'derivatives', 'polynomial'],
      createdBy: 'Dr. Lisa Chen',
      createdDate: '2024-01-20',
      usageCount: 12,
      status: 'active'
    }
  ]);

  const [categories] = useState<QuestionCategory[]>([
    { id: '1', name: 'Data Structures', subject: 'Computer Science', questionCount: 156, totalMarks: 780 },
    { id: '2', name: 'Algorithms', subject: 'Computer Science', questionCount: 142, totalMarks: 710 },
    { id: '3', name: 'Calculus', subject: 'Mathematics', questionCount: 98, totalMarks: 490 },
    { id: '4', name: 'OOP Concepts', subject: 'Programming', questionCount: 87, totalMarks: 435 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('questions');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    text: '',
    subject: '',
    topic: '',
    difficulty: 'medium' as const,
    type: 'mcq' as const,
    marks: 1,
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    tags: [] as string[]
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mcq': return 'bg-blue-100 text-blue-800';
      case 'short_answer': return 'bg-purple-100 text-purple-800';
      case 'long_answer': return 'bg-orange-100 text-orange-800';
      case 'numerical': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || question.subject === filterSubject;
    const matchesDifficulty = filterDifficulty === 'all' || question.difficulty === filterDifficulty;
    const matchesType = filterType === 'all' || question.type === filterType;
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
  });

  const stats = {
    total: questions.length,
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
    subjects: [...new Set(questions.map(q => q.subject))].length,
    totalMarks: questions.reduce((sum, q) => sum + q.marks, 0)
  };

  // CREATE - Add new question
  const handleCreateQuestion = () => {
    const question: Question = {
      id: Date.now().toString(),
      ...newQuestion,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
      usageCount: 0,
      status: 'active'
    };

    setQuestions([...questions, question]);
    setNewQuestion({
      text: '',
      subject: '',
      topic: '',
      difficulty: 'medium',
      type: 'mcq',
      marks: 1,
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      tags: []
    });
    setIsCreateDialogOpen(false);
  };

  // UPDATE - Edit question
  const handleEditQuestion = () => {
    if (selectedQuestion) {
      const updatedQuestion = {
        ...selectedQuestion,
        ...newQuestion
      };
      
      setQuestions(questions => questions.map(q => q.id === selectedQuestion.id ? updatedQuestion : q));
      setIsEditDialogOpen(false);
      setSelectedQuestion(null);
    }
  };

  // DELETE - Remove question
  const handleDeleteQuestion = () => {
    if (selectedQuestion) {
      setQuestions(questions => questions.filter(q => q.id !== selectedQuestion.id));
      setSelectedQuestion(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (question: Question) => {
    setSelectedQuestion(question);
    setNewQuestion({
      text: question.text,
      subject: question.subject,
      topic: question.topic,
      difficulty: question.difficulty,
      type: question.type,
      marks: question.marks,
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer || '',
      explanation: question.explanation || '',
      tags: question.tags
    });
    setIsEditDialogOpen(true);
  };

  return (
    <PermissionGuard resource="question_bank" operation="read">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
            <p className="text-muted-foreground mt-2">
              Manage examination questions, categorize by subjects and difficulty levels.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Questions
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Questions
            </Button>
            <PermissionGuard resource="question_bank" operation="create">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </DialogTrigger>
              </Dialog>
            </PermissionGuard>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Questions</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <FileQuestion className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Easy</p>
                  <p className="text-3xl font-bold text-green-900">{stats.easy}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Medium</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.medium}</p>
                </div>
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Hard</p>
                  <p className="text-3xl font-bold text-red-900">{stats.hard}</p>
                </div>
                <Star className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Subjects</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.subjects}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Total Marks</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.totalMarks}</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search questions by text, subject, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Data Structures">Data Structures</SelectItem>
              <SelectItem value="Programming">Programming</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="mcq">MCQ</SelectItem>
              <SelectItem value="short_answer">Short Answer</SelectItem>
              <SelectItem value="long_answer">Long Answer</SelectItem>
              <SelectItem value="numerical">Numerical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuestions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="font-medium truncate">{question.text}</p>
                              <p className="text-sm text-gray-500">{question.topic}</p>
                              <div className="flex gap-1 mt-1">
                                {question.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {question.subject}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getTypeColor(question.type)}>
                              {question.type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{question.marks}</span>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>Used: {question.usageCount} times</div>
                              {question.lastUsed && (
                                <div className="text-gray-500">Last: {question.lastUsed}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedQuestion(question);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <PermissionGuard resource="question_bank" operation="update">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(question)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                              <PermissionGuard resource="question_bank" operation="delete">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedQuestion(question);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {categories.map((category) => (
                    <Card key={category.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.subject}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex gap-4">
                              <div className="text-center">
                                <p className="text-lg font-bold">{category.questionCount}</p>
                                <p className="text-xs text-gray-500">Questions</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold">{category.totalMarks}</p>
                                <p className="text-xs text-gray-500">Total Marks</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Question Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogDescription>
                Create a new question for the question bank
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="questionText">Question Text</Label>
                <Textarea
                  id="questionText"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="Enter the question text..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newQuestion.subject}
                    onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                    placeholder="e.g., Data Structures"
                  />
                </div>
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                    placeholder="e.g., Binary Search Trees"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value as 'easy' | 'medium' | 'hard' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Question Type</Label>
                  <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion({ ...newQuestion, type: value as 'mcq' | 'short_answer' | 'long_answer' | 'numerical' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                      <SelectItem value="long_answer">Long Answer</SelectItem>
                      <SelectItem value="numerical">Numerical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="marks">Marks</Label>
                  <Input
                    id="marks"
                    type="number"
                    value={newQuestion.marks}
                    onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {newQuestion.type === 'mcq' && (
                <div>
                  <Label>Options</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {newQuestion.options.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => {
                          const options = [...newQuestion.options];
                          options[index] = e.target.value;
                          setNewQuestion({ ...newQuestion, options });
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                    <Input
                      id="correctAnswer"
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                      placeholder="Enter the correct answer"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  placeholder="Provide explanation for the answer..."
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateQuestion}>
                  Add Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Question Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
              <DialogDescription>
                Modify question details and settings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editQuestionText">Question Text</Label>
                <Textarea
                  id="editQuestionText"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editSubject">Subject</Label>
                  <Input
                    id="editSubject"
                    value={newQuestion.subject}
                    onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editTopic">Topic</Label>
                  <Input
                    id="editTopic"
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="editDifficulty">Difficulty</Label>
                  <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value as 'easy' | 'medium' | 'hard' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editType">Question Type</Label>
                  <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion({ ...newQuestion, type: value as 'mcq' | 'short_answer' | 'long_answer' | 'numerical' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                      <SelectItem value="long_answer">Long Answer</SelectItem>
                      <SelectItem value="numerical">Numerical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editMarks">Marks</Label>
                  <Input
                    id="editMarks"
                    type="number"
                    value={newQuestion.marks}
                    onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditQuestion}>
                  Update Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Question Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Question Details</DialogTitle>
            </DialogHeader>
            {selectedQuestion && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Question Text</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded">{selectedQuestion.text}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Subject</Label>
                    <p className="font-medium">{selectedQuestion.subject}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Topic</Label>
                    <p className="font-medium">{selectedQuestion.topic}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Difficulty</Label>
                    <Badge variant="outline" className={getDifficultyColor(selectedQuestion.difficulty)}>
                      {selectedQuestion.difficulty}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Type</Label>
                    <Badge variant="outline" className={getTypeColor(selectedQuestion.type)}>
                      {selectedQuestion.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Marks</Label>
                    <p className="text-lg font-bold">{selectedQuestion.marks}</p>
                  </div>
                </div>

                {selectedQuestion.options && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Options</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {selectedQuestion.options.map((option, index) => (
                        <p key={index} className={`p-2 rounded ${option === selectedQuestion.correctAnswer ? 'bg-green-100 font-medium' : 'bg-gray-50'}`}>
                          {String.fromCharCode(65 + index)}. {option}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {selectedQuestion.explanation && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Explanation</Label>
                    <p className="mt-1 p-3 bg-gray-50 rounded">{selectedQuestion.explanation}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Created By</Label>
                    <p>{selectedQuestion.createdBy}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Usage Count</Label>
                    <p>{selectedQuestion.usageCount} times</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the question from the question bank.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteQuestion} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PermissionGuard>
  );
}
